// Cria as tabelas e carrega os dados de exemplo no banco.
// Uso:  npm run db:setup     (lê DATABASE_URL do arquivo .env)
// ATENÇÃO: apaga os dados existentes e recomeça do zero.
import { readFile } from 'node:fs/promises';
import { neon } from '@neondatabase/serverless';

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('Defina DATABASE_URL no arquivo .env (copie o valor da Vercel ou do painel do Neon).');
  process.exit(1);
}
const sql = neon(url);

// Separa o arquivo em comandos: cada um termina com ";" no fim da linha.
const statements = text =>
  text.split('\n').filter(l => !l.trim().startsWith('--')).join('\n')
    .split(/;\s*$/m).map(s => s.trim()).filter(Boolean);

for (const file of ['schema.sql', 'seed.sql']) {
  const cmds = statements(await readFile(new URL(`../db/${file}`, import.meta.url), 'utf8'));
  for (const cmd of cmds) await sql.query(cmd);
  console.log(`✓ ${file} (${cmds.length} comandos)`);
}
const [{ n }] = await sql`select count(*)::int as n from students`;
console.log(`Pronto! ${n} jovens no banco.`);
