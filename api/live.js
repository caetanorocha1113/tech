// GET /api/live — dados leves para o telão (/tv), que pergunta a cada poucos segundos.
// Só nomes abreviados: o telão é público.
import { getSql } from './_lib/db.js';
import { route } from './_lib/http.js';
import { pub } from './_lib/rules.js';

export default route(['GET'], async req => {
  const sql = getSql();
  const want = typeof req.query.desafio === 'string' ? req.query.desafio.slice(0, 64) : 'm1';

  const [featured, totals, top, feed, aired, grading] = await Promise.all([
    sql`select m.id, m.title, m.area, m.points, m.prize, m.joined_count, m.delivered_count, m.days_left,
               s.name as sponsor, s.city as sponsor_city
        from missions m join sponsors s on s.id = m.sponsor_id
        order by (m.id = ${want}) desc, m.created_at desc limit 1`,
    sql`select (select coalesce(sum(joined_count), 0)::int from missions) as joined,
               (select coalesce(sum(delivered_count), 0)::int from missions) as delivered,
               (select count(*)::int from projects where status = 'aprovado') as aired,
               (select count(*)::int from missions) as missions`,
    sql`select id, name, city, points from students order by points desc, created_at limit 8`,
    sql`select id, message, created_at from feed order by id desc limit 15`,
    sql`select p.title, p.owner_name, p.city, p.score, m.title as mission, s.name as sponsor
        from projects p join missions m on m.id = p.mission_id join sponsors s on s.id = m.sponsor_id
        where p.status = 'aprovado' order by p.graded_at desc nulls last, p.created_at desc limit 5`,
    sql`select count(*)::int as n from projects where status = 'avaliacao'`
  ]);

  const f = featured[0];
  return {
    now: new Date().toISOString(),
    featured: f && {
      id: f.id, title: f.title, area: f.area, pts: f.points, prize: f.prize, joined: f.joined_count,
      delivered: f.delivered_count, days: f.days_left, sponsor: f.sponsor, sponsorCity: f.sponsor_city
    },
    totals: { ...totals[0], grading: grading[0].n },
    top: top.map(s => ({ id: s.id, name: pub(s.name), city: s.city, pts: s.points })),
    feed: feed.map(e => ({ id: Number(e.id), msg: e.message, t: e.created_at })),
    aired: aired.map(p => ({ title: p.title, owner: pub(p.owner_name), city: p.city, score: p.score, mission: p.mission, sponsor: p.sponsor }))
  };
});
