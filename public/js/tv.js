/* Telão: busca /api/live a cada 4 segundos e anima o que mudou. */
(function () {
  const $id = id => document.getElementById(id);
  const params = new URLSearchParams(location.search);
  const want = params.get('desafio') || FEATURED;
  let last = null, seenFeed = new Set(), airedIdx = 0, qrFor = '';

  function clock() { $id('clock').textContent = new Date().toTimeString().slice(0, 5); }

  function count(el, to) {
    const from = Number(el.dataset.v || 0);
    el.dataset.v = to;
    if (from === to) { el.textContent = nf(to); return; }
    if (last) { el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); }
    const t0 = performance.now();
    (function step(t) {
      const p = Math.min(1, (t - t0) / 900), e = 1 - Math.pow(1 - p, 3);
      el.textContent = nf(from + (to - from) * e);
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  }

  function pop(msg) {
    const d = document.createElement('div');
    d.textContent = msg;
    $id('pop').appendChild(d);
    setTimeout(() => d.remove(), 4800);
  }

  function draw(d) {
    const f = d.featured;
    if (f) {
      $id('kicker').textContent = `Desafio da semana · ${f.sponsor}`;
      $id('title').textContent = f.title;
      $id('prize').innerHTML = `<b>Prêmio:</b> ${esc(f.prize)} · <b>+${f.pts} XP</b> por entrega`;
      count($id('cJoined'), f.joined);
      count($id('cDelivered'), f.delivered);
      if (qrFor !== f.id) {
        qrFor = f.id;
        const url = deepLink(f.id);
        $id('qr').innerHTML = qrSvg(url, 'QR code do desafio da semana');
        $id('qrUrl').textContent = url.replace(/^https?:\/\//, '');
      }
    }
    count($id('cAired'), d.totals.aired);

    // ranking: destaca quem subiu de pontos
    const before = last ? Object.fromEntries(last.top.map(s => [s.id, s.pts])) : {};
    $id('rank').innerHTML = d.top.map((s, i) => {
      const up = last && (before[s.id] === undefined || before[s.id] < s.pts);
      return `<li class="${up ? 'up' : ''}"><span class="p">${i + 1}º</span><span>${esc(s.name)}<small>${esc(s.city)}</small></span><b>${nf(s.pts)}</b></li>`;
    }).join('');

    // letreiro com a atividade
    const row = d.feed.map(e => `<span>${esc(e.msg)}</span>`).join('');
    $id('ticker').innerHTML = row + row.replace(/<span>/g, '<span aria-hidden="true">');

    // avisos grandes para o que acabou de acontecer
    const fresh = d.feed.filter(e => !seenFeed.has(e.id)).reverse();
    if (last) fresh.slice(-3).forEach((e, i) => setTimeout(() => pop(e.msg), i * 1500));
    d.feed.forEach(e => seenFeed.add(e.id));

    drawOnAir(d.aired);
    last = d;
  }

  function drawOnAir(list) {
    const box = $id('onair');
    if (!list.length) { box.hidden = true; return; }
    const p = list[airedIdx % list.length];
    box.hidden = false;
    box.innerHTML = `<span class="tag">NO AR</span><span><b>${esc(p.title)}</b><small>${esc(p.owner)} · ${esc(p.city)} · desafio ${esc(p.mission)} (${esc(p.sponsor)})</small></span><span class="sc">${p.score ?? ''}</span>`;
    box.style.animation = 'none'; void box.offsetWidth; box.style.animation = '';
  }

  async function tick() {
    try {
      draw(await API.get('/api/live?desafio=' + encodeURIComponent(want)));
      $id('offline').hidden = true;
    } catch (_) {
      if (!last) $id('offline').hidden = false;
    }
  }

  async function start() {
    clock(); setInterval(clock, 10000);
    // QR aparece mesmo antes dos dados chegarem
    $id('qr').innerHTML = qrSvg(deepLink(want), 'QR code do desafio da semana');
    $id('qrUrl').textContent = deepLink(want).replace(/^https?:\/\//, '');
    if (!(await API.check())) { $id('offline').hidden = false; $id('title').textContent = 'Tech SC Jovem'; return; }
    await tick();
    setInterval(tick, 4000);
    setInterval(() => { if (last) { airedIdx++; drawOnAir(last.aired); } }, 7000);
  }

  const full = () => (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen()).catch(() => {});
  $id('fs').addEventListener('click', full);
  document.addEventListener('keydown', e => { if (e.key === 'f' || e.key === 'F') full(); });
  start();
})();
