/* ============ utilidades ============ */
const $=(s,r=document)=>r.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const nf=n=>Math.round(n).toLocaleString('pt-BR');
const brl=n=>Math.round(n).toLocaleString('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:0});
const hhmm=()=>new Date().toTimeString().slice(0,5);
const ini=n=>n.split(' ').filter(Boolean).slice(0,2).map(w=>w[0]).join('').toUpperCase();
/* nome abreviado: protege a identidade de jovens (muitos são menores de idade) */
const pub=n=>{const p=String(n).trim().split(/\s+/);return p.length>1?p[0]+' '+p[p.length-1][0]+'.':p[0]};
function rng(seed){return()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const YEAR=new Date().getFullYear();

/* ============ dados de exemplo (fictícios) ============ */
const SCH=[
 {n:'SESI Florianópolis',city:'Florianópolis',reg:'Grande Florianópolis'},
 {n:'EEB Prof. Marlene Cardoso',city:'São José',reg:'Grande Florianópolis'},
 {n:'EEB Ilha Azul',city:'Florianópolis',reg:'Grande Florianópolis'},
 {n:'SENAI Palhoça',city:'Palhoça',reg:'Grande Florianópolis'},
 {n:'EEB Frei Gustavo',city:'Blumenau',reg:'Vale do Itajaí'},
 {n:'Colégio Vale Verde',city:'Brusque',reg:'Vale do Itajaí'},
 {n:'SESI Itajaí',city:'Itajaí',reg:'Vale do Itajaí'},
 {n:'SENAI Joinville',city:'Joinville',reg:'Norte'},
 {n:'EEB Dona Elza',city:'Jaraguá do Sul',reg:'Norte'},
 {n:'Colégio Baía Norte',city:'São Francisco do Sul',reg:'Norte'},
 {n:'EEB Tubarão Novo',city:'Tubarão',reg:'Sul'},
 {n:'SESI Criciúma',city:'Criciúma',reg:'Sul'},
 {n:'EEB Farol',city:'Laguna',reg:'Sul'},
 {n:'EEB Rio Uruguai',city:'Chapecó',reg:'Oeste'},
 {n:'SENAI Concórdia',city:'Concórdia',reg:'Oeste'},
 {n:'EEB Fronteira',city:'São Miguel do Oeste',reg:'Oeste'},
 {n:'EEB Planalto',city:'Lages',reg:'Serra e Alto Vale'},
 {n:'EEB Alto Vale',city:'Rio do Sul',reg:'Serra e Alto Vale'}];
const REGS=['Grande Florianópolis','Vale do Itajaí','Norte','Sul','Oeste','Serra e Alto Vale'];
const REG_SHARE={'Grande Florianópolis':.28,'Vale do Itajaí':.22,'Norte':.18,'Sul':.12,'Oeste':.12,'Serra e Alto Vale':.08};
const CITIES={
 'Grande Florianópolis':['Florianópolis','São José','Palhoça','Biguaçu','Santo Amaro da Imperatriz'],
 'Vale do Itajaí':['Blumenau','Brusque','Itajaí','Balneário Camboriú','Gaspar','Indaial'],
 'Norte':['Joinville','Jaraguá do Sul','São Francisco do Sul','Mafra','Canoinhas'],
 'Sul':['Tubarão','Criciúma','Laguna','Araranguá','Içara'],
 'Oeste':['Chapecó','Concórdia','São Miguel do Oeste','Xanxerê','Joaçaba'],
 'Serra e Alto Vale':['Lages','Rio do Sul','São Joaquim','Curitibanos','Ituporanga']};
const BASE_JOVENS=12480,BASE_ESCOLAS=187,BASE_CIDADES=94,BASE_INDEP=2140;
const cityOf=u=>u.school!=null?SCH[u.school].city:u.city;
const regOf=u=>u.school!=null?SCH[u.school].reg:(Object.keys(CITIES).find(g=>CITIES[g].includes(u.city))||'Grande Florianópolis');
const placeOf=o=>o.school!=null?SCH[o.school].n+', '+SCH[o.school].city:(o.city+', independente');
const AREAS=['App','IA','Games','Dados','Design','IoT'];

/* planos de patrocínio, conforme o relatório de pesquisa */
const PLAN={
  apoiador:{nome:'Apoiador',foco:'Presença',valor:8000,slots:1500,pad:1,pts:200,relatorio:false,cor:'#8A94AD',
    itens:['Marca associada a um desafio da plataforma','Menção nas divulgações do Tech SC','1 apadrinhamento de projeto']},
  patrocinador:{nome:'Patrocinador',foco:'Destaque',valor:25000,slots:4000,pad:2,pts:300,relatorio:true,cor:'#0A9A8A',
    itens:['Desafio totalmente personalizado','Relatório de engajamento','Destaque na vitrine de desafios','2 apadrinhamentos de projetos']},
  parceiro:{nome:'Parceiro Estratégico',foco:'Experiência',valor:60000,slots:8000,pad:4,pts:450,relatorio:true,cor:'#6446D6',
    itens:['Co-criação dos desafios com a equipe','Profissionais da empresa como mentores','Conteúdos especiais e citação no programa','Relatório de engajamento e 4 apadrinhamentos']}
};
/* critérios técnicos e públicos de avaliação (pesos somam 100) */
const CRIT=[
  ['problema','Resolve o problema proposto',30],
  ['tecnica','Qualidade técnica',25],
  ['criatividade','Criatividade e originalidade',20],
  ['impacto','Viabilidade e impacto',15],
  ['clareza','Clareza da apresentação',10]];
/* o que a banca observa em cada critério */
const CRIT_HINT={problema:'Atende ao que a empresa pediu no desafio?',tecnica:'Funciona? Está bem construído e testado?',criatividade:'Traz uma ideia nova ou um jeito diferente de resolver?',impacto:'Daria para usar de verdade? Ajuda pessoas?',clareza:'É fácil entender o que foi feito e como usar?'};
const total=sc=>Math.round(CRIT.reduce((a,[k,,w])=>a+sc[k]*w,0)/100);
function genScores(target,r){const o={};CRIT.forEach(([k])=>{o[k]=Math.max(40,Math.min(100,Math.round(target+(r()-.5)*18)))});return o}

const LV=[{n:'Bit',min:0},{n:'Byte',min:200},{n:'Kernel',min:500},{n:'Compilador',min:900},{n:'Arquiteto',min:1400},{n:'Lenda SC',min:2000}];
const level=p=>{let i=0;LV.forEach((l,k)=>{if(p>=l.min)i=k});const c=LV[i],n=LV[i+1];return{i:i+1,name:c.n,next:n,pct:n?(p-c.min)/(n.min-c.min)*100:100,toNext:n?n.min-p:0}};
const ICON={
  inicio:'<path d="M3 11l9-8 9 8M5 10v10h14V10"/>',desafios:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/>',
  portfolio:'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"/>',enviar:'<path d="M12 16V4M6 10l6-6 6 6M4 20h16"/>',
  painel:'<path d="M5 20V11M12 20V4M19 20v-6"/>',criar:'<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>',
  talentos:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0113 0M16 4.5a3.5 3.5 0 010 7M18 14a6.5 6.5 0 013.5 6"/>',
  metricas:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  banca:'<path d="M9 11l3 3 8-8"/><path d="M20 12v7a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2h9"/>',
  fila:'<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M8 3l4 3 4-3"/>',cert:'<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>'
};
const NAV={
  sobre:[],
  jovem:[['inicio','Início'],['desafios','Desafios'],['portfolio','Portfólio'],['enviar','Enviar']],
  patro:[['painel','Painel'],['criar','Criar desafio'],['talentos','Talentos']],
  prog:[['metricas','Métricas'],['banca','Avaliar'],['fila','Quadro na TV'],['cert','Certificados']]
};
const ROLES=[['sobre','Conheça'],['jovem','Jovem'],['patro','Empresa'],['prog','Programa']];
const RI={sobre:'<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',jovem:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/>',patro:'<path d="M4 21V5a2 2 0 012-2h8a2 2 0 012 2v16M16 9h2a2 2 0 012 2v10M8 7h4M8 11h4M8 15h4M2 21h20"/>',prog:'<rect x="3" y="5" width="18" height="12" rx="2"/><path d="M8 21h8M12 17v4"/>'};
const ARROW='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

/* ============ QR code e link direto ============ */
const FEATURED='m1'; /* desafio da semana (aparece na TV e no QR) */
/* endereço do site: o publicado na Vercel ou o local */
function siteBase(){
  if(location.protocol==='http:'||location.protocol==='https:')return location.origin+'/';
  return 'https://tech-sc-hub.vercel.app/';
}
/* link que o QR abre: entra direto no desafio e conta como "segunda tela" */
const deepLink=(mid=FEATURED)=>`${siteBase()}?desafio=${encodeURIComponent(mid)}&tv=1`;
/* QR code de verdade, desenhado em SVG (usa js/vendor/qrcode.js) */
function qrSvg(text,label='QR code'){
  if(typeof qrcode!=='function')return'';
  const q=qrcode(0,'M');q.addData(text);q.make();
  const n=q.getModuleCount(),m=2;let d='';
  for(let y=0;y<n;y++)for(let x=0;x<n;x++)if(q.isDark(y,x))d+=`M${x+m} ${y+m}h1v1h-1z`;
  return`<svg viewBox="0 0 ${n+m*2} ${n+m*2}" shape-rendering="crispEdges" role="img" aria-label="${esc(label)}"><rect width="100%" height="100%" fill="#fff"/><path d="${d}" fill="#0C111E"/></svg>`;
}
