/* ============ cliente da API ============
   Fala com as rotas em /api. Se o banco não responder (por exemplo, abrindo o
   index.html direto do computador), o site funciona em "modo demonstração",
   com dados só na memória do navegador. */
const API = {
  online: false,

  async check() {
    if (location.protocol === 'file:') return (this.online = false);
    try {
      const r = await fetch('/api/health', { cache: 'no-store' });
      this.online = r.ok && (await r.json()).db === true;
    } catch (_) {
      this.online = false;
    }
    return this.online;
  },

  async get(path) {
    const r = await fetch(path, { cache: 'no-store' });
    return this._read(r);
  },

  async post(path, data) {
    const r = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return this._read(r);
  },

  async _read(r) {
    let data = {};
    try { data = await r.json(); } catch (_) {}
    if (!r.ok) {
      const err = new Error(data.error || 'Não foi possível falar com o servidor.');
      err.status = r.status;
      throw err;
    }
    return data;
  },

  /* jovem conectado neste navegador (só o id; nada de dados pessoais) */
  get studentId() {
    try { return localStorage.getItem('techsc.student') || ''; } catch (_) { return ''; }
  },
  set studentId(v) {
    try { v ? localStorage.setItem('techsc.student', v) : localStorage.removeItem('techsc.student'); } catch (_) {}
  }
};
