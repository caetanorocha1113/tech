// Conexão com o Postgres (Neon). A Vercel preenche DATABASE_URL sozinha
// quando você conecta o Neon ao projeto (aba Storage).
import { neon } from '@neondatabase/serverless';

let client = null;

export function getSql() {
  if (!process.env.DATABASE_URL) {
    const err = new Error('DATABASE_URL não configurada. Conecte um banco Neon ao projeto na Vercel.');
    err.status = 503;
    throw err;
  }
  if (!client) client = neon(process.env.DATABASE_URL);
  return client;
}
