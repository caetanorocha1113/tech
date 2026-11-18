// Regras do jogo usadas pelo servidor.
// Mantenha estes valores iguais aos de public/js/config.js.

export const AREAS = ['App', 'IA', 'Games', 'Dados', 'Design', 'IoT'];

export const PLAN = {
  apoiador:     { nome: 'Apoiador',             pts: 200, pad: 1 },
  patrocinador: { nome: 'Patrocinador',         pts: 300, pad: 2 },
  parceiro:     { nome: 'Parceiro Estratégico', pts: 450, pad: 4 }
};

// Critérios técnicos e públicos da banca (pesos somam 100)
export const CRIT = [['problema', 30], ['tecnica', 25], ['criatividade', 20], ['impacto', 15], ['clareza', 10]];

export const XP = { entrar: 20, qr: 10, noAr: 100 };

export const CITIES = {
  'Grande Florianópolis': ['Florianópolis', 'São José', 'Palhoça', 'Biguaçu', 'Santo Amaro da Imperatriz'],
  'Vale do Itajaí': ['Blumenau', 'Brusque', 'Itajaí', 'Balneário Camboriú', 'Gaspar', 'Indaial'],
  'Norte': ['Joinville', 'Jaraguá do Sul', 'São Francisco do Sul', 'Mafra', 'Canoinhas'],
  'Sul': ['Tubarão', 'Criciúma', 'Laguna', 'Araranguá', 'Içara'],
  'Oeste': ['Chapecó', 'Concórdia', 'São Miguel do Oeste', 'Xanxerê', 'Joaçaba'],
  'Serra e Alto Vale': ['Lages', 'Rio do Sul', 'São Joaquim', 'Curitibanos', 'Ituporanga']
};
export const regionOfCity = city => Object.keys(CITIES).find(r => CITIES[r].includes(city)) || null;

// Nome abreviado ("Lucas Martins" -> "Lucas M."): protege a identidade de menores
export const pub = n => {
  const p = String(n).trim().split(/\s+/);
  return p.length > 1 ? `${p[0]} ${p[p.length - 1][0]}.` : p[0];
};

// Simula a nota da banca técnica (no produto real, a nota vem dos avaliadores)
export function genScores() {
  const target = 84 + Math.random() * 8, o = {};
  for (const [k] of CRIT) o[k] = Math.max(40, Math.min(100, Math.round(target + (Math.random() - 0.5) * 18)));
  return o;
}
export const total = sc => Math.round(CRIT.reduce((a, [k, w]) => a + sc[k] * w, 0) / 100);

export const newId = prefix => prefix + '_' + crypto.randomUUID().replace(/-/g, '').slice(0, 16);
