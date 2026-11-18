# Tech SC Hub

Plataforma gamificada da equipe **Tech Conecta**: empresas catarinenses lançam desafios reais, jovens resolvem, pontuam e montam um portfólio, e os melhores projetos vão ao ar no quadro **Tech SC Jovem**, na NSC TV.

Site estático + API serverless na **Vercel** + banco **PostgreSQL** no **Neon**.

## Estrutura dos arquivos

```
tech-sc-hub/
├── public/                 → o site (o que o navegador baixa)
│   ├── index.html          → o site (perfis Jovem, Empresa e Programa)
│   ├── tv.html             → o telão ao vivo para projetar (/tv)
│   ├── favicon.svg
│   ├── og.png              → imagem que aparece ao compartilhar o link
│   ├── css/
│   │   ├── styles.css      → visual do site (cores, layout, modo escuro)
│   │   └── tv.css          → visual do telão
│   └── js/
│       ├── vendor/qrcode.js→ gerador de QR code (biblioteca MIT, Kazuhiko Arase)
│       ├── config.js       → dados fixos, regras e o QR do desafio da semana
│       ├── api.js          → conversa com o servidor (/api)
│       ├── app.js          → telas, ações e demonstração guiada
│       └── tv.js           → atualiza o telão a cada 4 segundos
├── api/                    → funções serverless (cada arquivo vira uma rota)
│   ├── health.js           → GET  /api/health       o banco está no ar?
│   ├── bootstrap.js        → GET  /api/bootstrap    carrega tudo para as telas
│   ├── live.js             → GET  /api/live         dados leves para o telão
│   ├── students.js         → POST /api/students     cadastro, login, preferências, QR
│   ├── sponsors.js         → POST /api/sponsors     cadastro de empresa
│   ├── missions.js         → POST /api/missions     criar desafio, entrar no desafio
│   ├── projects.js         → POST /api/projects     entregar, notas da banca, ir ao ar, apadrinhar, convidar
│   ├── certificates.js     → POST /api/certificates validar certificado
│   └── _lib/               → código comum (o "_" impede que vire rota)
│       ├── db.js           → conexão com o Neon
│       ├── http.js         → respostas, erros e validação
│       └── rules.js        → pontos, planos, notas da banca
├── db/
│   ├── schema.sql          → cria as tabelas (apaga as antigas!)
│   └── seed.sql            → dados de exemplo (541 jovens, 7 empresas, 7 desafios)
├── scripts/setup-db.mjs    → roda schema + seed pelo terminal (opcional)
├── package.json
├── vercel.json             → diz à Vercel que o site está em /public
├── .env.example            → modelo da variável DATABASE_URL
└── .gitignore
```

## Banco de dados

| Tabela           | O que guarda |
|------------------|--------------|
| `schools`        | escolas parceiras e região de SC |
| `students`       | jovens, pontos, interesses, habilidades, autorização do responsável |
| `sponsors`       | empresas |
| `missions`       | desafios, plano (Apoiador, Patrocinador, Parceiro Estratégico), vagas e entregas |
| `participations` | quem entrou em qual desafio e se já entregou |
| `projects`       | entregas com as notas da banca por critério, status do quadro na TV e padrinho |
| `certificates`   | certificados e a validação da JA SC |
| `invites`        | convites das empresas para conversar com um jovem |
| `feed`           | atividade da plataforma |

Os pontos são calculados **no servidor** (entrar no desafio +20, chegar pelo QR da TV +10, entregar +200/300/450 conforme o plano, ir ao ar +100), para ninguém conseguir inventar pontuação pelo navegador.

## Como o projeto anda

1. **Jovem entrega** → status *avaliacao* (“Aguardando a banca técnica”).
2. **Banca técnica avalia às cegas** (Programa → Avaliar): vê o projeto e o desafio, mas não o nome, a escola nem a cidade. Dá uma nota de 0 a 100 em cada critério; o servidor calcula a média ponderada → status *pendente* (fila do quadro).
3. **Equipe da NSC TV escolhe** quem vai ao ar (Programa → Quadro na TV) → *aprovado* ou *recusado*.
4. Só depois da nota a empresa pode apadrinhar o projeto.

O jovem recebe os avisos (“A banca avaliou…”, “Seu projeto vai ao ar!”) sem precisar recarregar: as telas sem formulário se atualizam a cada 8 segundos.

## QR code e telão

- O QR do site e do telão é **de verdade**: abre `/?desafio=m1&tv=1`. Quem escaneia cai direto no desafio da semana (se não tiver conta, cria na hora) e ganha +10 XP de “segunda tela”.
- O QR usa o endereço em que a página foi aberta. Por isso, **abra o telão pelo link publicado** na Vercel, não pelo arquivo do computador.
- O **telão** fica em `/tv` (ou no botão *Abrir telão* do perfil Programa). Mostra o desafio da semana, o QR grande, contadores, ranking ao vivo, o projeto no ar e um letreiro com a atividade. Tecla **F** para tela cheia.
- Para trocar o desafio da semana, mude `FEATURED` em `public/js/config.js` (ou abra `/tv?desafio=m2`).

## Publicar na Vercel (passo a passo)

1. **Suba a pasta para o GitHub.** Crie um repositório novo e envie todo o conteúdo da pasta `tech-sc-hub` (no site do GitHub dá para arrastar os arquivos em *Add file → Upload files*).
2. **Importe na Vercel.** Em [vercel.com/new](https://vercel.com/new), escolha o repositório. Em *Framework Preset* deixe **Other** e clique em **Deploy**. O site já abre, em modo demonstração.
3. **Crie o banco.** No projeto, vá em **Storage → Create Database → Neon** (Serverless Postgres), plano gratuito, e conecte ao projeto. A Vercel cria sozinha a variável `DATABASE_URL`.
4. **Crie as tabelas e os dados.** Abra o banco no painel do Neon (botão *Open in Neon*), vá em **SQL Editor**, cole todo o `db/schema.sql` e clique em *Run*. Depois cole o `db/seed.sql` e *Run* de novo.
5. **Publique de novo.** Em **Deployments**, nos três pontinhos do último deploy, clique em **Redeploy**.

Pronto: no canto inferior da barra lateral aparece **“Banco de dados conectado”**. Cadastros, entregas, notas e aprovações passam a ficar salvos para todo mundo que acessar o link.

> **Antes de apresentar:** rode o `schema.sql` e o `seed.sql` de novo no SQL Editor. Isso apaga os testes e volta tudo ao início, inclusive a conta da Camila usada na demonstração guiada.

> **Prévia no WhatsApp:** depois de publicar, troque em `public/index.html` o `content="/og.png"` pelo endereço completo (por exemplo `https://seu-site.vercel.app/og.png`). Alguns aplicativos só mostram a imagem com o endereço completo.

## Roteiro sugerido para a apresentação

1. Projete o **telão** (`/tv`, tela cheia) e peça para a banca apontar o celular para o QR.
2. Quem escanear cria a conta, entra no desafio e envia um projeto: o telão mostra cada ação na hora, com aviso grande e ranking mudando.
3. No seu computador, entre em **Programa → Banca técnica**, avalie um projeto às cegas e depois, em **Quadro na TV**, selecione para ir ao ar. O telão mostra “NO AR” e o celular de quem enviou recebe o aviso e os confetes.
4. Mostre o **Painel de impacto** da empresa e o relatório de engajamento.

Se a internet falhar, a **demonstração guiada** (7 passos) funciona até sem banco.

## Rodar no computador (opcional)

- **Só ver o site:** dê dois cliques em `public/index.html`. Funciona em modo demonstração, sem banco.
- **Com o banco:** instale o [Node.js](https://nodejs.org) 20 ou mais novo, copie `.env.example` para `.env`, cole a `DATABASE_URL` (Vercel → Settings → Environment Variables) e rode:

```bash
npm install
npm run db:setup     # cria tabelas e dados (apaga o que existir)
npx vercel dev       # abre em http://localhost:3000
```

## Importante: isto ainda é um protótipo

- **Não há login com senha.** O jovem entra pelo e-mail e o navegador guarda só o identificador. Antes de usar com jovens de verdade, é preciso autenticação (por exemplo, link mágico por e-mail) e controle de quem pode acessar as telas de Empresa e Programa.
- **LGPD e menores de idade.** O site já pede autorização do responsável, mostra nomes abreviados e não envia e-mail/telefone para empresas. Num lançamento real, é preciso também política de privacidade escrita, registro do consentimento do responsável e canal para excluir dados.
- **Arquivos anexados** não são enviados ao servidor; só o link do projeto é salvo.
- **Todos os nomes, empresas, escolas e valores são fictícios.**
