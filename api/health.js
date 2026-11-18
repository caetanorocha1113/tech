// GET /api/health — o site usa para saber se o banco está conectado.
import { getSql } from './_lib/db.js';
import { route } from './_lib/http.js';

export default route(['GET'], async () => {
  const sql = getSql();
  await sql`select 1`;
  return { ok: true, db: true };
});
