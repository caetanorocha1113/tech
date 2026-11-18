// POST /api/students
//   { action: 'register', name, email, birth, guardian, privacy, show, school, serie, turma, city, interests }
//   { action: 'login', email }
//   { action: 'update', id, interests?, showPortfolio? }
//   { action: 'scan', id }   -> leu o QR do programa (+10 XP, uma vez)
import { getSql } from './_lib/db.js';
import { route, body, text, id, fail } from './_lib/http.js';
import { AREAS, XP, pub, regionOfCity, newId } from './_lib/rules.js';

export default route(['POST'], async req => {
  const sql = getSql();
  const b = body(req);

  if (b.action === 'register') {
    const name = text(b.name, 'nome', 60);
    const email = text(b.email, 'e-mail', 80).toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(email)) fail(400, 'Informe um e-mail válido, como voce@email.com.');
    const year = new Date().getFullYear();
    const birth = Number(b.birth);
    if (!Number.isInteger(birth) || birth < year - 30 || birth > year - 10) fail(400, 'Ano de nascimento inválido.');
    if (year - birth < 18 && !b.guardian) fail(400, 'Para menores de 18 anos, é preciso a autorização do responsável.');
    if (!b.privacy) fail(400, 'Para criar a conta, aceite a política de privacidade.');

    let schoolId = null, serie = null, turma = null, city, region;
    if (b.school !== null && b.school !== undefined && Number(b.school) >= 0) {
      schoolId = Number(b.school);
      const [school] = await sql`select city, region from schools where id = ${schoolId}`;
      if (!school) fail(400, 'Escola não encontrada.');
      serie = Number(b.serie);
      if (![1, 2, 3].includes(serie)) fail(400, 'Série inválida.');
      turma = ['A', 'B', 'C', 'D'].includes(b.turma) ? b.turma : fail(400, 'Turma inválida.');
      ({ city, region } = school);
    } else {
      city = text(b.city, 'cidade', 60);
      region = regionOfCity(city) || fail(400, 'Cidade fora da lista de Santa Catarina.');
    }
    const interests = Array.isArray(b.interests) ? b.interests.filter(a => AREAS.includes(a)) : [];
    const skills = Object.fromEntries(AREAS.map(a => [a, 0]));

    const [taken] = await sql`select 1 from students where lower(email) = ${email}`;
    if (taken) fail(409, 'Este e-mail já tem conta. Use “Já tenho conta”.');

    const sid = newId('u');
    await sql.transaction([
      sql`insert into students (id, name, email, birth_year, guardian_ok, show_portfolio, school_id, serie, turma, city, region, interests, skills)
          values (${sid}, ${name}, ${email}, ${birth}, ${!!b.guardian}, ${!!b.show}, ${schoolId}, ${serie}, ${turma}, ${city}, ${region},
                  ${interests}, ${JSON.stringify(skills)}::jsonb)`,
      sql`insert into feed (message) values (${`${pub(name)} criou conta em ${city}${schoolId == null ? ' (independente)' : ''}.`})`
    ]);
    return { id: sid };
  }

  if (b.action === 'login') {
    const email = text(b.email, 'e-mail', 80).toLowerCase();
    const [row] = await sql`select id from students where lower(email) = ${email}`;
    if (!row) fail(404, 'Não encontramos uma conta com este e-mail.');
    return { id: row.id };
  }

  if (b.action === 'update') {
    const sid = id(b.id, 'jovem');
    if (Array.isArray(b.interests)) {
      const interests = b.interests.filter(a => AREAS.includes(a));
      await sql`update students set interests = ${interests} where id = ${sid}`;
    }
    if (typeof b.showPortfolio === 'boolean') {
      await sql`update students set show_portfolio = ${b.showPortfolio} where id = ${sid}`;
    }
    return { ok: true };
  }

  if (b.action === 'scan') {
    const sid = id(b.id, 'jovem');
    const rows = await sql`update students set scanned_qr = true, points = points + ${XP.qr}
                           where id = ${sid} and not scanned_qr returning points`;
    return { awarded: rows.length ? XP.qr : 0 };
  }

  fail(400, 'Ação desconhecida.');
});
