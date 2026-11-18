/* Tech SC Hub · lógica e telas do site. Depende de config.js e api.js. */

/* ============ estado em memória ============ */
let S,prevN={},prevW={};
function init(){
  const r=rng(42);
  const FIRST=['Lucas','Ana','Gabriel','Maria','Matheus','Isadora','Pedro','Júlia','Rafael','Larissa','Bruno','Beatriz','Felipe','Thiago','Letícia','Vinícius','Sofia','Henrique','Laura','Eduardo','Manuela','Guilherme','Helena','Davi'];
  const LAST=['Martins','Cardoso','Weber','Pires','Linhares','Schmitt','Koerich','Hoffmann','Ferreira','Vieira','Bittencourt','Goulart','Zimmermann','Pereira','Böing','Muller','Rosa','Amorim','Nunes','Silveira','Fagundes','Dal Pont','Cordeiro','Borges'];
  const students=[];
  SCH.forEach((_,si)=>[1,2,3].forEach(sr=>'AB'.split('').forEach(t=>{
    const id=`${si}-${sr}-${t}`;
    for(let k=0;k<5;k++)students.push({id:`${id}-${k}`,name:FIRST[Math.floor(r()*FIRST.length)]+' '+LAST[Math.floor(r()*LAST.length)],school:si,serie:sr,turma:t,classId:id,pts:Math.floor(80+r()*640)});
  })));
  const me={id:'camila',name:'Camila Andrade',email:'camila@exemplo.com.br',city:'São José',school:1,serie:2,turma:'B',classId:'1-2-B',part:{},pts:640,birth:YEAR-16,guardian:true,showPortfolio:true,interests:['IA','Games'],skills:{App:42,IA:30,Games:12,Dados:25,Design:18,IoT:8}};
  students.push(me);
  const sponsors=[
    {id:'litoralpay',name:'Litoral Pay',city:'Florianópolis',sector:'Fintech'},
    {id:'blusoft',name:'Blusoft Sistemas',city:'Blumenau',sector:'Software'},
    {id:'joinvix',name:'Joinvix Motores',city:'Joinville',sector:'Indústria'},
    {id:'portox',name:'PortoX Logística',city:'Itajaí',sector:'Logística'},
    {id:'fiosul',name:'Fio Sul Têxtil',city:'Brusque',sector:'Moda e têxtil'},
    {id:'colmeia',name:'Colmeia Foods',city:'Rio do Sul',sector:'Alimentos'},
    {id:'enervale',name:'EnerVale Energia',city:'Lages',sector:'Energia solar'}
  ];
  const M=(id,sp,title,area,plan,prize,desc,joined,delivered,days)=>({id,sp,title,area,plan,pts:PLAN[plan].pts,prize,desc,joined,delivered,days,me:{joined:false,delivered:false}});
  const missions=[
    M('m1','litoralpay','Troco solidário','App','patrocinador','Bolsa de R$ 1.000 + mentoria com o time de produto','Crie o protótipo de um app que arredonda o valor de uma compra e doa a diferença para uma ONG de Santa Catarina. Mostre o fluxo em 3 telas.',1420,380,18),
    M('m2','blusoft','Chatbot do suporte','IA','parceiro','Semana de experiência na Blusoft + entrevista para estágio','Monte um chatbot que responde às 10 dúvidas mais comuns dos clientes de um sistema de gestão. Pode usar regras ou IA.',2110,540,25),
    M('m3','joinvix','Manutenção preditiva','IoT','patrocinador','Visita técnica à fábrica + kit Arduino','Use sensores simulados de vibração e temperatura para avisar quando um motor precisa de manutenção.',960,210,20),
    M('m4','portox','Porto Rush','Games','apoiador','Troféu Tech SC + visita guiada ao porto','Crie um jogo curto em que o jogador organiza contêineres e navios no menor tempo possível.',1280,330,12),
    M('m5','fiosul','Vitrine de moda sustentável','Design','apoiador','Mentoria de design + peças da coleção','Desenhe a página inicial de uma loja que mostra a origem e o impacto de cada peça.',740,170,15),
    M('m6','colmeia','Painel de desperdício','Dados','apoiador','Curso de análise de dados + almoço com o time','Transforme uma planilha de sobras da cozinha em um painel que aponta onde há mais desperdício.',650,120,22),
    M('m7','enervale','Calculadora solar','App','parceiro','Estágio de férias + kit solar didático','Faça uma calculadora que estima a economia na conta de luz com energia solar em casas catarinenses.',1520,290,28)
  ];
  const P=(id,title,desc,owner,school,mission,status,sp,target)=>{const sc=genScores(target,r);return{id,title,desc,owner,school,mission,status,sp,scores:sc,score:total(sc),ownerId:'seed',link:''}};
  const projects=[
    P('p1','Troco do Bem','App com 3 telas que arredonda a compra e mostra o total doado.','Lucas Martins',0,'m1','pendente',null,90),
    P('p2','SuporteBot SC','Chatbot por regras que atende 12 perguntas de clientes.','Ana Cardoso',4,'m2','pendente',null,87),
    P('p3','Vibra ESP32','Simulação de sensor de vibração com alerta por cor.','Gabriel Weber',7,'m3','pendente',null,80),
    P('p4','Porto Rush','Jogo de contêineres com 5 fases e ranking.','Matheus Pires',6,'m4','aprovado','portox',89),
    P('p5','Moda Circular','Vitrine com selo de origem de cada peça.','Isadora Linhares',5,'m5','aprovado',null,84),
    P('p6','Cozinha Zero','Painel que mostra as 3 maiores perdas da semana.','Pedro Koerich',13,'m6','pendente',null,76),
    {id:'p7',title:'Sol na Conta',desc:'Calculadora que compara a conta de luz antes e depois de instalar placas solares, com dados de cidades catarinenses.',owner:'Júlia Schmitt',school:9,mission:'m7',status:'avaliacao',sp:null,scores:null,score:null,ownerId:'seed',link:'https://exemplo.dev/sol-na-conta'}
  ];
  const C=(id,owner,school,title,area,status,own)=>({id,owner,school,title,area,status,ownerId:own||'seed'});
  const certs=[
    C('c1','Camila Andrade',1,'Lógica de Programação','App','validado','camila'),
    C('c2','Camila Andrade',1,'Pensamento Computacional','Dados','validado','camila'),
    C('c3','Lucas Martins',0,'Desenvolvimento de Apps, nível 1','App','pendente'),
    C('c4','Ana Cardoso',4,'IA Aplicada ao Atendimento','IA','pendente'),
    C('c5','Gabriel Weber',7,'IoT Básico','IoT','pendente')
  ];
  const feed=[
    {t:'14:21',msg:'Lucas M. (SESI Florianópolis) entregou “Troco do Bem”.',sp:'litoralpay'},
    {t:'14:36',msg:'O desafio “Chatbot do suporte” passou de 2 mil jovens.',sp:'blusoft'},
    {t:'15:02',msg:'Três projetos avaliados pela banca aguardam a curadoria do quadro.',sp:'*'}
  ];
  S={...uiDefaults(),students,me,registered:0,indep:0,regionJoin:Object.fromEntries(REGS.map(x=>[x,0])),uid:1,sid:1,baseJoined:missions.reduce((a,m)=>a+m.joined,0),sponsors,missions,projects,certs,feed,invites:{},mid:8,pid:7,cid:6};
  setUser(me);
  badges().filter(b=>b.ok()).forEach(b=>S.seenBadges.add(b.id));
}
/* estado da interface (não vai para o banco) */
function uiDefaults(){
  return{role:'sobre',tab:{sobre:'',jovem:'inicio',patro:'painel',prog:'metricas'},auth:{sobre:true,jovem:false,patro:false,prog:false},
    staff:{name:'Equipe Tech SC',org:'NSC TV'},sp:'litoralpay',filter:{area:'Todas',sp:'todos'},rankTab:'turma',sheet:null,scanning:false,
    demoOpen:false,flags:{scanned:false,sponsorSeen:false},seenBadges:new Set(),fresh:{},busy:false};
}
const GUEST=()=>({id:'__guest',name:'Visitante',school:null,city:'Florianópolis',pts:0,part:{},interests:[],skills:Object.fromEntries(AREAS.map(a=>[a,0])),showPortfolio:false});
const clock=iso=>{const d=new Date(iso);return isNaN(d)?String(iso).slice(0,5):d.toTimeString().slice(0,5)};

/* ============ banco de dados ============ */
/* carrega (ou recarrega) os dados do banco, mantendo o que está na tela */
async function refresh(){
  const sid=API.studentId;
  const d=await API.get('/api/bootstrap'+(sid?'?student='+encodeURIComponent(sid):''));
  if(sid&&!d.me)API.studentId='';
  const first=!S,prev=S||uiDefaults();
  const prevMine=!first&&prev.me&&d.me&&prev.me.id===d.me.id?Object.fromEntries(prev.projects.filter(x=>x.ownerId===d.me.id).map(x=>[x.id,x.status])):null;
  const prevPts=prevMine?prev.me.pts:0;
  const students=d.students;
  let me=GUEST();
  if(d.me){me=students.find(x=>x.id===d.me.id)||d.me;Object.assign(me,d.me)}
  S={...uiDefaults(),role:prev.role,tab:prev.tab,auth:{...prev.auth,jovem:!!d.me},staff:prev.staff,sp:d.sponsors.some(x=>x.id===prev.sp)?prev.sp:d.sponsors[0].id,
    filter:prev.filter,rankTab:prev.rankTab,demoOpen:prev.demoOpen,seenBadges:prev.seenBadges,preMission:prev.preMission,pending:prev.pending,
    flags:{scanned:!!(d.me&&d.me.scanned),sponsorSeen:prev.flags.sponsorSeen},
    students,me,sponsors:d.sponsors,missions:d.missions,projects:d.projects,certs:d.certs,invites:d.invites,
    feed:d.feed.map(f=>({...f,t:clock(f.t)})),registered:d.counts.registered,indep:d.counts.indep,
    regionJoin:{...Object.fromEntries(REGS.map(x=>[x,0])),...d.counts.regionJoin},baseJoined:d.counts.baseJoined};
  setUser(me);
  if(first||!d.me)badges().filter(b=>b.ok()).forEach(b=>S.seenBadges.add(b.id));
  if(prevMine)liveNews(prevMine,prevPts);
}
/* novidades que chegaram de outras pessoas enquanto o jovem usava o site */
function liveNews(prevMine,prevPts){
  let party=false;
  S.projects.filter(p=>isMine(p)&&prevMine[p.id]&&prevMine[p.id]!==p.status).forEach(p=>{
    if(prevMine[p.id]==='avaliacao'&&p.score!=null)toast(`A banca avaliou “${p.title}”: nota ${p.score}!`,'good');
    if(p.status==='aprovado'){toast(`“${p.title}” foi selecionado para ir ao ar na NSC TV!`,'good');party=true}
  });
  if(S.me.pts>prevPts&&S.role==='jovem')celebrate(S.me.pts-prevPts,prevPts);
  if(party&&S.role==='jovem')confetti();
  checkBadges();
}
/* grava uma ação no banco; se der erro, avisa e volta ao que está salvo */
function sync(path,data){
  if(!API.online)return Promise.resolve(null);
  return API.post(path,data).catch(async e=>{toast(e.message,'warn');try{await refresh();render()}catch(_){}throw e});
}
const quiet=p=>{p.catch(()=>{});return p};
function setUser(u){S.me=u;S.missions.forEach(m=>{m.me=u.part[m.id]||(u.part[m.id]={joined:false,delivered:false})})}
const isMine=o=>o.ownerId===S.me.id;
const sponsor=id=>S.sponsors.find(s=>s.id===id);
const mission=id=>S.missions.find(m=>m.id===id);
const addFeed=(msg,sp='*')=>{S.feed.unshift({t:hhmm(),msg,sp});S.feed=S.feed.slice(0,30)};

/* ============ regras de negócio ============ */
function ranks(){
  const me=S.me,by=(x,y)=>y.pts-x.pts;
  const sch=me.school!=null;
  const inClass=sch?S.students.filter(x=>x.classId===me.classId).sort(by):[];
  const inSchool=sch?S.students.filter(x=>x.school===me.school).sort(by):[];
  const inCity=S.students.filter(x=>cityOf(x)===cityOf(me)).sort(by);
  const inReg=S.students.filter(x=>regOf(x)===regOf(me)).sort(by);
  const all=[...S.students].sort(by);
  const schools=SCH.map((x,i)=>({i,name:x.n,city:x.city,total:S.students.filter(z=>z.school===i).reduce((q,z)=>q+z.pts,0)})).sort((x,y)=>y.total-x.total);
  return{inClass,inSchool,inCity,inReg,all,schools,posClass:inClass.indexOf(me)+1,posSchool:inSchool.indexOf(me)+1,posCity:inCity.indexOf(me)+1,posReg:inReg.indexOf(me)+1,posState:all.indexOf(me)+1,posEscolas:schools.findIndex(x=>x.i===me.school)+1};
}
function rankTabs(){
  const t=[];if(S.me.school!=null)t.push(['turma','Minha turma'],['escola','Minha escola']);
  t.push(['cidade','Minha cidade'],['regiao','Minha região']);if(S.me.school!=null)t.push(['escolas','Escolas de SC']);t.push(['estado','Estado']);return t;
}
function badges(){
  const me=S.me;
  return[
    {id:'xp500',n:'500 XP',ok:()=>me.pts>=500,c:'--blue'},
    {id:'qr',n:'Segunda tela',ok:()=>S.flags.scanned,c:'--red'},
    {id:'join',n:'No desafio',ok:()=>S.missions.some(m=>m.me.joined),c:'--violet'},
    {id:'deliver',n:'Primeira entrega',ok:()=>S.missions.some(m=>m.me.delivered),c:'--green'},
    {id:'tv',n:'No ar',ok:()=>S.projects.some(p=>isMine(p)&&p.status==='aprovado'),c:'--red'},
    {id:'pad',n:'Apadrinhado',ok:()=>S.projects.some(p=>isMine(p)&&p.sp),c:'--teal'},
    {id:'xp1000',n:'1.000 XP',ok:()=>me.pts>=1000,c:'--orange'}
  ];
}
function checkBadges(){
  badges().forEach(b=>{if(b.ok()&&!S.seenBadges.has(b.id)){S.seenBadges.add(b.id);S.fresh[b.id]=1;toast('Medalha conquistada: '+b.n,'good')}});
}
function addXP(n){const b=S.me.pts;S.me.pts+=n;celebrate(n,b)}
function celebrate(n,beforePts){
  if(!n)return;
  const before=level(beforePts).i,after=level(S.me.pts);
  xpFloat('+'+n+' XP');S.bump=true;
  if(after.i>before){setTimeout(confetti,500);}if(after.i>before)setTimeout(()=>toast('Você subiu para o nível '+after.i+': '+after.name,'good'),700);
}
function spStats(id){
  const ms=S.missions.filter(m=>m.sp===id);
  const engaged=ms.reduce((a,m)=>a+m.joined,0),delivered=ms.reduce((a,m)=>a+m.delivered,0);
  const quota=ms.reduce((a,m)=>a+PLAN[m.plan].valor,0);
  const projs=S.projects.filter(p=>ms.some(m=>m.id===p.mission));
  const aired=projs.filter(p=>p.status==='aprovado').length;
  const sponsored=S.projects.filter(p=>p.sp===id).length;
  const allowed=ms.reduce((a,m)=>a+PLAN[m.plan].pad,0);
  const hasReport=ms.some(m=>PLAN[m.plan].relatorio);
  const invites=(S.invites[id]||[]).length;
  return{ms,engaged,delivered,quota,projs,aired,sponsored,allowed,hasReport,invites,
    cost:engaged?quota/engaged:quota,reach:engaged*4+aired*18000+sponsored*6000,
    top:[...projs].filter(p=>p.score!=null&&p.status!=='recusado').sort((a,b)=>b.score-a.score).slice(0,3)};
}
function recs(){
  const me=S.me;
  return S.missions.filter(m=>!m.me.joined&&!m.me.delivered).map(m=>{
    let sc=m.pts/10;const why=[];
    if(me.interests.includes(m.area)){sc+=50;why.push('combina com seu interesse em '+m.area)}
    if(me.skills[m.area]<30){sc+=8;why.push('boa chance de evoluir em '+m.area)}
    if(m.pts>=400){sc+=6;why.push('vale muitos pontos')}
    if(m.joined/PLAN[m.plan].slots>.6){sc+=5;why.push('as vagas estão acabando')}
    if(!why.length)why.push('desafio aberto na sua região');
    return{m,sc,why};
  }).sort((a,b)=>b.sc-a.sc).slice(0,3);
}

/* ============ ações ============
   Cada ação muda a tela na hora e grava no banco (quando há banco).
   Sem banco, tudo fica só na memória: é o modo demonstração. */
function joinMission(id){
  const m=mission(id);if(m.me.joined||m.me.delivered)return;
  m.me.joined=true;m.joined++;S.regionJoin[regOf(S.me)]++;addXP(20);
  addFeed(`${pub(S.me.name)} (${placeOf(S.me)}) entrou no desafio “${m.title}”.`,m.sp);
  checkBadges();toast('Você entrou no desafio. Agora é construir e entregar.','good');
  quiet(sync('/api/missions',{action:'join',missionId:id,studentId:S.me.id}));
}
async function submitProject(f){
  const m=mission(f.mission);
  if(API.online){
    const before=S.me.pts;
    const r=await API.post('/api/projects',{action:'submit',studentId:S.me.id,missionId:m.id,title:f.title,description:f.desc,link:f.link||('Arquivo: '+f.file)});
    await refresh();S.fresh[r.certId]=1;celebrate(r.awarded,before);
  }else{
    const p={id:'p'+(S.pid++),title:f.title,desc:f.desc,owner:S.me.name,school:S.me.school,city:S.me.city,mission:m.id,status:'avaliacao',sp:null,scores:null,score:null,ownerId:S.me.id,link:f.link||f.file};
    S.projects.unshift(p);
    m.me.delivered=true;m.delivered++;
    addXP(m.pts);
    S.me.skills[m.area]=Math.min(100,S.me.skills[m.area]+Math.round(m.pts/12));
    const c={id:'c'+(S.cid++),owner:S.me.name,school:S.me.school,city:S.me.city,title:`${m.area} aplicado: ${m.title}`,area:m.area,status:'pendente',ownerId:S.me.id};
    S.certs.unshift(c);S.fresh[c.id]=1;
    addFeed(`${pub(S.me.name)} entregou “${p.title}” no desafio “${m.title}”.`,m.sp);
  }
  confetti();checkBadges();toast('Projeto enviado! Agora a banca técnica vai avaliar.','good');
}
async function gradeProject(pid,scores){
  const p=S.projects.find(x=>x.id===pid);
  if(API.online){await API.post('/api/projects',{action:'grade',id:pid,scores});await refresh()}
  else{
    if(p.status!=='avaliacao')throw new Error('Este projeto já foi avaliado.');
    p.scores=scores;p.score=total(scores);p.status='pendente';
    addFeed(`A banca técnica avaliou “${p.title}”: nota ${p.score}. Projeto na fila do quadro.`,'*');
  }
  const q=S.projects.find(x=>x.id===pid);
  toast(`Notas enviadas: ${q&&q.score!=null?q.score:''}. O projeto foi para a fila do quadro.`,'good');
}
function approve(pid,ok){
  const p=S.projects.find(x=>x.id===pid);if(p.status!=='pendente')return;
  p.status=ok?'aprovado':'recusado';
  const m=mission(p.mission);
  if(ok){
    addFeed(`“${p.title}” foi selecionado para o quadro Tech SC Jovem.`,'*');
    if(isMine(p))addXP(100);
    toast('Projeto selecionado para ir ao ar.','good');confetti();
  }else{toast('Projeto não selecionado para o quadro desta vez.','warn');addFeed(`“${p.title}” não foi selecionado para o quadro desta vez.`,m.sp)}
  checkBadges();
  quiet(sync('/api/projects',{action:'review',id:pid,approved:ok}));
}
function validateCert(cid,ok){
  const c=S.certs.find(x=>x.id===cid);if(c.status!=='pendente')return;
  c.status=ok?'validado':'recusado';
  addFeed(`A JA SC ${ok?'validou':'recusou'} o certificado de ${pub(c.owner)}: “${c.title}”.`,'*');
  toast(ok?'Certificado validado.':'Certificado recusado.',ok?'good':'warn');
  quiet(sync('/api/certificates',{action:'review',id:cid,approved:ok}));
}
async function createMission(f){
  if(API.online){
    await API.post('/api/missions',{action:'create',sponsorId:S.sp,title:f.name,area:f.area,plan:f.plan,prize:f.prize,description:f.challenge});
    await refresh();
  }else{
    const mid='m'+(S.mid++);
    const m={id:mid,sp:S.sp,title:f.name,area:f.area,plan:f.plan,pts:PLAN[f.plan].pts,prize:f.prize,desc:f.challenge,joined:0,delivered:0,days:30,me:S.me.part[mid]={joined:false,delivered:false}};
    S.missions.unshift(m);
    addFeed(`${sponsor(S.sp).name} lançou o desafio “${m.title}” (plano ${PLAN[f.plan].nome}).`,'*');
  }
  toast('Desafio publicado para os jovens.','good');
}
function sponsorProject(pid){
  const p=S.projects.find(x=>x.id===pid);if(p.sp)return;
  const st=spStats(S.sp);
  if(st.sponsored>=st.allowed){toast(st.allowed?'Seu plano não inclui mais apadrinhamentos. Lance um desafio Patrocinador ou Parceiro Estratégico.':'Lance um desafio para poder apadrinhar projetos.','warn');return}
  p.sp=S.sp;addFeed(`${sponsor(S.sp).name} apadrinhou “${p.title}”.`,'*');
  toast('Projeto apadrinhado. A marca aparece junto dele no quadro.','good');checkBadges();
  quiet(sync('/api/projects',{action:'sponsor',id:pid,sponsorId:S.sp}));
}
function invite(pid){
  const a=S.invites[S.sp]||(S.invites[S.sp]=[]);if(a.includes(pid))return;
  a.push(pid);const p=S.projects.find(x=>x.id===pid);
  addFeed(`${sponsor(S.sp).name} convidou ${pub(p.owner)} para uma conversa.`,'*');
  toast('Convite enviado pela plataforma. O contato só é liberado após o aceite do jovem e, se menor, do responsável.','good');
  quiet(sync('/api/projects',{action:'invite',id:pid,sponsorId:S.sp}));
}
function report(id){
  const sp=sponsor(id),st=spStats(id),d=new Date();
  const L=[`RELATÓRIO DE ENGAJAMENTO · ${sp.name}`,'Tech SC Hub · Santa Catarina · dados fictícios de demonstração',`Gerado em ${d.toLocaleDateString('pt-BR')} às ${hhmm()}`,'',
  'RESUMO',`${sp.name} (${sp.city}) mantém ${st.ms.length} desafio(s) no Tech SC Hub, somando ${brl(st.quota)} em planos. Até agora, ${nf(st.engaged)} jovens entraram nos desafios e ${nf(st.delivered)} entregaram projetos.`,'',
  'INDICADORES',`• Jovens engajados: ${nf(st.engaged)}`,`• Projetos entregues: ${nf(st.delivered)}`,`• Projetos selecionados para a TV: ${st.aired}`,`• Alcance estimado: ${nf(st.reach)} pessoas`,`• Investimento por jovem engajado: ${brl(st.cost)}`,`• Apadrinhamentos: ${st.sponsored} de ${st.allowed}`,`• Convites para conversa enviados: ${st.invites}`,'',
  'DESAFIOS',...st.ms.map(m=>`• ${m.title} (${m.area}, plano ${PLAN[m.plan].nome}): ${nf(m.joined)} jovens, ${nf(m.delivered)} entregas`),'',
  'TALENTOS EM DESTAQUE (nota da banca técnica)',...(st.top.length?st.top.map(p=>`• ${pub(p.owner)} (${placeOf(p)}): “${p.title}”, nota ${p.score}`):['• Nenhum projeto avaliado ainda.']),'',
  'PRÓXIMOS PASSOS'];
  if(!st.aired)L.push('• Nenhum projeto no ar ainda. Acompanhe a curadoria do quadro Tech SC Jovem.');else L.push(`• ${st.aired} projeto(s) no ar: combine a citação da marca no próximo bloco.`);
  if(st.sponsored<st.allowed)L.push(`• Você ainda pode apadrinhar ${st.allowed-st.sponsored} projeto(s) incluído(s) no plano.`);else L.push('• Apadrinhamentos esgotados: considere o plano Parceiro Estratégico.');
  L.push('• Convide os talentos em destaque para uma conversa pela plataforma.','','PROTEÇÃO DE DADOS','Os jovens aparecem com nome abreviado. Dados de contato não são compartilhados; conversas só acontecem pela plataforma, com aceite do jovem e, se menor de idade, do responsável. As notas são da banca técnica independente.');
  return L.join('\n');
}

/* ============ componentes ============ */
const chipArea=a=>`<span class="chip ar-${a}">${a}</span>`;
const stChip=(t,c)=>`<span class="chip ${c}">${t}</span>`;
const planChip=k=>`<span class="chip pl-${k}">${PLAN[k].nome}</span>`;
const bar=(k,pct,cls='')=>`<div class="bar ${cls}"><i data-k="${k}" data-w="${Math.max(0,Math.min(100,pct)).toFixed(1)}" style="width:${pct}%"></i></div>`;
const kpi=(lab,val,fmt,sub,k)=>`<div class="kpi"><span class="lab">${lab}</span><b class="num" data-k="${k}" data-count="${Math.round(val)}" data-fmt="${fmt}">${fmt==='brl'?brl(val):nf(val)}</b>${sub?`<small>${sub}</small>`:''}</div>`;
const lockIco='<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/></svg>';
function critList(sc,key){
  return`<div class="stack">${CRIT.map(([k,l,w])=>`<div class="crit"><span>${l}${sc?` <small>peso ${w}</small>`:''}</span><b>${sc?sc[k]:w+'%'}</b>${sc?bar(key+k,sc[k]):`<div class="bar"><i style="width:${w*3.3}%"></i></div>`}</div>`).join('')}</div>`;
}
function qr(mid=FEATURED){return qrSvg(deepLink(mid),'QR code que abre o desafio da semana no celular')}
function mCard(m){
  const sp=sponsor(m.sp),t=PLAN[m.plan],pct=m.joined/t.slots*100;
  const st=m.me.delivered?stChip('Entregue','st-ok'):m.me.joined?stChip('Em andamento','st-wait'):'';
  return`<article class="card mcard ar-${m.area}">
    <div class="row">${chipArea(m.area)}${m.plan==='parceiro'?stChip('Com mentoria','pl-parceiro'):''}<span class="spacer"></span><span class="pts">+${m.pts} XP</span></div>
    <h3>${esc(m.title)}</h3><p class="sp">${esc(sp.name)}, ${esc(sp.city)}</p>
    <p class="prize"><b>Prêmio:</b> ${esc(m.prize)}</p>
    ${bar('mc'+m.id,pct)}
    <div class="line2"><small>${nf(m.joined)} de ${nf(t.slots)} vagas · ${m.days} dias restantes</small>${st}</div>
    <button class="btn ${m.me.delivered?'ghost':''}" data-act="openMission" data-id="${m.id}">${m.me.joined&&!m.me.delivered?'Continuar desafio':'Ver desafio'}</button>
  </article>`;
}
function rankList(){
  const R=ranks(),me=S.me;
  if(!rankTabs().some(t=>t[0]===S.rankTab))S.rankTab=rankTabs()[0][0];
  const li=(pos,name,pts,mine,sub)=>`<li class="${mine?'me':''}"><span class="pos">${pos}º</span><span>${esc(name)}${mine?' (você)':''}${sub?`<br><small>${esc(sub)}</small>`:''}</span><b>${nf(pts)}</b></li>`;
  const nm=x=>x===me?x.name:pub(x.name);
  const lst=(arr,posMe,mk,n)=>{let h=arr.slice(0,n).map((x,i)=>mk(x,i+1)).join('');if(posMe>n)h+=mk(arr[posMe-1],posMe);return h};
  const sub=x=>x.school!=null?SCH[x.school].n:cityOf(x)+', independente';
  const tab=S.rankTab;
  if(tab==='turma')return lst(R.inClass,R.posClass,(x,i)=>li(i,nm(x),x.pts,x===me),7)+(R.inClass.length===1?'<li><span></span><small>Você é a primeira pessoa da turma. Convide seus colegas!</small><span></span></li>':'');
  if(tab==='escola')return lst(R.inSchool,R.posSchool,(x,i)=>li(i,nm(x),x.pts,x===me,x.serie+'ª série '+x.turma),6);
  if(tab==='cidade')return lst(R.inCity,R.posCity,(x,i)=>li(i,nm(x),x.pts,x===me,sub(x)),6);
  if(tab==='regiao')return lst(R.inReg,R.posReg,(x,i)=>li(i,nm(x),x.pts,x===me,cityOf(x)),6);
  if(tab==='escolas')return lst(R.schools,R.posEscolas,(x,i)=>li(i,x.name,x.total,x.i===me.school,x.city),6);
  return lst(R.all,R.posState,(x,i)=>li(i,nm(x),x.pts,x===me,cityOf(x)),6);
}

/* ============ página Conheça ============ */
function tvScreen(msg,sub){
  return`<div class="screen" role="img" aria-label="Exemplo de tela do programa na TV com QR code para entrar no desafio">
    <span class="glow g1"></span><span class="glow g2"></span><div class="grid-lines"></div>
    <div class="bug"><span class="live">AO VIVO</span>NSC TV</div>
    <div class="talk"><p>${esc(msg)}</p><small>${esc(sub)}</small></div>
    <div class="qrbox">${qr()}</div>
    <div class="third"><b>Tech SC Jovem</b><span>Projetos de jovens catarinenses</span></div>
  </div>`;
}
function ticker(){
  const extra=['Blusoft abriu vagas de mentoria para o desafio “Chatbot do suporte”.','Escolas do Oeste somam 12% das participações.','EnerVale oferece estágio de férias no desafio “Calculadora solar”.','Novo recorde: 2.110 jovens no mesmo desafio.'];
  const items=[...S.feed.slice(0,6).map(e=>e.msg),...extra];
  const row=items.map(t=>`<span>${esc(t)}</span>`).join('');
  return`<div class="ticker" aria-label="Atividade recente na plataforma"><span class="tk-lab">Agora</span><div class="tk-win"><div class="tk-track">${row}${row.replace(/<span>/g,'<span aria-hidden="true">')}</div></div></div>`;
}
function confetti(){
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const cols=['#FF6A3D','#1FA884','#FFB938','#2E62D9','#C2357A','#0E6B70'];
  for(let i=0;i<44;i++){const d=document.createElement('span');d.className='cf';d.style.left=Math.random()*100+'vw';d.style.background=cols[i%cols.length];d.style.setProperty('--x',(Math.random()*160-80)+'px');d.style.setProperty('--r',(Math.random()*900-450)+'deg');d.style.setProperty('--d',(1.4+Math.random()*1.3)+'s');d.style.animationDelay=Math.random()*.35+'s';document.body.appendChild(d);setTimeout(()=>d.remove(),3200)}
}
let revObs=null;
function reveal(){
  if(!document.documentElement.classList.contains('js'))return;
  if(!revObs)revObs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');revObs.unobserve(e.target)}}),{threshold:.12});
  document.querySelectorAll('.rv:not(.in)').forEach(el=>revObs.observe(el));
}
function vSobre(){
  const FEAT=[['Marca associada a um desafio',1,1,1],['Menção nas divulgações do Tech SC',1,1,1],['Desafio totalmente personalizado',0,1,1],['Relatório de engajamento',0,1,1],['Destaque na vitrine de desafios',0,1,1],['Co-criação dos desafios com a equipe',0,0,1],['Profissionais da empresa como mentores',0,0,1],['Conteúdos especiais e citação no programa',0,0,1],['Apadrinhamentos de projetos','1','2','4']];
  const keys=Object.keys(PLAN),cell=(v,i)=>`<td class="${i===1?'hl':''}">${v===1?'<span class="yes" aria-label="Incluído"></span>':v===0?'<span class="no-x" aria-label="Não incluído">–</span>':`<b>${v}</b>`}</td>`;
  const path=(role,cls,t,d)=>`<button class="path ${cls}" data-act="go" data-role="${role}"><span class="ic"><svg viewBox="0 0 24 24" aria-hidden="true">${RI[role]}</svg></span><span><b>${t}</b><small>${d}</small></span><span class="go">${ARROW}</span></button>`;
  return`<div class="land">
  <section class="l-hero">
    <div>
      <span class="pulse-pill"><i></i><b>${nf(S.missions.reduce((a,m)=>a+m.joined,0))}</b> jovens em desafios agora</span>
      <h1>Desafios reais. <span>Experiência de verdade.</span></h1>
      <p class="lede">Empresas catarinenses lançam problemas reais. Jovens de todo o estado resolvem, pontuam e constroem um portfólio que conta, para nunca mais ouvir que falta experiência. Os melhores projetos vão ao ar no quadro Tech SC Jovem, na NSC TV.</p>
      <button class="link" data-act="startDemo">Ver demonstração guiada</button>
    </div>
    <div class="paths"><p>Por onde você começa?</p>
      ${path('jovem','main-path','Sou jovem','Entre em desafios, ganhe pontos e monte seu portfólio.')}
      ${path('patro','','Sou empresa','Lance um desafio e acompanhe o retorno em números.')}
      ${path('prog','','Sou da equipe do programa','Curadoria do quadro na TV e validação de certificados.')}
    </div>
  </section>

  ${ticker()}

  <section class="band rv">
    <div>${tvScreen('Aponte a câmera e entre no desafio da semana.','Desafio Troco solidário · Litoral Pay')}
      <p class="screen-cap">Este QR funciona: aponte a câmera do celular e entre no desafio da semana.</p></div>
    <div>
      <h2>A TV chama o público. O site é onde a experiência acontece.</h2>
      <p>Durante o programa, um QR code leva quem está assistindo direto ao desafio da semana. Quem participa ganha pontos na hora, e os melhores projetos voltam para a tela.</p>
      <div class="roles2"><span>TV: amplifica e divulga os resultados</span><span>Site: o motor da experiência</span></div>
      <a class="btn" href="tv.html" target="_blank" rel="noopener" style="margin-top:20px">Abrir o telão ao vivo</a>
    </div>
  </section>

  <section class="l-sec rv">
    <p class="quote">“Como ter experiência se ninguém dá a primeira chance?”</p>
    <small>Fala recorrente dos jovens ouvidos no mapa da empatia do projeto.</small>
    <div class="pains">
      <div class="pain"><div class="d"><b>A dor</b>Vagas de estágio e nível júnior pedem uma experiência que o jovem ainda não tem.</div><div class="g"><b>Portfólio real</b><p>Cada desafio resolvido é um projeto feito para o problema de uma empresa de verdade.</p></div></div>
      <div class="pain"><div class="d"><b>A dor</b>Ensino passivo, teórico e sem aplicação prática gera desânimo.</div><div class="g"><b>Evolução visível</b><p>Pontos, níveis, medalhas e certificados validados mostram o quanto você cresceu.</p></div></div>
      <div class="pain"><div class="d"><b>A dor</b>Falta networking e um canal direto com quem contrata.</div><div class="g"><b>Prêmios e oportunidades</b><p>Prêmios em dinheiro, mentorias e convites diretos das empresas que patrocinam.</p></div></div>
    </div>
  </section>

  <section class="l-sec rv">
    <h2>Como funciona</h2>
    <ol class="timeline">
      <li><b>A empresa lança um desafio</b>Um problema real da área dela, com prêmio e prazo.</li>
      <li><b>O jovem entra e constrói</b>De qualquer cidade de SC, com ou sem escola parceira.</li>
      <li><b>A banca avalia</b>Critérios técnicos públicos e iguais para todos. A empresa não dá nota.</li>
      <li><b>Os melhores vão ao ar</b>O quadro Tech SC Jovem apresenta os projetos na NSC TV.</li>
      <li><b>Todos ganham</b>Portfólio e certificado para o jovem; relatório e talentos para a empresa.</li>
    </ol>
  </section>

  <section class="l-sec rv">
    <h2>Ganho para todos os lados</h2>
    <div class="eco">
      <article style="--ac:var(--acc)"><h3>Jovens</h3><ul><li>Aprender fazendo, com problemas reais</li><li>Portfólio e certificados validados pela JA SC</li><li>Visibilidade na TV e prêmios</li><li>Mentorias e convites para estágio</li></ul></article>
      <article style="--ac:var(--brand)"><h3>Empresas</h3><ul><li>Novas perspectivas e soluções criativas</li><li>Imagem ligada à juventude e à inovação</li><li>Dados de engajamento, não só exibição de marca</li><li>Contato direto com futuros talentos</li></ul></article>
      <article style="--ac:var(--mint)"><h3>Mídia</h3><ul><li>Conteúdo dinâmico e de impacto social</li><li>Pauta contínua para a grade e os canais digitais</li><li>Audiência que participa pela segunda tela</li></ul></article>
    </div>
  </section>

  <section class="l-sec rv">
    <h2>Para empresas: publicidade que vira participação</h2>
    <p class="intro">Em vez de um banner, sua marca propõe um desafio, oferece prêmios e mentorias e acompanha o retorno em números. Compare os níveis de envolvimento.</p>
    <div class="compare"><table>
      <thead><tr><th>O que está incluído</th>${keys.map((k,i)=>`<th class="${i===1?'hl':''}"><span class="pn">${PLAN[k].nome}</span><small>Foco em ${PLAN[k].foco.toLowerCase()}</small></th>`).join('')}</tr></thead>
      <tbody>${FEAT.map(f=>`<tr><td>${f[0]}</td>${f.slice(1).map(cell).join('')}</tr>`).join('')}</tbody>
      <tfoot><tr><td>A partir de</td>${keys.map((k,i)=>`<td class="${i===1?'hl':''}">${brl(PLAN[k].valor)}</td>`).join('')}</tr></tfoot>
    </table></div>
    <div class="row" style="margin-top:16px"><button class="btn" data-act="go" data-role="patro">Lançar um desafio</button><small>Valores de referência fictícios, apenas para demonstração.</small></div>
  </section>

  <section class="l-sec rv">
    <h2>Nossos compromissos</h2>
    <p class="intro">A plataforma envolve menores de idade. Por isso, dois pontos não são negociáveis.</p>
    <div class="promise">
      <div class="card"><div class="head"><h3>Avaliação transparente e independente</h3></div>
        <p style="margin-bottom:16px">Todo projeto é avaliado por uma banca técnica com os mesmos critérios e pesos, divulgados antes do desafio começar. O jovem vê a nota de cada critério. A empresa patrocinadora não participa da avaliação.</p>
        ${critList(null,'pub')}
      </div>
      <div class="card"><div class="head"><h3>Proteção de dados dos jovens</h3></div>
        <ul>
          <li>Participação de menores de 18 anos só com autorização do responsável.</li>
          <li>Em rankings e para as empresas, o jovem aparece com nome abreviado.</li>
          <li>Empresas nunca recebem e-mail, telefone ou endereço. Convites passam pela plataforma e dependem de aceite.</li>
          <li>O portfólio só fica visível para empresas se o jovem quiser.</li>
          <li>Nenhum dado pessoal é vendido ou usado para publicidade, em linha com a LGPD.</li>
        </ul>
      </div>
    </div>
  </section>
  <footer class="foot"><span>Tech SC Hub · protótipo da equipe Tech Conecta</span><span>Empresas, escolas, pessoas e valores são fictícios.</span></footer>
  </div>`;
}

/* ============ telas: jovem ============ */
function vJovemInicio(){
  const me=S.me,lv=level(me.pts),R=ranks(),m1=mission('m1');
  const rec=recs();
  return`<div class="split">
  <div class="col">
    <section class="card feature mcard ar-${m1.area}">
      <div class="row"><span class="chip st-pc">Desafio da semana</span>${chipArea(m1.area)}<span class="spacer"></span><span class="pts">+${m1.pts} XP</span></div>
      <h2>${esc(m1.title)}</h2>
      <p class="sp">${esc(sponsor(m1.sp).name)}, ${esc(sponsor(m1.sp).city)} · ${nf(m1.joined)} jovens já entraram · ${m1.days} dias restantes</p>
      <p style="max-width:60ch">${esc(m1.desc)}</p>
      <p class="prize"><b>Prêmio:</b> ${esc(m1.prize)}</p>
      <div class="row" style="margin-top:4px"><button class="btn" data-act="openMission" data-id="m1">${m1.me.delivered?'Desafio entregue':m1.me.joined?'Continuar desafio':'Ver desafio'}</button></div>
    </section>

    <section class="card">
      <div class="me"><div class="avatar">${ini(me.name)}</div>
        <div style="min-width:0;flex:1"><h2>${esc(me.name)}</h2><small>${me.school!=null?`${esc(SCH[me.school].n)}, ${esc(SCH[me.school].city)} · ${me.serie}ª série ${me.turma}`:`${esc(me.city)} · participante independente`}</small></div>
        <div class="xpbox"><div class="xp ${S.bump?'bump':''}"><span data-k="xp" data-count="${me.pts}" data-fmt="n">${nf(me.pts)}</span></div><small>pontos de experiência</small></div>
      </div>
      <div class="lvl"><span>Nível ${lv.i}: <b>${lv.name}</b></span><span>${lv.next?`faltam ${nf(lv.toNext)} XP para ${lv.next.n}`:'nível máximo'}</span></div>
      ${bar('lvl',lv.pct)}
      <div class="lvl-steps" aria-hidden="true">${LV.map((l,i)=>`<span class="${i+1<lv.i?'done':i+1===lv.i?'now':''}">${l.n}</span>`).join('')}</div>
      <div class="pills">${me.school!=null?`<span class="pill">Na turma<b>${R.posClass}º</b></span><span class="pill">Na escola<b>${R.posSchool}º</b></span>`:''}<span class="pill">Na cidade<b>${R.posCity}º</b></span><span class="pill">No estado<b>${R.posState}º</b></span>${me.school!=null?`<span class="pill">Sua escola<b>${R.posEscolas}º</b></span>`:''}</div>
    </section>

    <section class="card">
      <div class="head"><h2>Recomendados para você</h2></div>
      <div class="row" style="margin-bottom:14px"><small style="margin-right:4px">Seus interesses:</small>${AREAS.map(a=>`<button class="chip ar-${a} ${me.interests.includes(a)?'sel':''}" data-act="interest" data-id="${a}" aria-pressed="${me.interests.includes(a)}">${a}</button>`).join('')}</div>
      <div class="grid">${rec.length?rec.map(x=>`<div class="stack">${mCard(x.m)}<p class="notice">Por que recomendamos: ${x.why.join('; ')}.</p></div>`).join(''):'<div class="empty">Você já está em todos os desafios abertos.</div>'}</div>
    </section>
  </div>
  <div class="col">
    <section class="card">
      <div class="head"><h2>Segunda tela</h2>${stChip('Exemplo','')}</div>
      ${tvScreen('Desafio relâmpago: entre agora pelo QR.','Troco solidário · Litoral Pay')}
      <button class="btn dark wide" style="margin-top:12px" data-act="scan">${S.flags.scanned?'Ler o QR de novo':'Ler o QR do programa'}</button>
    </section>
    <section class="card">
      <div class="head"><h2>Ranking</h2></div>
      <div class="tabs2">${rankTabs().map(([k,l])=>`<button class="chip st-pc ${S.rankTab===k?'sel':''}" data-act="rankTab" data-id="${k}" aria-pressed="${S.rankTab===k}">${l}</button>`).join('')}</div>
      <ol class="rank">${rankList()}</ol>
      <p class="notice" style="margin-top:10px">Outros participantes aparecem com nome abreviado.</p>
    </section>
  </div>
  </div>`;
}
function vJovemDesafios(){
  const f=S.filter;const sps=[...new Set(S.missions.map(m=>m.sp))];
  const list=S.missions.filter(m=>(f.area==='Todas'||m.area===f.area)&&(f.sp==='todos'||m.sp===f.sp));
  return`<section class="card">
    <div class="head"><h2>Desafios abertos</h2><small>${list.length} de ${S.missions.length}</small></div>
    <div class="filters">${['Todas',...AREAS].map(a=>`<button class="chip ${a==='Todas'?'st-pc':'ar-'+a} ${f.area===a?'sel':''}" data-act="fArea" data-id="${a}" aria-pressed="${f.area===a}">${a}</button>`).join('')}</div>
    <div style="margin-top:14px;max-width:360px"><label class="f">Empresa<select data-filter="sp"><option value="todos">Todas as empresas</option>${sps.map(id=>`<option value="${id}" ${f.sp===id?'selected':''}>${esc(sponsor(id).name)}</option>`).join('')}</select></label></div>
  </section>
  <div class="grid">${list.map(mCard).join('')||'<div class="empty">Nenhum desafio com esses filtros. Tente outra área ou empresa.</div>'}</div>`;
}
function vJovemPortfolio(){
  const me=S.me,mine=S.certs.filter(c=>isMine(c)),projs=S.projects.filter(p=>isMine(p));
  const ok=mine.filter(c=>c.status==='validado').length,lv=level(me.pts);
  return`<section class="card lead">
    <div class="head"><h2>Meu portfólio</h2>${stChip(me.showPortfolio?'Visível para empresas':'Privado',me.showPortfolio?'st-ok':'')}</div>
    <p>Nível ${lv.i} (${lv.name}) · ${projs.length} projeto(s) entregue(s) · ${ok} certificado(s) validado(s) pela JA SC. É isso que você mostra a empresas e faculdades quando pedirem experiência.</p>
    <div class="toggle" style="margin-top:14px"><span><b>Mostrar meu portfólio às empresas parceiras</b><br><small>Elas veem seus projetos e notas, com nome abreviado. Contato só com o seu aceite${me.birth&&YEAR-me.birth<18?' e do seu responsável':''}.</small></span>
      <button class="switch" role="switch" aria-checked="${!!me.showPortfolio}" aria-label="Mostrar portfólio às empresas" data-act="togglePortfolio"></button></div>
  </section>
  <section class="card"><div class="head"><h2>Projetos</h2></div><div class="stack">
    ${projs.map(p=>`<div class="cert"><div style="flex:1;min-width:180px"><b>${esc(p.title)}</b><br><small>${esc(mission(p.mission).title)} · ${esc(sponsor(mission(p.mission).sp).name)}</small></div>
      <div class="row">${p.status==='avaliacao'?stChip('Aguardando a banca técnica','st-wait'):p.status==='aprovado'?stChip('No ar no Tech SC Jovem','st-tv'):p.status==='recusado'?stChip('Não selecionado para a TV','st-no'):stChip('Na fila do quadro','st-wait')}${p.sp?stChip('Padrinho: '+esc(sponsor(p.sp).name),'st-ok'):''}${p.score!=null?`<button class="btn ghost sm" data-act="openEval" data-id="${p.id}">Nota ${p.score} · ver avaliação</button>`:''}</div></div>`).join('')||'<div class="empty">Seus projetos aparecem aqui depois do envio.<br><br><button class="btn sm" data-act="tab" data-id="desafios">Escolher um desafio</button></div>'}
  </div></section>
  <div class="grid">
  <section class="card"><div class="head"><h2>Certificados</h2></div><div class="stack">
    ${mine.map(c=>`<div class="cert ar-${c.area} ${S.fresh[c.id]?'new':''}"><div class="seal"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICON.cert}</svg></div>
      <div style="flex:1;min-width:0"><b>${esc(c.title)}</b><br><small>Habilidade: ${c.area}</small></div>
      ${c.status==='validado'?stChip('Validado pela JA SC','st-ok'):c.status==='recusado'?stChip('Recusado','st-no'):stChip('Em validação','st-wait')}</div>`).join('')||'<div class="empty">Seus certificados aparecem aqui.</div>'}
  </div></section>
  <section class="card"><div class="head"><h2>Habilidades</h2></div><div class="stack">
    ${AREAS.map(a=>`<div class="skill ar-${a}"><span>${a}</span>${bar('sk'+a,me.skills[a])}<b>${me.skills[a]}</b></div>`).join('')}
  </div></section>
  </div>
  <section class="card"><div class="head"><h2>Medalhas</h2><small>${badges().filter(b=>b.ok()).length} de ${badges().length}</small></div>
    <div class="badges">${badges().map(b=>`<div class="badge ${b.ok()?'':'off'} ${S.fresh[b.id]?'fresh':''}"><svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="17" fill="var(${b.c})" opacity=".15"/><circle cx="20" cy="20" r="13" fill="none" stroke="var(${b.c})" stroke-width="3"/><path d="M14 20l4 4 8-9" fill="none" stroke="var(${b.c})" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>${b.n}</div>`).join('')}</div>
  </section>`;
}
function vJovemEnviar(){
  const open=S.missions.filter(m=>m.me.joined&&!m.me.delivered);
  const pre=S.preMission&&open.some(m=>m.id===S.preMission)?S.preMission:(open[0]&&open[0].id);
  return`<div class="grid" style="align-items:start">
  <section class="card">
    <div class="head"><h2>Enviar projeto</h2></div>
    ${open.length?`<form data-form="project" novalidate>
      <label class="f">Desafio<select id="pj-mission" name="mission">${open.map(m=>`<option value="${m.id}" ${m.id===pre?'selected':''}>${esc(m.title)} · ${esc(sponsor(m.sp).name)}</option>`).join('')}</select></label>
      <label class="f">Título do projeto<input type="text" id="pj-title" name="title" maxlength="60" placeholder="Ex.: Troco do Bem"></label>
      <label class="f">Descrição<textarea id="pj-desc" name="desc" maxlength="400" placeholder="O que ele faz, como você construiu e qual problema resolve?"></textarea></label>
      <label class="f">Link do projeto<input type="url" id="pj-link" name="link" placeholder="https://..."></label>
      <label class="f">Ou anexe um arquivo<input type="file" id="pj-file" name="file"></label>
      <p class="notice">Nesta demonstração o arquivo não sai do seu aparelho. Não inclua dados pessoais (telefone, endereço) no projeto.</p>
      <p class="err" id="pj-err" role="alert"></p>
      <div class="row"><button class="btn" type="submit">Enviar projeto</button><button class="btn ghost" type="button" data-act="fillExample">Preencher exemplo</button></div>
    </form>`:`<div class="empty">Entre em um desafio para poder enviar um projeto.<br><br><button class="btn" data-act="tab" data-id="desafios">Ver desafios</button></div>`}
  </section>
  <section class="card"><div class="head"><h3>Como seu projeto será avaliado</h3></div>
    <p class="mute" style="margin-bottom:14px">Uma banca técnica independente usa os mesmos critérios para todos. Você recebe a nota de cada um.</p>
    ${critList(null,'env')}
  </section></div>`;
}

/* ============ telas: empresa ============ */
function vPatroPainel(){
  const id=S.sp,sp=sponsor(id),st=spStats(id);
  if(st.projs.some(p=>isMine(p)))S.flags.sponsorSeen=true;
  const maxE=Math.max(1,st.engaged);
  return`  <div class="kpis">
    ${kpi('Jovens engajados',st.engaged,'n','entraram nos seus desafios','k1')}
    ${kpi('Projetos entregues',st.delivered,'n',st.aired+' no ar na TV','k2')}
    ${kpi('Alcance estimado',st.reach,'n','pessoas impactadas (estimativa)','k3')}
    ${kpi('Investimento por jovem',st.cost,'brl',brl(st.quota)+' em planos','k4')}
  </div>
  <div class="grid">
    <section class="card"><div class="head"><h2>Funil de retorno</h2></div><div class="stack">
      <div><div class="line2"><span>Entraram no desafio</span><b>${nf(st.engaged)}</b></div>${bar('f1',st.engaged?100:0)}</div>
      <div><div class="line2"><span>Entregaram projeto</span><b>${nf(st.delivered)}</b></div>${bar('f2',st.delivered/maxE*100,'ar-IA')}</div>
      <div><div class="line2"><span>Selecionados para a TV</span><b>${st.aired}</b></div>${bar('f3',Math.max(st.aired?3:0,st.aired/maxE*100),'st-tv')}</div>
      <p class="notice">Apadrinhamentos usados: ${st.sponsored} de ${st.allowed} incluídos nos seus planos.</p>
    </div></section>
    <section class="card"><div class="head"><h2>Seus desafios</h2></div><div class="stack">
      ${st.ms.map(m=>`<div><div class="line2"><span>${esc(m.title)} ${planChip(m.plan)}</span><b>${nf(m.joined)}</b></div>${bar('pm'+m.id,m.joined/PLAN[m.plan].slots*100,'ar-'+m.area)}</div>`).join('')||'<div class="empty">Nenhum desafio ainda.<br><br><button class="btn sm" data-act="tab" data-id="criar">Criar o primeiro desafio</button></div>'}
    </div></section>
  </div>
  <div class="grid">
    <section class="card"><div class="head"><h2>Talentos em destaque</h2><small>Nota da banca técnica</small></div><div class="stack">
      ${st.top.map(p=>`<div class="talent"><div class="sc">${p.score}</div><div style="min-width:0"><b>${esc(p.title)}</b><br><small>${esc(pub(p.owner))} · ${esc(placeOf(p))}</small></div>${p.status==='aprovado'||p.sp===id?`<div class="row">${p.status==='aprovado'?stChip('No ar','st-tv'):''}${p.sp===id?stChip('Seu apadrinhado','st-ok'):''}</div>`:''}</div>`).join('')||'<div class="empty">Os projetos mais bem avaliados aparecem aqui.</div>'}
    </div></section>
    <section class="card"><div class="head"><h2>Atividade recente</h2></div>
      <ul class="feed">${S.feed.filter(e=>e.sp===id||e.sp==='*').map(e=>`<li><time>${e.t}</time><span>${esc(e.msg)}</span></li>`).join('')}</ul></section>
  </div>
  ${st.hasReport?`<button class="btn wide" data-act="report">Gerar relatório de engajamento</button>`:`<div class="lock">${lockIco}<span>O relatório de engajamento faz parte dos planos Patrocinador e Parceiro Estratégico. <button class="link" data-act="tab" data-id="criar">Lançar um desafio com relatório</button></span></div>`}`;
}
function vPatroCriar(){
  return`<section class="card"><div class="head"><h2>Lançar desafio</h2><small>${esc(sponsor(S.sp).name)}</small></div>
  <form data-form="mission" novalidate>
    <div class="two"><label class="f">Nome do desafio<input type="text" id="ms-name" name="name" maxlength="50" placeholder="Ex.: App de rotas do ônibus"></label>
    <label class="f">Área<select id="ms-area" name="area">${AREAS.map(a=>`<option>${a}</option>`).join('')}</select></label></div>
    <label class="f">Problema real a resolver<textarea id="ms-ch" name="challenge" maxlength="300" placeholder="Que problema da sua empresa os jovens vão resolver? O que devem entregar?"></textarea></label>
    <label class="f">Prêmio e oportunidades<input type="text" id="ms-prize" name="prize" maxlength="90" placeholder="Ex.: bolsa de R$ 1.000 + mentoria + entrevista para estágio"></label>
    <fieldset><legend>Plano</legend>
    <div class="plans">${Object.entries(PLAN).map(([k,p],i)=>`<label class="plan"><input type="radio" name="plan" value="${k}" ${i===1?'checked':''}><span class="chip pl-${k}" style="align-self:flex-start">Foco em ${p.foco.toLowerCase()}</span><span class="pn">${p.nome}</span><span class="pv">${brl(p.valor)}</span><small>até ${nf(p.slots)} jovens · +${p.pts} XP por entrega</small><ul>${p.itens.map(x=>`<li>${x}</li>`).join('')}</ul></label>`).join('')}</div></fieldset>
    <p class="notice">Valores fictícios. A avaliação dos projetos é feita pela banca técnica do programa, com critérios públicos. A empresa não atribui notas.</p>
    <p class="err" id="ms-err" role="alert"></p>
    <div class="row"><button class="btn" type="submit">Publicar desafio</button><button class="btn ghost" type="button" data-act="fillMission">Preencher exemplo</button></div>
  </form></section>`;
}
function vPatroTalentos(){
  const st=spStats(S.sp),inv=S.invites[S.sp]||[];
  const list=S.projects.filter(p=>p.score!=null&&p.status!=='recusado').sort((a,b)=>b.score-a.score);
  return`  <div class="grid">${list.map(p=>{const m=mission(p.mission),priv=isMine(p)&&!S.me.showPortfolio;return`<article class="card stack">
    <div class="row">${chipArea(m.area)}${p.status==='aprovado'?stChip('No ar','st-tv'):stChip('Na fila do quadro','st-wait')}${isMine(p)?stChip('Novo','st-ok'):''}<span class="spacer"></span><b class="num" style="font-size:20px">${p.score}</b></div>
    <h3>${esc(p.title)}</h3><p class="mute">${esc(p.desc)}</p><small>${esc(pub(p.owner))} · ${esc(placeOf(p))} · desafio ${esc(m.title)}</small>
    ${p.sp?`<div class="empty" style="padding:8px">${p.sp===S.sp?'Apadrinhado por você':'Apadrinhado por '+esc(sponsor(p.sp).name)}</div>`:`<button class="btn" data-act="sponsor" data-id="${p.id}">Apadrinhar</button>`}
    ${priv?'<small>Este jovem deixou o portfólio privado. Convites indisponíveis.</small>':inv.includes(p.id)?stChip('Convite enviado · aguardando aceite','st-wait'):`<button class="btn ghost" data-act="invite" data-id="${p.id}">Convidar para conversa</button>`}
    </article>`}).join('')}</div>`;
}

/* ============ telas: programa ============ */
function vProgMetricas(){
  const tot=S.missions.reduce((a,m)=>a+m.joined,0),del=S.missions.reduce((a,m)=>a+m.delivered,0);
  const rev=S.missions.reduce((a,m)=>a+PLAN[m.plan].valor,0);
  const sps=new Set(S.missions.map(m=>m.sp)).size;
  const fila=S.projects.filter(p=>p.status==='pendente').length,ar=S.projects.filter(p=>p.status==='aprovado').length;
  const byT=Object.keys(PLAN).map(k=>({k,v:S.missions.filter(m=>m.plan===k).reduce((a,m)=>a+PLAN[k].valor,0),c:PLAN[k].cor}));
  let acc=0;const grad=byT.map(t=>{const a=acc/rev*100;acc+=t.v;return`${t.c} ${a}% ${acc/rev*100}%`}).join(',');
  const byA=AREAS.map(a=>({a,v:S.missions.filter(m=>m.area===a).reduce((x,m)=>x+m.joined,0)}));const maxA=Math.max(...byA.map(x=>x.v),1);
  return`  <div class="kpis">
    ${kpi('Jovens cadastrados',BASE_JOVENS+S.registered,'n',nf(BASE_INDEP+S.indep)+' sem vínculo com escola','p1')}
    ${kpi('Participações em desafios',tot,'n',nf(del)+' projetos entregues','p2')}
    ${kpi('Escolas parceiras',BASE_ESCOLAS,'n','em '+BASE_CIDADES+' cidades','p3')}
    ${kpi('Desafios ativos',S.missions.length,'n','de '+sps+' empresas','p4')}
    ${kpi('Receita dos planos',rev,'brl','valores fictícios','p5')}
    ${kpi('Empresas',sps,'n','com desafios no ar','p6')}
    ${kpi('Na fila do quadro',fila,'n',S.projects.filter(p=>p.status==='avaliacao').length+' esperando a banca','p7')}
    ${kpi('No ar',ar,'n','projetos no Tech SC Jovem','p8')}
  </div>
  <div class="grid">
    <section class="card"><div class="head"><h2>Receita por plano</h2></div>
      <div class="row" style="flex-wrap:nowrap;gap:20px"><div class="donut" style="background:conic-gradient(${grad})" role="img" aria-label="Receita por plano"></div>
      <div class="legend">${byT.map(t=>`<span><i style="background:${t.c}"></i>${PLAN[t.k].nome}: <b>${brl(t.v)}</b></span>`).join('')}</div></div></section>
    <section class="card"><div class="head"><h2>Participação por área</h2></div><div class="stack">
      ${byA.map(x=>`<div class="ar-${x.a}"><div class="line2"><span>${x.a}</span><b>${nf(x.v)}</b></div>${bar('pa'+x.a,x.v/maxA*100)}</div>`).join('')}</div></section>
  </div>
  <section class="card"><div class="head"><h2>Participação por região</h2></div><div class="stack">
    ${(()=>{const arr=REGS.map(g=>({g,v:Math.round(S.baseJoined*REG_SHARE[g])+S.regionJoin[g]}));const mx=Math.max(...arr.map(z=>z.v));return arr.map(x=>`<div><div class="line2"><span>${x.g}</span><b>${nf(x.v)}</b></div>${bar('pr'+x.g,x.v/mx*100)}</div>`).join('')})()}</div></section>
  <section class="card"><div class="head"><h2>Empresas</h2></div><div class="tbl"><table><thead><tr><th>Empresa</th><th>Cidade</th><th>Desafios</th><th>Investimento</th><th>Jovens</th></tr></thead><tbody>
    ${S.sponsors.map(s=>{const st=spStats(s.id);return`<tr><td><b>${esc(s.name)}</b></td><td>${esc(s.city)}</td><td>${st.ms.length}</td><td>${brl(st.quota)}</td><td>${nf(st.engaged)}</td></tr>`}).join('')}
  </tbody></table></div></section>
  <section class="card"><div class="head"><h2>Atividade da plataforma</h2></div><ul class="feed">${S.feed.map(e=>`<li><time>${e.t}</time><span>${esc(e.msg)}</span></li>`).join('')}</ul></section>`;
}
function vProgBanca(){
  const q=S.projects.filter(p=>p.status==='avaliacao');
  const done=S.projects.filter(p=>p.score!=null).length;
  const card=p=>{const m=mission(p.mission),sp=sponsor(m.sp);
    const link=/^https?:\/\//.test(p.link||'')?`<a href="${esc(p.link)}" target="_blank" rel="noopener noreferrer">Abrir o projeto</a>`:p.link?`<small>${esc(p.link)}</small>`:'';
    return`<article class="card grade-card"><form data-form="grade" data-id="${p.id}" novalidate>
      <div class="row">${chipArea(m.area)}<span class="chip">Desafio: ${esc(m.title)}</span><span class="chip">${esc(sp.name)}</span></div>
      <div><h3 style="font-size:19px">${esc(p.title)}</h3><p class="mute" style="margin-top:6px">${esc(p.desc)}</p>${link?`<p style="margin-top:8px">${link}</p>`:''}</div>
      <div class="stack" style="gap:14px">${CRIT.map(([k,l,w])=>`<label class="gr"><span class="gr-top"><b>${l}</b><small>peso ${w}</small><output data-out="${k}">75</output></span><small>${CRIT_HINT[k]}</small><input type="range" name="${k}" min="0" max="100" step="5" value="75" aria-label="${l}"></label>`).join('')}</div>
      <div class="total"><span>Nota final (média ponderada)</span><span class="num gt">75</span></div>
      <p class="err" role="alert"></p>
      <button class="btn" type="submit">Enviar notas</button>
    </form></article>`};
  return`<div class="lock"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/><path d="M3 3l18 18"/></svg><span>A empresa que lançou o desafio não participa da avaliação. Depois das notas, o projeto vai para a fila do quadro, onde a equipe da NSC TV escolhe quem vai ao ar. ${done} projetos já avaliados.</span></div>
  <div class="grid" style="align-items:start">${q.map(card).join('')||'<div class="empty">Nenhum projeto esperando avaliação. Quando um jovem entregar, ele aparece aqui.</div>'}</div>`;
}
function vProgFila(){
  const q=S.projects.filter(p=>p.status==='pendente').sort((a,b)=>b.score-a.score),ar=S.projects.filter(p=>p.status==='aprovado');
  const card=(p,act)=>{const m=mission(p.mission);return`<article class="card stack">
    <div class="row">${chipArea(m.area)}${isMine(p)?stChip('Novo','st-ok'):''}<span class="spacer"></span><small>nota da banca</small><b class="num" style="font-size:22px">${p.score}</b></div>
    <h3>${esc(p.title)}</h3><p class="mute">${esc(p.desc)}</p>
    <small>${esc(p.owner)} · ${esc(placeOf(p))} · desafio de ${esc(sponsor(m.sp).name)}</small>${p.link?`<small>Entrega: ${esc(p.link)}</small>`:''}
    <button class="link" style="align-self:flex-start" data-act="openEval" data-id="${p.id}">Ver notas por critério</button>
    ${act?`<div class="row"><button class="btn ok" data-act="approve" data-id="${p.id}">Selecionar para o quadro</button><button class="btn no" data-act="refuse" data-id="${p.id}">Não selecionar</button></div>`:`<div class="row">${stChip('No ar','st-tv')}${p.sp?stChip('Padrinho: '+esc(sponsor(p.sp).name),'st-ok'):''}</div>`}</article>`};
  return`  <div class="grid">${q.map(p=>card(p,true)).join('')||'<div class="empty">Fila vazia. Todos os projetos foram analisados.</div>'}</div>
  <div class="head" style="margin:6px 0 0"><h2>Já no ar (${ar.length})</h2></div>
  <div class="grid">${ar.map(p=>card(p,false)).join('')||'<div class="empty">Nenhum projeto no ar ainda.</div>'}</div>`;
}
function vProgCert(){
  const pend=S.certs.filter(c=>c.status==='pendente'),done=S.certs.filter(c=>c.status!=='pendente');
  return`  <div class="grid">${pend.map(c=>`<article class="card stack ar-${c.area}">
    <div class="row">${chipArea(c.area)}${isMine(c)?stChip('Novo','st-ok'):''}</div><h3>${esc(c.title)}</h3><small>${esc(c.owner)} · ${esc(placeOf(c))}</small>
    <div class="row"><button class="btn ok" data-act="vcert" data-id="${c.id}">Validar</button><button class="btn no" data-act="rcert" data-id="${c.id}">Recusar</button></div></article>`).join('')||'<div class="empty">Nenhum certificado pendente.</div>'}</div>
  ${done.length?`<section class="card"><div class="head"><h2>Já analisados</h2></div><div class="stack">${done.map(c=>`<div class="cert"><div style="flex:1;min-width:0"><b>${esc(c.title)}</b><br><small>${esc(c.owner)}</small></div>${c.status==='validado'?stChip('Validado','st-ok'):stChip('Recusado','st-no')}</div>`).join('')}</div></section>`:''}`;
}

/* ============ acesso de demonstração ============ */
function pageHead(){
  const r=S.role,t=S.tab[r],a=S.auth[r];
  if(r==='sobre')return'';
  let T='',D='',X='';
  if(!a){
    T={jovem:'Entrar como jovem',patro:'Entrar como empresa',prog:'Equipe do programa'}[r];
    D={jovem:'Com ou sem escola parceira, de qualquer cidade de Santa Catarina.',patro:'Lance desafios, apadrinhe projetos e acompanhe o retorno em números.',prog:'Banca técnica, curadoria do quadro na NSC TV e validação de certificados pela JA SC.'}[r];
  }else if(r==='jovem'){
    const first=S.me.name.split(' ')[0],lv=level(S.me.pts);
    ({inicio:()=>{T='Olá, '+first;D=`Nível ${lv.i} (${lv.name}). Seu desafio da semana, seu progresso e onde você está no ranking.`},
      desafios:()=>{T='Desafios abertos';D='Problemas reais de empresas catarinenses. Escolha um, construa e entregue.'},
      portfolio:()=>{T='Meu portfólio';D='O que você mostra quando pedirem experiência: projetos, notas, certificados e medalhas.'},
      enviar:()=>{T='Enviar projeto';D='Entregue sua solução para a banca técnica avaliar.'}})[t]();
  }else if(r==='patro'){
    const sp=sponsor(S.sp),st=spStats(S.sp);
    ({painel:()=>{T='Painel de impacto';D=`${sp.name}, ${sp.city} · ${sp.sector} · ${st.ms.length} desafio(s) ativo(s)`;X=stChip('Atualizado agora','st-ok')},
      criar:()=>{T='Lançar desafio';D='Transforme um problema real da empresa em experiência para jovens catarinenses.'},
      talentos:()=>{T='Talentos';D='Apadrinhar coloca sua marca ao lado do projeto no quadro e garante mentoria da sua equipe. Os jovens aparecem com nome abreviado e contatos pessoais não são compartilhados.';X=stChip(st.sponsored+' de '+st.allowed+' apadrinhamentos','st-pc')}})[t]();
  }else{
    const q=S.projects.filter(p=>p.status==='pendente').length,pend=S.certs.filter(c=>c.status==='pendente').length;
    const ag=S.projects.filter(p=>p.status==='avaliacao').length;
    ({banca:()=>{T='Banca técnica';D='Avaliação às cegas: você vê o projeto e o desafio, mas não o nome, a escola nem a cidade de quem fez. Os critérios e pesos são os mesmos para todos.';X=stChip(ag+' para avaliar','st-wait')},
      metricas:()=>{T='Visão geral de Santa Catarina';D='Jovens das 6 regiões do estado, com ou sem vínculo com escola. Todos os números são de exemplo.'},
      fila:()=>{T='Quadro Tech SC Jovem';D='Projetos já avaliados pela banca técnica, em ordem de nota. Escolha quais vão ao ar. A empresa patrocinadora não influencia a nota nem a seleção.';X=stChip(q+' na fila','st-wait')},
      cert:()=>{T='Validação de certificados';D=`A Junior Achievement SC confere cada entrega e valida o certificado, que passa a constar no portfólio. Já são ${186+S.certs.filter(c=>c.status==='validado').length} validados no estado (exemplo).`;X=stChip(pend+' pendentes','st-wait')}})[t]();
  }
  if(r==='prog'&&a)X+='<a class="btn sm" href="tv.html" target="_blank" rel="noopener">Abrir telão</a>';
  const acts=X+(S.demoOpen?'':'<button class="btn ghost sm mob-only" data-act="demoOpen">Demonstração guiada</button>')+(a?'<button class="btn ghost sm" data-act="logout">Sair</button>':'');
  return`<div><h1>${esc(T)}</h1><p>${esc(D)}</p></div><div class="acts">${acts}</div>`;
}
function sideFoot(){
  const r=S.role,a=S.auth[r];
  const who=r==='sobre'||!a?'Protótipo com dados fictícios':`Conectado como <b style="color:var(--sidefg)">${esc(r==='jovem'?S.me.name:r==='patro'?sponsor(S.sp).name:S.staff.name)}</b>`;
  const db=API.online?'<span class="dbst on">Banco de dados conectado</span>':'<span class="dbst">Modo demonstração · dados só neste navegador</span>';
  return`<span>${who}</span>${db}<div class="row"><button class="side-btn" data-act="${S.demoOpen?'demoClose':'demoOpen'}">${S.demoOpen?'Fechar demonstração':'Demonstração guiada'}</button><button class="icon-btn" data-act="theme" aria-label="Alternar tema claro e escuro"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z"/></svg></button></div>`;
}
function vLogin(){
  const note=API.online?'<p class="notice">Seus dados ficam salvos no banco do Tech SC Hub.</p>':'<p class="notice">Modo demonstração: nada é salvo fora desta página.</p>';
  if(S.role==='jovem'){
    const years=[];for(let y=YEAR-14;y>=YEAR-24;y--)years.push(y);
    const pm=S.pending&&mission(S.pending.mission);
    return`${pm?`<div class="qr-arrive"><span class="live">VEIO DA TV</span><span>Entre ou crie sua conta para participar do desafio <b>${esc(pm.title)}</b>${S.pending.tv?' e ganhar +10 XP de segunda tela':''}.</span></div>`:''}<div class="grid" style="align-items:start">
    <section class="card lead"><div class="head"><h2>Entrar no Tech SC Hub</h2>${stChip('Com ou sem escola','st-pc')}</div>
    <p style="margin-bottom:14px">Desafios de tecnologia de empresas catarinenses para jovens de qualquer cidade de Santa Catarina. Estudar em uma escola parceira é opcional.</p>
    <button class="btn wide" data-act="demoJovem">Entrar com a conta de exemplo (Camila, São José)</button>
    <form data-form="login" novalidate style="margin-top:22px;padding-top:18px;border-top:1px solid var(--line)">
      <label class="f">Já tenho conta: meu e-mail<input type="email" id="lg-mail" name="mail" maxlength="80" autocomplete="email" placeholder="voce@email.com"></label>
      <p class="err" id="lg-err" role="alert"></p>
      <button class="btn ghost" type="submit">Entrar</button>
    </form></section>
  <section class="card"><div class="head"><h2>Criar conta</h2></div>
    <form data-form="reg" novalidate>
      <label class="f">Nome<input type="text" id="rg-name" name="name" maxlength="60" autocomplete="name" placeholder="Seu nome completo"></label>
      <div class="two"><label class="f">E-mail<input type="email" id="rg-mail" name="mail" maxlength="80" autocomplete="email" placeholder="voce@email.com"></label>
      <label class="f">Ano de nascimento<select id="rg-birth" name="birth">${years.map(y=>`<option ${y===YEAR-16?'selected':''}>${y}</option>`).join('')}</select></label></div>
      <label class="f">Cidade<select id="rg-city" name="city">${Object.keys(CITIES).map(g=>`<optgroup label="${g}">${CITIES[g].map(c=>`<option>${c}</option>`).join('')}</optgroup>`).join('')}</select></label>
      <label class="f">Escola (opcional)<select id="rg-school" name="school"><option value="-1">Sem vínculo com escola (participante independente)</option>${REGS.map(g=>`<optgroup label="${g}">${SCH.map((x,i)=>x.reg===g?`<option value="${i}">${esc(x.n)}, ${esc(x.city)}</option>`:'').join('')}</optgroup>`).join('')}</select></label>
      <div class="two"><label class="f">Série<select id="rg-serie" name="serie" disabled><option value="1">1ª série</option><option value="2">2ª série</option><option value="3">3ª série</option></select></label>
      <label class="f">Turma<select id="rg-turma" name="turma" disabled>${'ABCD'.split('').map(t=>`<option>${t}</option>`).join('')}</select></label></div>
      <fieldset><legend>O que você quer aprender?</legend>
      <div class="row">${AREAS.map(a=>`<label class="chip chk ar-${a}"><input type="checkbox" name="int" value="${a}">${a}</label>`).join('')}</div></fieldset>
      <div class="stack" style="gap:10px">
        <label class="check" id="rg-guard-wrap"><input type="checkbox" name="guardian" id="rg-guard"><span>Meu pai, mãe ou responsável autorizou minha participação. <small>(obrigatório para menores de 18 anos)</small></span></label>
        <label class="check"><input type="checkbox" name="privacy"><span>Li e aceito a política de privacidade. Sei que apareço com nome abreviado e que empresas não recebem meus contatos.</span></label>
        <label class="check"><input type="checkbox" name="show"><span>Quero que empresas parceiras vejam meu portfólio. <small>(opcional, dá para mudar depois)</small></span></label>
      </div>
      <p class="err" id="rg-err" role="alert"></p>
      <button class="btn" type="submit">Criar conta e entrar</button>${note}
    </form></section></div>`;
  }
  if(S.role==='patro')return`<div class="grid" style="align-items:start">
  <section class="card lead"><div class="head"><h2>Entrar como empresa</h2></div>
    <label class="f">Empresa<select id="lg-sp">${S.sponsors.map(x=>`<option value="${x.id}" ${x.id===S.sp?'selected':''}>${esc(x.name)}, ${esc(x.city)}</option>`).join('')}</select></label>
    <button class="btn wide" data-act="loginSp" style="margin-top:14px">Entrar</button></section>
  <section class="card"><div class="head"><h2>Cadastrar minha empresa</h2></div>
    <form data-form="newSp" novalidate>
      <label class="f">Nome da empresa<input type="text" id="ns-name" name="name" maxlength="60" placeholder="Ex.: Casa Azul Software"></label>
      <div class="two"><label class="f">Cidade<input type="text" id="ns-city" name="city" maxlength="50" placeholder="Ex.: Chapecó"></label>
      <label class="f">Setor<select id="ns-sector" name="sector">${['Software','Indústria','Varejo','Agro','Energia','Logística','Saúde','Educação','Serviços'].map(x=>`<option>${x}</option>`).join('')}</select></label></div>
      <p class="err" id="ns-err" role="alert"></p>
      <button class="btn" type="submit">Cadastrar e entrar</button>${note}
    </form></section></div>`;
  return`<section class="card lead" style="max-width:560px"><div class="head"><h2>Acesso da equipe do programa</h2></div>
    <p class="mute" style="margin-bottom:14px">Para a equipe da NSC TV, que faz a curadoria do quadro, e da Junior Achievement SC, que valida os certificados.</p>
    <form data-form="loginProg" novalidate>
      <label class="f">Seu nome<input type="text" id="lp-name" name="name" maxlength="60" value="Equipe Tech SC"></label>
      <label class="f">Organização<select id="lp-org" name="org"><option>NSC TV</option><option>Banca técnica</option><option>Junior Achievement SC</option></select></label>
      <button class="btn" type="submit">Entrar</button>${note}
    </form></section>`;
}

/* ============ roteiro da demonstração ============ */
function demoSteps(){
  const m1=mission('m1'),mine=S.projects.find(p=>isMine(p)&&p.mission==='m1');
  const J=async()=>{S.role='jovem';if(!S.auth.jovem)await loginDemo()};
  return[
    {t:'Entre como jovem com a conta de exemplo',done:S.auth.jovem,go:J},
    {t:'Leia o QR que aparece no programa de TV',done:S.flags.scanned,async go(){await J();S.tab.jovem='inicio'}},
    {t:'Entre no desafio da Litoral Pay',done:m1.me.joined,async go(){await J();S.tab.jovem='inicio';S.sheet={type:'mission',id:'m1'}}},
    {t:'Envie seu projeto para a banca',done:m1.me.delivered,async go(){await J();S.tab.jovem='enviar';S.preMission='m1'}},
    {t:'Avalie o projeto como banca técnica (às cegas)',done:!!(mine&&mine.status!=='avaliacao'),go(){S.role='prog';S.auth.prog=true;S.tab.prog='banca'}},
    {t:'Veja o retorno no painel da empresa',done:S.flags.sponsorSeen,go(){S.role='patro';S.auth.patro=true;S.sp='litoralpay';S.tab.patro='painel'}},
    {t:'Selecione o projeto para ir ao ar',done:!!(mine&&mine.status==='aprovado'),go(){S.role='prog';S.auth.prog=true;S.tab.prog='fila'}}
  ];
}
async function loginDemo(){
  if(API.online){API.studentId='camila';await refresh();if(!S.auth.jovem)toast('A conta de exemplo não está no banco. Rode o seed.sql.','warn')}
  else{setUser(S.students.find(x=>x.id==='camila'));S.auth.jovem=true}
}
function vDemo(){
  if(!S.demoOpen)return'';
  const st=demoSteps(),cur=st.findIndex(s=>!s.done),n=st.filter(s=>s.done).length;
  return`<div class="demo"><span class="dn">Demonstração · passo ${Math.min(n+1,st.length)} de ${st.length}</span>
    <span class="dt">${cur<0?'Pronto! O projeto saiu do celular do jovem e foi parar na TV.':st[cur].t}</span>
    <span class="dots" aria-hidden="true">${st.map((s,i)=>`<i class="${s.done?'on':i===cur?'cur':''}"></i>`).join('')}</span>
    ${cur<0?'':'<button class="btn sm" data-act="demoGo">Fazer este passo</button>'}<button class="btn ghost sm" data-act="reset">Recomeçar</button><button class="btn ghost sm" data-act="demoClose" aria-label="Fechar demonstração">Fechar</button></div>`;
}

/* ============ renderização ============ */
/* chegou pelo QR da TV: abre o desafio e conta a "segunda tela" (+10 XP, uma vez) */
function consumePending(){
  const p=S.pending;S.pending=null;
  const m=mission(p.mission);S.role='jovem';S.tab.jovem='inicio';
  if(p.tv&&!S.flags.scanned){S.flags.scanned=true;addXP(10);checkBadges();quiet(sync('/api/students',{action:'scan',id:S.me.id}));toast('Você chegou pela TV: +10 XP de segunda tela!','good')}
  if(m)S.sheet={type:'mission',id:m.id};
}
function render(){
  if(S.pending&&S.auth.jovem)consumePending();
  const app=$('#app');app.dataset.role=S.role;
  const t=S.tab[S.role],authed=S.auth[S.role],nav=NAV[S.role];
  const showNav=authed&&nav.length>0;
  const navBtns=cls=>nav.map(([k,l])=>`<button data-act="tab" data-id="${k}" ${t===k?'aria-current="page"':''}>${cls?'':`<svg viewBox="0 0 24 24" aria-hidden="true">${ICON[k]}</svg>`}${l}</button>`).join('');
  $('#profiles').innerHTML=ROLES.map(([k,l])=>`<button class="role" data-act="role" data-id="${k}" aria-current="${S.role===k}"><svg viewBox="0 0 24 24" aria-hidden="true">${RI[k]}</svg>${l}</button>${S.role===k&&showNav?`<div class="sub">${navBtns(true)}</div>`:''}`).join('');
  $('#sidefoot').innerHTML=sideFoot();
  $('#demo').innerHTML=vDemo();
  const ph=pageHead();$('#phead').innerHTML=ph;$('#phead').hidden=!ph;
  $('#tabs').hidden=!showNav;$('.main').style.paddingBottom=showNav?'':'48px';
  $('#tabs').innerHTML=showNav?navBtns(false):'';
  const V={sobre:{'':vSobre},jovem:{inicio:vJovemInicio,desafios:vJovemDesafios,portfolio:vJovemPortfolio,enviar:vJovemEnviar},patro:{painel:vPatroPainel,criar:vPatroCriar,talentos:vPatroTalentos},prog:{metricas:vProgMetricas,banca:vProgBanca,fila:vProgFila,cert:vProgCert}};
  $('#view').innerHTML=authed?V[S.role][t]():vLogin();
  $('#sheetHost').innerHTML=S.sheet?vSheet():'';
  let sc=$('#scanHost');if(S.scanning){if(!sc){sc=document.createElement('div');sc.id='scanHost';sc.className='scan';sc.innerHTML='<div><div class="frame"></div><p>Lendo o QR do programa…</p></div>';document.body.appendChild(sc)}}else if(sc)sc.remove();
  S.bump=false;S.fresh={};
  animate();reveal();
}
function vSheet(){
  const sh=S.sheet;
  const close='<button class="btn ghost sm" data-act="closeSheet">Fechar</button>';
  if(sh.type==='report')return`<div class="scrim" data-act="closeSheet"></div><div class="sheet" role="dialog" aria-modal="true" aria-label="Relatório de engajamento"><div class="head"><h2>Relatório de engajamento</h2>${close}</div><pre id="repTxt">${esc(sh.text)}</pre><div class="row" style="margin-top:12px"><button class="btn" data-act="copyReport">Copiar texto</button><small>Gerado automaticamente com dados de exemplo.</small></div></div>`;
  if(sh.type==='eval'){
    const p=S.projects.find(x=>x.id===sh.id),m=mission(p.mission);
    return`<div class="scrim" data-act="closeSheet"></div><div class="sheet" role="dialog" aria-modal="true" aria-label="Avaliação do projeto"><div class="head"><div class="row">${chipArea(m.area)}</div>${close}</div>
    <h2 class="t">${esc(p.title)}</h2><p class="mute">Desafio ${esc(m.title)} · ${esc(sponsor(m.sp).name)}</p>
    <h3>Notas da banca técnica</h3>${critList(p.scores,'ev'+p.id)}
    <div class="total"><span>Nota final (média ponderada)</span><span class="num">${p.score}</span></div>
    <p class="notice" style="margin-top:14px">Avaliação feita por banca técnica independente, com critérios e pesos públicos. A empresa patrocinadora não participa da nota.</p></div>`;
  }
  const m=mission(sh.id),sp=sponsor(m.sp),t=PLAN[m.plan];
  return`<div class="scrim" data-act="closeSheet"></div><div class="sheet ar-${m.area}" role="dialog" aria-modal="true" aria-label="${esc(m.title)}">
    <div class="head"><div class="row">${chipArea(m.area)}${m.plan==='parceiro'?stChip('Com mentoria da empresa','pl-parceiro'):''}</div>${close}</div>
    <h2 class="t">${esc(m.title)}</h2><p class="mute">${esc(sp.name)}, ${esc(sp.city)} · ${esc(sp.sector)}</p>
    <p style="margin:14px 0">${esc(m.desc)}</p>
    <div class="grid2" style="margin-bottom:12px"><div class="pill"><small>Pontos</small><br><b>+${m.pts} XP</b></div><div class="pill"><small>Prazo</small><br><b>${m.days} dias</b></div></div>
    <p><b>Prêmio:</b> ${esc(m.prize)}</p>
    <div style="margin:14px 0">${bar('sh',m.joined/t.slots*100)}<small>${nf(m.joined)} de ${nf(t.slots)} vagas ocupadas</small></div>
    <h3>Como será avaliado</h3>${critList(null,'shc')}
    <p class="notice" style="margin:12px 0 16px">Banca técnica independente, mesmos critérios para todos. A empresa não dá nota.</p>
    ${m.me.delivered?`<div class="empty">Você já entregou este desafio.</div>`:m.me.joined?`<button class="btn wide" data-act="toSubmit" data-id="${m.id}">Enviar meu projeto</button>`:`<button class="btn wide" data-act="join" data-id="${m.id}">Entrar no desafio (+20 XP)</button>`}
  </div>`;
}
function animate(){
  const red=matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('[data-count]').forEach(el=>{
    const k=el.dataset.k,to=+el.dataset.count,from=prevN[k]??to;prevN[k]=to;
    const fmt=v=>el.dataset.fmt==='brl'?brl(v):nf(v);
    if(red||from===to){el.textContent=fmt(to);return}
    const t0=performance.now();(function step(t){const p=Math.min(1,(t-t0)/800),e=1-Math.pow(1-p,3);el.textContent=fmt(from+(to-from)*e);if(p<1)requestAnimationFrame(step)})(t0);
  });
  document.querySelectorAll('.bar i[data-w]').forEach(el=>{
    const k=el.dataset.k,to=el.dataset.w,from=prevW[k]??0;prevW[k]=to;
    if(red){el.style.width=to+'%';return}
    el.style.width=from+'%';void el.offsetWidth;el.style.width=to+'%';
  });
}
function toast(msg,kind=''){const d=document.createElement('div');d.className='toast '+kind;d.textContent=msg;$('#toasts').appendChild(d);setTimeout(()=>d.remove(),3300)}
function xpFloat(txt){const d=document.createElement('div');d.className='xpfloat';d.textContent=txt;document.body.appendChild(d);setTimeout(()=>d.remove(),1600)}

/* ============ eventos ============ */
document.addEventListener('click',e=>{
  const el=e.target.closest('[data-act]');if(!el)return;
  const id=el.dataset.id,act=el.dataset.act;
  switch(act){
    case'theme':{const r=document.documentElement,dark=r.dataset.theme?r.dataset.theme==='dark':matchMedia('(prefers-color-scheme: dark)').matches;r.dataset.theme=dark?'light':'dark';return}
    case'role':S.role=id;S.sheet=null;liveRefresh();break;
    case'go':S.role=el.dataset.role;S.sheet=null;break;
    case'startDemo':S.demoOpen=true;S.role='jovem';break;
    case'logout':S.auth[S.role]=false;S.sheet=null;if(S.role==='jovem'&&API.online){API.studentId='';quiet(refresh().then(render))}break;
    case'demoJovem':S.tab.jovem='inicio';run(loginDemo());return;
    case'loginSp':S.sp=$('#lg-sp').value;S.auth.patro=true;S.tab.patro='painel';break;
    case'tab':S.tab[S.role]=id;S.sheet=null;break;
    case'openMission':S.sheet={type:'mission',id};break;
    case'openEval':S.sheet={type:'eval',id};break;
    case'closeSheet':S.sheet=null;break;
    case'join':joinMission(id);break;
    case'toSubmit':S.sheet=null;S.role='jovem';S.tab.jovem='enviar';S.preMission=id;break;
    case'interest':{const a=S.me.interests,i=a.indexOf(id);i<0?a.push(id):a.splice(i,1);quiet(sync('/api/students',{action:'update',id:S.me.id,interests:a}));break}
    case'togglePortfolio':S.me.showPortfolio=!S.me.showPortfolio;quiet(sync('/api/students',{action:'update',id:S.me.id,showPortfolio:S.me.showPortfolio}));toast(S.me.showPortfolio?'Portfólio visível para empresas parceiras.':'Portfólio privado. Empresas não podem convidar você.');break;
    case'rankTab':S.rankTab=id;break;
    case'fArea':S.filter.area=id;break;
    case'scan':S.scanning=true;render();setTimeout(()=>{S.scanning=false;if(!S.flags.scanned){S.flags.scanned=true;addXP(10);checkBadges();quiet(sync('/api/students',{action:'scan',id:S.me.id}))}S.sheet={type:'mission',id:'m1'};render()},1500);return;
    case'fillExample':{const m=mission($('#pj-mission').value);$('#pj-title').value=m.id==='m1'?'Troco+ Solidário':'Projeto '+m.title;$('#pj-desc').value='Protótipo em 3 telas que resolve o desafio proposto. Usei HTML, CSS e JavaScript e testei com 5 colegas da turma.';$('#pj-link').value='https://exemplo.dev/tech-sc/'+m.id;return}
    case'fillMission':{$('#ms-name').value='App de rotas do ônibus';$('#ms-ch').value='Nossos clientes perdem tempo esperando no ponto. Crie um app que mostre o horário do próximo ônibus em um ponto da Grande Florianópolis.';$('#ms-prize').value='Bolsa de R$ 800 + mentoria + entrevista para estágio';return}
    case'sponsor':sponsorProject(id);break;
    case'invite':invite(id);break;
    case'report':S.sheet={type:'report',text:report(S.sp)};break;
    case'copyReport':{const t=$('#repTxt');const fb=()=>{const r=document.createRange();r.selectNodeContents(t);const s=getSelection();s.removeAllRanges();s.addRange(r);toast('Texto selecionado. Copie com Ctrl+C.')};try{navigator.clipboard.writeText(t.textContent).then(()=>toast('Relatório copiado.','good'),fb)}catch(_){fb()}return}
    case'approve':approve(id,true);break;
    case'refuse':approve(id,false);break;
    case'vcert':validateCert(id,true);break;
    case'rcert':validateCert(id,false);break;
    case'demoGo':{const c=demoSteps().find(s=>!s.done);if(c){run(Promise.resolve(c.go()));window.scrollTo({top:0})}return}
    case'demoOpen':S.demoOpen=true;break;
    case'demoClose':S.demoOpen=false;break;
    case'reset':{
      if(API.online){S.role='jovem';run(refresh().then(()=>toast('Dados recarregados do banco. Para zerar tudo, rode o seed.sql de novo.')));return}
      const o=S.demoOpen;init();S.demoOpen=o;S.role='jovem';prevN={};prevW={};toast('Demonstração reiniciada.');break}
  }
  render();
  if(['role','go','startDemo','tab','toSubmit','demoGo','demoJovem','loginSp','logout','reset'].includes(act))window.scrollTo({top:0});
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&S.sheet){S.sheet=null;render()}});
document.addEventListener('input',e=>{
  const f=e.target.closest('form[data-form=grade]');if(!f||e.target.type!=='range')return;
  const sc={};CRIT.forEach(([k])=>{sc[k]=+f.elements[k].value});
  f.querySelector(`[data-out="${e.target.name}"]`).textContent=e.target.value;
  f.querySelector('.gt').textContent=total(sc);
});
document.addEventListener('change',e=>{
  if(e.target.id==='rg-school'){
    const i=+e.target.value,has=i>=0;
    $('#rg-serie').disabled=!has;$('#rg-turma').disabled=!has;$('#rg-city').disabled=has;
    if(has)$('#rg-city').value=SCH[i].city;
    return;
  }
  const f=e.target.dataset&&e.target.dataset.filter;if(!f)return;
  if(f==='sp')S.filter.sp=e.target.value;
  render();
});
document.addEventListener('submit',e=>{
  e.preventDefault();
  const form=e.target;if(form.dataset.busy)return;
  form.dataset.busy='1';const btn=form.querySelector('[type=submit]');if(btn)btn.disabled=true;
  submitForm(form).then(ok=>{if(ok!==false){render();window.scrollTo({top:0})}})
    .catch(err=>{const box=form.querySelector('.err');if(box)box.textContent=err.message;else toast(err.message,'warn')})
    .finally(()=>{delete form.dataset.busy;if(btn&&btn.isConnected)btn.disabled=false});
});
async function submitForm(form){
  const k=form.dataset.form,fdo=new FormData(form),fd=Object.fromEntries(fdo);
  const stop=(id,msg)=>{$(id).textContent=msg;return false};
  if(k==='reg'){
    const ints=fdo.getAll('int'),age=YEAR-(+fd.birth);
    if(!fd.name.trim())return stop('#rg-err','Informe seu nome.');
    if(!/^\S+@\S+\.\S+$/.test(fd.mail.trim()))return stop('#rg-err','Informe um e-mail válido, como voce@email.com.');
    if(age<18&&!fd.guardian)return stop('#rg-err','Para menores de 18 anos, marque que o responsável autorizou a participação.');
    if(!fd.privacy)return stop('#rg-err','Para criar a conta, aceite a política de privacidade.');
    const idx=+fd.school,has=idx>=0,school=has?idx:null,serie=has?+fd.serie:null,turma=has?fd.turma:null,city=has?SCH[idx].city:fd.city;
    const first=fd.name.trim().split(' ')[0];
    if(API.online){
      const r=await API.post('/api/students',{action:'register',name:fd.name,email:fd.mail,birth:+fd.birth,guardian:!!fd.guardian,privacy:!!fd.privacy,show:!!fd.show,school,serie,turma,city,interests:ints});
      API.studentId=r.id;await refresh();
    }else{
      if(S.students.some(x=>x.email&&x.email.toLowerCase()===fd.mail.trim().toLowerCase()))return stop('#rg-err','Este e-mail já tem conta. Use “Já tenho conta”.');
      const u={id:'u'+(S.uid++),name:fd.name.trim(),email:fd.mail.trim(),birth:+fd.birth,guardian:!!fd.guardian,showPortfolio:!!fd.show,school,serie,turma,city,classId:has?`${school}-${serie}-${turma}`:null,pts:0,interests:ints,skills:{App:0,IA:0,Games:0,Dados:0,Design:0,IoT:0},part:{}};
      S.students.push(u);S.registered++;if(!has)S.indep++;setUser(u);S.auth.jovem=true;
      addFeed(`${pub(u.name)} criou conta em ${city}${has?'':' (independente)'}.`,'*');
    }
    S.tab.jovem='inicio';toast('Conta criada. Boas-vindas, '+first+'!','good');
  }
  if(k==='login'){
    const mail=fd.mail.trim().toLowerCase();
    if(!mail)return stop('#lg-err','Informe seu e-mail.');
    if(API.online){const r=await API.post('/api/students',{action:'login',email:mail});API.studentId=r.id;await refresh()}
    else{const u=S.students.find(x=>x.email&&x.email.toLowerCase()===mail);if(!u)return stop('#lg-err','Não encontramos uma conta com este e-mail.');setUser(u);S.auth.jovem=true}
    S.tab.jovem='inicio';toast('Boas-vindas de volta, '+S.me.name.split(' ')[0]+'!','good');
  }
  if(k==='newSp'){
    if(!fd.name.trim()||!fd.city.trim())return stop('#ns-err','Informe o nome e a cidade da empresa.');
    if(API.online){const r=await API.post('/api/sponsors',{action:'create',name:fd.name,city:fd.city,sector:fd.sector});await refresh();S.sp=r.id}
    else{const sp={id:'s'+(S.sid++),name:fd.name.trim(),city:fd.city.trim(),sector:fd.sector};S.sponsors.push(sp);S.sp=sp.id;addFeed(`${sp.name} (${sp.city}) entrou na plataforma.`,'*')}
    S.auth.patro=true;S.tab.patro='criar';toast('Empresa cadastrada. Lance seu primeiro desafio.','good');
  }
  if(k==='grade'){
    const sc={};CRIT.forEach(([c])=>{sc[c]=+fd[c]});
    await gradeProject(form.dataset.id,sc);
  }
  if(k==='loginProg'){S.staff={name:fd.name.trim()||'Equipe Tech SC',org:fd.org};S.auth.prog=true;S.tab.prog={'NSC TV':'fila','Banca técnica':'banca'}[fd.org]||'cert'}
  if(k==='project'){
    const file=form.querySelector('#pj-file').files[0];
    if(!fd.title.trim()||!fd.desc.trim())return stop('#pj-err','Preencha o título e a descrição.');
    if(!fd.link.trim()&&!file)return stop('#pj-err','Informe um link ou anexe um arquivo.');
    await submitProject({mission:fd.mission,title:fd.title.trim(),desc:fd.desc.trim(),link:fd.link.trim(),file:file?file.name:''});
    S.preMission=null;S.tab.jovem='portfolio';
  }
  if(k==='mission'){
    if(!fd.name.trim()||!fd.challenge.trim()||!fd.prize.trim())return stop('#ms-err','Preencha nome, problema e prêmio.');
    await createMission({name:fd.name.trim(),challenge:fd.challenge.trim(),prize:fd.prize.trim(),area:fd.area,plan:fd.plan});
    S.tab.patro='painel';
  }
}
/* atualização automática: a cada 8 s, nas telas que só mostram dados */
const LIVE_TABS={jovem:['inicio','desafios','portfolio'],patro:['painel','talentos'],prog:['metricas','fila','cert']};
const canLive=()=>API.online&&!document.hidden&&S&&!S.sheet&&!S.scanning&&S.auth[S.role]&&(LIVE_TABS[S.role]||[]).includes(S.tab[S.role])&&!document.querySelector('#view form');
/* busca novidades e só redesenha se ainda for seguro (ninguém preenchendo nada) */
function liveRefresh(){
  if(!canLive())return;
  refresh().then(()=>{if(canLive()||!document.querySelector('#view form'))render()}).catch(()=>{});
}
setInterval(liveRefresh,8000);

/* executa uma ação assíncrona e redesenha a tela no fim */
function run(promise){
  promise.then(render).catch(e=>{toast(e.message||'Algo deu errado.','warn');render()});
}

/* ============ início ============ */
if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&'IntersectionObserver' in window)document.documentElement.classList.add('js');
(async()=>{
  const qs=new URLSearchParams(location.search),deep=qs.get('desafio');
  if(deep){history.replaceState(null,'',location.pathname)}
  if(await API.check()){
    try{await refresh()}
    catch(e){API.online=false;toast('Não foi possível carregar o banco. Usando o modo demonstração.','warn')}
  }
  if(!S)init();
  if(deep){S.pending={mission:deep,tv:qs.has('tv')};S.role='jovem'}
  render();
})();
