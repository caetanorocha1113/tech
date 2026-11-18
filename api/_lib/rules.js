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

// Nota final = média ponderada dos critérios da banca
export const total = sc => Math.round(CRIT.reduce((a, [k, w]) => a + sc[k] * w, 0) / 100);

export const newId = prefix => prefix + '_' + crypto.randomUUID().replace(/-/g, '').slice(0, 16);
