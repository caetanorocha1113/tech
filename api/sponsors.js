// POST /api/sponsors
//   { action: 'create', name, city, sector }  -> cadastra uma empresa
import { getSql } from './_lib/db.js';
import { route, body, text, fail } from './_lib/http.js';
import { newId } from './_lib/rules.js';

export default route(['POST'], async req => {
  const sql = getSql();
  const b = body(req);
  if (b.action !== 'create') fail(400, 'Ação desconhecida.');

  const name = text(b.name, 'nome da empresa', 60);
  const city = text(b.city, 'cidade', 50);
  const sector = text(b.sector, 'setor', 40);
  const sid = newId('s');
  await sql.transaction([
    sql`insert into sponsors (id, name, city, sector) values (${sid}, ${name}, ${city}, ${sector})`,
    sql`insert into feed (message) values (${`${name} (${city}) entrou na plataforma.`})`
  ]);
  return { id: sid };
});
