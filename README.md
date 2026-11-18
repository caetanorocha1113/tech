# Tech SC Hub

Plataforma gamificada da equipe **Tech Conecta**: empresas catarinenses lançam desafios reais, jovens resolvem, pontuam e montam um portfólio, e os melhores projetos vão ao ar no quadro **Tech SC Jovem**, na NSC TV.

Site estático + API serverless na **Vercel** + banco **PostgreSQL** no **Neon**.

## Estrutura dos arquivos

```
tech-sc-hub/
├── public/                 → o site (o que o navegador baixa)
│   ├── index.html          → página única
│   ├── favicon.svg
│   ├── css/styles.css      → todo o visual (cores, layout, modo escuro)
│   └── js/
│       ├── config.js       → dados fixos e regras (escolas, planos, critérios, níveis)
│       ├── api.js          → conversa com o servidor (/api)
│       └── app.js          → telas, ações e demonstração guiada
├── api/                    → funções serverless (cada arquivo vira uma rota)
│   ├── health.js           → GET  /api/health       o banco está no ar?
│   ├── bootstrap.js        → GET  /api/bootstrap    carrega tudo para as telas
│   ├── students.js         → POST /api/students     cadastro, login, preferências, QR
│   ├── sponsors.js         → POST /api/sponsors     cadastro de empresa
│   ├── missions.js         → POST /api/missions     criar desafio, entrar no desafio
│   ├── projects.js         → POST /api/projects     entregar, avaliar, apadrinhar, convidar
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

Os pontos são calculados **no servidor** (entrar no desafio +20, ler o QR +10, entregar +200/300/450 conforme o plano, ir ao ar +100) e a nota da banca também, para ninguém conseguir inventar pontuação pelo navegador.

## Publicar na Vercel (passo a passo)

1. **Suba a pasta para o GitHub.** Crie um repositório novo e envie todo o conteúdo da pasta `tech-sc-hub` (no site do GitHub dá para arrastar os arquivos em *Add file → Upload files*).
2. **Importe na Vercel.** Em [vercel.com/new](https://vercel.com/new), escolha o repositório. Em *Framework Preset* deixe **Other** e clique em **Deploy**. O site já abre, em modo demonstração.
3. **Crie o banco.** No projeto, vá em **Storage → Create Database → Neon** (Serverless Postgres), plano gratuito, e conecte ao projeto. A Vercel cria sozinha a variável `DATABASE_URL`.
4. **Crie as tabelas e os dados.** Abra o banco no painel do Neon (botão *Open in Neon*), vá em **SQL Editor**, cole todo o `db/schema.sql` e clique em *Run*. Depois cole o `db/seed.sql` e *Run* de novo.
5. **Publique de novo.** Em **Deployments**, nos três pontinhos do último deploy, clique em **Redeploy**.

Pronto: no canto inferior da barra lateral aparece **“Banco de dados conectado”**. Cadastros, entregas, notas e aprovações passam a ficar salvos para todo mundo que acessar o link.

> **Antes de apresentar:** rode o `schema.sql` e o `seed.sql` de novo no SQL Editor. Isso apaga os testes e volta tudo ao início, inclusive a conta da Camila usada na demonstração guiada.

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
