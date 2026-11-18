// GET /api/bootstrap?student=<id>
// Devolve tudo o que o site precisa para montar as telas.
// Por privacidade, os outros jovens vêm só com nome abreviado e sem e-mail.
import { getSql } from './_lib/db.js';
import { route } from './_lib/http.js';
import { pub } from './_lib/rules.js';

export default route(['GET'], async req => {
  const sql = getSql();
  const studentId = typeof req.query.student === 'string' ? req.query.student.slice(0, 64) : '';

  const [students, me, part, sponsors, missions, projects, certs, feed, invites, regionRows, counts] = await Promise.all([
    sql`select id, name, school_id, serie, turma, city, region, points from students`,
    studentId ? sql`select * from students where id = ${studentId}` : [],
    studentId ? sql`select mission_id, status from participations where student_id = ${studentId}` : [],
    sql`select id, name, city, sector from sponsors order by created_at, id`,
    sql`select * from missions order by created_at desc, id`,
    sql`select * from projects order by created_at desc`,
    sql`select * from certificates order by created_at desc`,
    sql`select sponsor_scope, message, created_at from feed order by id desc limit 30`,
    sql`select sponsor_id, project_id from invites`,
    sql`select s.region, count(*)::int as n from participations p join students s on s.id = p.student_id
        where not s.seeded group by s.region`,
    sql`select count(*) filter (where not seeded)::int as registered,
               count(*) filter (where not seeded and school_id is null)::int as indep
        from students`
  ]);

  const meRow = me[0] || null;
  const classId = s => (s.school_id == null ? null : `${s.school_id}-${s.serie}-${s.turma}`);

  const regionJoin = Object.fromEntries(regionRows.map(r => [r.region, r.n]));
  const realJoins = regionRows.reduce((a, r) => a + r.n, 0);
  const inv = {};
  for (const r of invites) (inv[r.sponsor_id] ||= []).push(r.project_id);

  return {
    students: students.map(s => ({
      id: s.id, name: meRow && s.id === meRow.id ? s.name : pub(s.name),
      school: s.school_id, serie: s.serie, turma: s.turma, classId: classId(s), city: s.city, pts: s.points
    })),
    me: meRow && {
      id: meRow.id, name: meRow.name, email: meRow.email, birth: meRow.birth_year, guardian: meRow.guardian_ok,
      showPortfolio: meRow.show_portfolio, school: meRow.school_id, serie: meRow.serie, turma: meRow.turma,
      classId: classId(meRow), city: meRow.city, pts: meRow.points, interests: meRow.interests,
      skills: { App: 0, IA: 0, Games: 0, Dados: 0, Design: 0, IoT: 0, ...meRow.skills }, scanned: meRow.scanned_qr,
      part: Object.fromEntries(part.map(p => [p.mission_id, { joined: true, delivered: p.status === 'delivered' }]))
    },
    sponsors,
    missions: missions.map(m => ({
      id: m.id, sp: m.sponsor_id, title: m.title, area: m.area, plan: m.plan, pts: m.points, prize: m.prize,
      desc: m.description, joined: m.joined_count, delivered: m.delivered_count, days: m.days_left
    })),
    projects: projects.map(p => {
      const mine = meRow && p.student_id === meRow.id;
      return {
        id: p.id, title: p.title, desc: p.description, owner: mine ? p.owner_name : pub(p.owner_name),
        school: p.school_id, city: p.city, mission: p.mission_id, status: p.status, sp: p.sponsor_id,
        scores: p.scores, score: p.score, ownerId: p.student_id || 'seed', link: p.link || ''
      };
    }),
    certs: certs.map(c => ({
      id: c.id, owner: meRow && c.student_id === meRow.id ? c.owner_name : pub(c.owner_name),
      school: c.school_id, city: c.city, title: c.title, area: c.area, status: c.status, ownerId: c.student_id || 'seed'
    })),
    feed: feed.map(f => ({ t: f.created_at, msg: f.message, sp: f.sponsor_scope })),
    invites: inv,
    counts: {
      registered: counts[0].registered, indep: counts[0].indep, regionJoin,
      baseJoined: missions.reduce((a, m) => a + m.joined_count, 0) - realJoins
    }
  };
});
