// Utilidades comuns às rotas da API: respostas JSON, erros e validação.

export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export const fail = (status, message) => { throw new HttpError(status, message); };

// Envolve uma rota: aceita só os métodos indicados e devolve erros em JSON.
export function route(methods, handler) {
  return async function (req, res) {
    res.setHeader('Cache-Control', 'no-store');
    if (!methods.includes(req.method)) {
      res.setHeader('Allow', methods.join(', '));
      return res.status(405).json({ error: 'Método não permitido.' });
    }
    try {
      const data = await handler(req, res);
      if (!res.headersSent) res.status(200).json(data ?? { ok: true });
    } catch (e) {
      const status = e.status || 500;
      if (status >= 500) console.error(e);
      res.status(status).json({ error: status >= 500 && !e.status ? 'Erro interno no servidor.' : e.message });
    }
  };
}

export function body(req) {
  const b = req.body;
  if (b && typeof b === 'object') return b;
  if (typeof b === 'string' && b) {
    try { return JSON.parse(b); } catch { fail(400, 'Corpo da requisição inválido.'); }
  }
  return {};
}

// Texto obrigatório, sem espaços nas pontas e com tamanho máximo.
export function text(v, field, max = 200, { optional = false } = {}) {
  const s = typeof v === 'string' ? v.trim() : '';
  if (!s) {
    if (optional) return null;
    fail(400, `Preencha o campo ${field}.`);
  }
  if (s.length > max) fail(400, `O campo ${field} aceita no máximo ${max} caracteres.`);
  return s;
}

export function id(v, field = 'id') {
  if (typeof v !== 'string' || !/^[A-Za-z0-9_-]{1,64}$/.test(v)) fail(400, `Identificador inválido: ${field}.`);
  return v;
}

export function oneOf(v, list, field) {
  if (!list.includes(v)) fail(400, `Valor inválido para ${field}.`);
  return v;
}
