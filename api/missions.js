// POST /api/missions
//   { action: 'create', sponsorId, title, area, plan, prize, description }  -> empresa lança desafio
//   { action: 'join', missionId, studentId }                                 -> jovem entra (+20 XP)
import { getSql } from './_lib/db.js';
import { route, body, text, id, oneOf, fail } from './_lib/http.js';
import { AREAS, PLAN, XP, pub, newId } from './_lib/rules.js';

export default route(['POST'], async req => {
  const sql = getSql();
  const b = body(req);

  if (b.action === 'create') {
    const sponsorId = id(b.sponsorId, 'empresa');
    const title = text(b.title, 'nome do desafio', 50);
    const area = oneOf(b.area, AREAS, 'área');
    const plan = oneOf(b.plan, Object.keys(PLAN), 'plano');
    const prize = text(b.prize, 'prêmio', 90);
    const description = text(b.description, 'problema', 300);
    const [sp] = await sql`select name from sponsors where id = ${sponsorId}`;
    if (!sp) fail(404, 'Empresa não encontrada.');

    const mid = newId('m');
    await sql.transaction([
      sql`insert into missions (id, sponsor_id, title, area, plan, points, prize, description)
          values (${mid}, ${sponsorId}, ${title}, ${area}, ${plan}, ${PLAN[plan].pts}, ${prize}, ${description})`,
      sql`insert into feed (message) values (${`${sp.name} lançou o desafio “${title}” (plano ${PLAN[plan].nome}).`})`
    ]);
    return { id: mid, pts: PLAN[plan].pts };
  }

  if (b.action === 'join') {
    const missionId = id(b.missionId, 'desafio');
    const studentId = id(b.studentId, 'jovem');
    // Uma única instrução: só conta pontos e vagas se a inscrição for nova.
    const [r] = await sql`
      with ins as (
        insert into participations (student_id, mission_id) values (${studentId}, ${missionId})
        on conflict do nothing returning mission_id
      ), m as (
        update missions set joined_count = joined_count + 1 where id in (select mission_id from ins)
        returning title, sponsor_id
      ), s as (
        update students set points = points + ${XP.entrar}
        where id = ${studentId} and exists (select 1 from ins) returning name, city
      )
      select (select title from m) as title, (select sponsor_id from m) as sponsor_id,
             (select name from s) as name, (select city from s) as city`;
    if (!r || !r.title) return { awarded: 0 };
    await sql`insert into feed (sponsor_scope, message)
              values (${r.sponsor_id}, ${`${pub(r.name)} (${r.city}) entrou no desafio “${r.title}”.`})`;
    return { awarded: XP.entrar };
  }

  fail(400, 'Ação desconhecida.');
});
