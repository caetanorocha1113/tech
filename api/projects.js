// POST /api/projects
//   { action: 'submit', studentId, missionId, title, description, link }  -> entrega + nota da banca + certificado
//   { action: 'review', id, approved }                                    -> equipe do programa decide se vai ao ar
//   { action: 'sponsor', id, sponsorId }                                  -> empresa apadrinha (limite do plano)
//   { action: 'invite', id, sponsorId }                                   -> empresa convida para conversa
import { getSql } from './_lib/db.js';
import { route, body, text, id, fail } from './_lib/http.js';
import { PLAN, XP, pub, genScores, total, newId } from './_lib/rules.js';

export default route(['POST'], async req => {
  const sql = getSql();
  const b = body(req);

  if (b.action === 'submit') {
    const studentId = id(b.studentId, 'jovem');
    const missionId = id(b.missionId, 'desafio');
    const title = text(b.title, 'título', 60);
    const description = text(b.description, 'descrição', 400);
    const link = text(b.link, 'link', 300, { optional: true });
    if (!link) fail(400, 'Informe o link do projeto.');

    const [ctx] = await sql`
      select s.name, s.school_id, s.city, p.status, m.title as mtitle, m.area, m.points, m.sponsor_id
      from students s
      join participations p on p.student_id = s.id and p.mission_id = ${missionId}
      join missions m on m.id = p.mission_id
      where s.id = ${studentId}`;
    if (!ctx) fail(400, 'Entre no desafio antes de enviar o projeto.');
    if (ctx.status === 'delivered') fail(409, 'Você já entregou este desafio.');

    const scores = genScores(), score = total(scores);
    const pid = newId('p'), cid = newId('c');
    const skillGain = Math.round(ctx.points / 12);
    await sql.transaction([
      sql`insert into projects (id, student_id, owner_name, school_id, city, mission_id, title, description, link, scores, score)
          values (${pid}, ${studentId}, ${ctx.name}, ${ctx.school_id}, ${ctx.city}, ${missionId}, ${title}, ${description}, ${link},
                  ${JSON.stringify(scores)}::jsonb, ${score})`,
      sql`insert into certificates (id, student_id, owner_name, school_id, city, title, area)
          values (${cid}, ${studentId}, ${ctx.name}, ${ctx.school_id}, ${ctx.city}, ${`${ctx.area} aplicado: ${ctx.mtitle}`}, ${ctx.area})`,
      sql`update participations set status = 'delivered' where student_id = ${studentId} and mission_id = ${missionId}`,
      sql`update missions set delivered_count = delivered_count + 1 where id = ${missionId}`,
      sql`update students set points = points + ${ctx.points},
            skills = jsonb_set(skills, ${'{' + ctx.area + '}'}::text[],
                               to_jsonb(least(100, coalesce((skills ->> ${ctx.area})::int, 0) + ${skillGain})))
          where id = ${studentId}`,
      sql`insert into feed (sponsor_scope, message) values
          (${ctx.sponsor_id}, ${`${pub(ctx.name)} entregou “${title}” no desafio “${ctx.mtitle}”.`}),
          ('*', ${`A banca técnica avaliou “${title}”: nota ${score}. Projeto na fila do quadro.`})`
    ]);
    return { id: pid, certId: cid, scores, score, awarded: ctx.points };
  }

  if (b.action === 'review') {
    const pid = id(b.id, 'projeto');
    const ok = !!b.approved;
    const rows = await sql`update projects set status = ${ok ? 'aprovado' : 'recusado'}
                           where id = ${pid} and status = 'pendente'
                           returning title, student_id, (select sponsor_id from missions where id = mission_id) as sp`;
    if (!rows.length) fail(409, 'Este projeto já foi analisado.');
    const p = rows[0];
    if (ok) {
      await sql.transaction([
        sql`insert into feed (message) values (${`“${p.title}” foi selecionado para o quadro Tech SC Jovem.`})`,
        sql`update students set points = points + ${XP.noAr} where id = ${p.student_id}`
      ]);
    } else {
      await sql`insert into feed (sponsor_scope, message) values (${p.sp}, ${`“${p.title}” não foi selecionado para o quadro desta vez.`})`;
    }
    return { ok: true };
  }

  if (b.action === 'sponsor') {
    const pid = id(b.id, 'projeto');
    const sponsorId = id(b.sponsorId, 'empresa');
    const [sp] = await sql`select name from sponsors where id = ${sponsorId}`;
    if (!sp) fail(404, 'Empresa não encontrada.');
    const ms = await sql`select plan from missions where sponsor_id = ${sponsorId}`;
    const allowed = ms.reduce((a, m) => a + PLAN[m.plan].pad, 0);
    const [{ n }] = await sql`select count(*)::int as n from projects where sponsor_id = ${sponsorId}`;
    if (n >= allowed) fail(409, allowed ? 'Seu plano não inclui mais apadrinhamentos.' : 'Lance um desafio para poder apadrinhar projetos.');
    const rows = await sql`update projects set sponsor_id = ${sponsorId}
                           where id = ${pid} and sponsor_id is null and status <> 'recusado' returning title`;
    if (!rows.length) fail(409, 'Este projeto já tem padrinho.');
    await sql`insert into feed (message) values (${`${sp.name} apadrinhou “${rows[0].title}”.`})`;
    return { ok: true };
  }

  if (b.action === 'invite') {
    const pid = id(b.id, 'projeto');
    const sponsorId = id(b.sponsorId, 'empresa');
    const [sp] = await sql`select name from sponsors where id = ${sponsorId}`;
    if (!sp) fail(404, 'Empresa não encontrada.');
    const [p] = await sql`select p.owner_name, coalesce(s.show_portfolio, true) as visible
                          from projects p left join students s on s.id = p.student_id where p.id = ${pid}`;
    if (!p) fail(404, 'Projeto não encontrado.');
    if (!p.visible) fail(403, 'Este jovem deixou o portfólio privado.');
    const rows = await sql`insert into invites (sponsor_id, project_id) values (${sponsorId}, ${pid})
                           on conflict do nothing returning project_id`;
    if (rows.length) {
      await sql`insert into feed (message) values (${`${sp.name} convidou ${pub(p.owner_name)} para uma conversa.`})`;
    }
    return { ok: true };
  }

  fail(400, 'Ação desconhecida.');
});
