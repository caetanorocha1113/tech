-- Tech SC Hub · estrutura do banco de dados (PostgreSQL / Neon)
-- ATENÇÃO: rodar este arquivo apaga as tabelas existentes e cria tudo de novo.

drop table if exists feed, invites, certificates, projects, participations, missions, students, sponsors, schools cascade;

-- Escolas parceiras (o id é a posição da escola na lista do site)
create table schools (
  id      int primary key,
  name    text not null,
  city    text not null,
  region  text not null
);

-- Empresas patrocinadoras
create table sponsors (
  id          text primary key,
  name        text not null,
  city        text not null,
  sector      text not null,
  created_at  timestamptz not null default now()
);

-- Jovens participantes
create table students (
  id              text primary key,
  name            text not null,
  email           text unique,
  birth_year      int,
  guardian_ok     boolean not null default false,  -- autorização do responsável (menores de 18)
  show_portfolio  boolean not null default false,  -- portfólio visível para empresas
  school_id       int references schools(id),      -- vazio = participante independente
  serie           int,
  turma           text,
  city            text not null,
  region          text not null,
  points          int not null default 0,
  interests       text[] not null default '{}',
  skills          jsonb not null default '{}',
  scanned_qr      boolean not null default false,
  seeded          boolean not null default false,  -- true = aluno fictício dos dados de exemplo
  created_at      timestamptz not null default now()
);
create index students_points_idx on students (points desc);
create unique index students_email_lower_idx on students (lower(email));

-- Desafios lançados pelas empresas
create table missions (
  id               text primary key,
  sponsor_id       text not null references sponsors(id),
  title            text not null,
  area             text not null check (area in ('App','IA','Games','Dados','Design','IoT')),
  plan             text not null check (plan in ('apoiador','patrocinador','parceiro')),
  points           int not null,
  prize            text not null,
  description      text not null,
  joined_count     int not null default 0,
  delivered_count  int not null default 0,
  days_left        int not null default 30,
  created_at       timestamptz not null default now()
);

-- Quem entrou em qual desafio
create table participations (
  student_id  text not null references students(id) on delete cascade,
  mission_id  text not null references missions(id) on delete cascade,
  status      text not null default 'joined' check (status in ('joined','delivered')),
  created_at  timestamptz not null default now(),
  primary key (student_id, mission_id)
);

-- Projetos entregues (com as notas da banca técnica)
create table projects (
  id           text primary key,
  student_id   text references students(id) on delete set null,
  owner_name   text not null,
  school_id    int references schools(id),
  city         text,
  mission_id   text not null references missions(id) on delete cascade,
  title        text not null,
  description  text not null,
  link         text,
  -- avaliacao = esperando a banca · pendente = na fila do quadro · aprovado = no ar · recusado
  status       text not null default 'avaliacao' check (status in ('avaliacao','pendente','aprovado','recusado')),
  sponsor_id   text references sponsors(id),       -- empresa que apadrinhou
  scores       jsonb,                              -- notas da banca por critério (vazio até avaliar)
  score        int,                                -- média ponderada
  graded_at    timestamptz,
  created_at   timestamptz not null default now()
);

-- Certificados validados pela Junior Achievement SC
create table certificates (
  id          text primary key,
  student_id  text references students(id) on delete set null,
  owner_name  text not null,
  school_id   int references schools(id),
  city        text,
  title       text not null,
  area        text not null,
  status      text not null default 'pendente' check (status in ('pendente','validado','recusado')),
  created_at  timestamptz not null default now()
);

-- Convites das empresas para conversar com um jovem
create table invites (
  sponsor_id  text not null references sponsors(id) on delete cascade,
  project_id  text not null references projects(id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (sponsor_id, project_id)
);

-- Atividade da plataforma ('*' = visível para todos; senão, id da empresa)
create table feed (
  id             bigserial primary key,
  sponsor_scope  text not null default '*',
  message        text not null,
  created_at     timestamptz not null default now()
);
