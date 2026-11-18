// POST /api/certificates
//   { action: 'review', id, approved }  -> JA SC valida ou recusa o certificado
import { getSql } from './_lib/db.js';
import { route, body, id, fail } from './_lib/http.js';
import { pub } from './_lib/rules.js';

export default route(['POST'], async req => {
  const sql = getSql();
  const b = body(req);
  if (b.action !== 'review') fail(400, 'Ação desconhecida.');

  const cid = id(b.id, 'certificado');
  const ok = !!b.approved;
  const rows = await sql`update certificates set status = ${ok ? 'validado' : 'recusado'}
                         where id = ${cid} and status = 'pendente' returning title, owner_name`;
  if (!rows.length) fail(409, 'Este certificado já foi analisado.');
  const c = rows[0];
  await sql`insert into feed (message)
            values (${`A JA SC ${ok ? 'validou' : 'recusou'} o certificado de ${pub(c.owner_name)}: “${c.title}”.`})`;
  return { ok: true };
});
