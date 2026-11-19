/* =====================================================================
   app.js  —  BEHAVIOUR ONLY.   Sections:
   1 DATA   2 STATE   3 PORTRAITS   4 BACKGROUNDS   5 PAGES
   6 SCENE PLAYER   7 ROUTER   8 SCROLL ANIMATION  (edit reveal() to change it)
   Load order in index.html:  data.js -> characters.js -> app.js
   ===================================================================== */

/* ---------- 1. DATA ---------- */
const { SEASONS, C, OUT, SC, HERO_BG } = window.SUITS_DATA;
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const go = h => (location.hash = h);

/* "Enter the firm": smooth-scroll to the character cards.
   Click delegation, so it keeps working even if something below fails. */
document.addEventListener('click', e => {
  if (!e.target.closest('#enterBtn')) return;
  e.preventDefault();
  const target = document.getElementById('people') || document.getElementById('hp');
  if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

/* ---------- 2. STATE (saved in localStorage) ---------- */
let S = { season: null, char: null, scene: null, outfit: { harvey: 0, jessica: 0 }, fav: [] };
try { Object.assign(S, JSON.parse(localStorage.getItem('suits') || '{}')); } catch (e) {}
S.fav = S.fav || [];
const save = () => { try { localStorage.setItem('suits', JSON.stringify(S)); } catch (e) {} };
const isFav = id => S.fav.includes(id);
const toggleFav = id => { S.fav = isFav(id) ? S.fav.filter(x => x !== id) : [...S.fav, id]; save(); };
const outfitOf = id => (OUT[id] ? S.outfit[id] || 0 : 0);

/* ---------- 3. PORTRAITS ----------
   slot(id, label, expression, outfit) -> a <div class="slot"> holding the image.
   File paths come from characters.js. If nothing loads, a text label shows. */
function slot(id, label, ex, outfit) {
  const d = document.createElement('div');
  d.className = 'slot';
  const urls = CHARACTERS.sources(id, ex, outfit ?? outfitOf(id));
  const img = new Image();
  let i = 0;
  img.alt = label;
  img.onerror = () => {
    if (++i < urls.length) img.src = urls[i];
    else { img.remove(); d.innerHTML = `<span>Portrait missing<br>${id}</span>`; }
  };
  img.src = urls[0];
  d.append(img);
  return d;
}

/* ---------- 4. BACKGROUNDS ----------
   Shows the image if the file exists; otherwise the placeholder stays visible. */
function setBackground(el, url, placeholder) {
  el.style.backgroundImage = '';
  if (placeholder) placeholder.hidden = false;
  if (!url) return;
  const im = new Image();
  im.onload = () => { el.style.backgroundImage = `url("${url}")`; if (placeholder) placeholder.hidden = true; };
  im.src = url;
}

/* ---------- 5. PAGES ---------- */
function card(id) {
  const c = C[id], d = document.createElement('div');
  d.className = 'card aw rv' + (S.char === id ? ' sel' : '');
  d.innerHTML = `<div class="tb"><span>File · ${id}</span><span><i></i><i></i></span></div>`;
  const b = document.createElement('div');
  b.className = 'bd';
  b.append(slot(id, c.n));
  b.insertAdjacentHTML('beforeend', `<div class="mono" style="margin-top:10px">${c.t}</div><h3>${c.n}</h3><p>${c.bio}</p><p class="mono">Key: ${c.rel}</p>`);
  d.append(b);
  return d;
}

function renderHome() {
  $('#wst').textContent = `Season ${S.season || '—'} · POV ${S.char ? C[S.char].n : '—'}`;
  $('#fc').innerHTML = SEASONS.map((s, i) => `<div class="mono">${s[0]}<b>S${i + 1}</b></div>`).join('');
  $('#hp').innerHTML = '';
  Object.keys(C).forEach(id => { const d = card(id); d.onclick = () => { S.char = id; save(); go(S.season ? 'scenes' : 'seasons'); }; $('#hp').append(d); });
  $('#hm').innerHTML = SC.map(s => `<div class="aw rv"><div class="tb"><span>S${s.s}·E${s.e} ${s.et}</span></div><div class="bd"><h3>${s.t}</h3><p>${s.d}</p></div></div>`).join('');
  setBackground($('#hero'), HERO_BG, $('#heroPh'));
}

function renderSeasons() {
  $('#sg').innerHTML = '';
  SEASONS.forEach((s, i) => {
    const n = i + 1, k = SC.filter(x => x.s == n).length, d = document.createElement('div');
    d.className = 'card aw rv' + (S.season == n ? ' sel' : '');
    d.innerHTML = `<div class="tb"><span>Season ${n} · ${s[0]}</span></div><div class="bd"><h3>${s[1]}</h3><p>${s[2]}</p><p class="mono">${k ? k + ' playable scenes' : 'No scenes yet'}</p><span class="btn">View season</span></div>`;
    d.onclick = () => { S.season = n; save(); go(S.char ? 'scenes' : 'characters'); };
    $('#sg').append(d);
  });
}

function renderChars() {
  $('#cg').innerHTML = '';
  Object.keys(C).forEach(id => {
    const d = card(id), b = d.lastChild;
    if (OUT[id]) {                                   // wardrobe (Harvey + Jessica only)
      const w = document.createElement('div');
      w.innerHTML = '<button class="btn g">Change outfit</button><div class="wd"></div>';
      const g = w.lastChild;
      g.hidden = window.openWardrobe !== id;
      w.firstChild.onclick = e => { e.stopPropagation(); g.hidden = !g.hidden; };
      OUT[id].forEach((name, i) => {
        const o = document.createElement('div');
        o.className = 'o' + (S.outfit[id] == i ? ' on' : '');
        o.append(slot(id, name, 'neutral', i));
        o.insertAdjacentHTML('beforeend', name);
        o.onclick = e => { e.stopPropagation(); S.outfit[id] = i; save(); window.openWardrobe = id; route(1); };
        g.append(o);
      });
      b.append(w);
    }
    b.insertAdjacentHTML('beforeend', `<p class="mono">${SC.filter(s => s.ch.includes(id)).length} scenes</p>`);
    const sb = document.createElement('span');
    sb.className = 'btn'; sb.textContent = 'Select POV';
    b.append(sb);
    d.onclick = () => { S.char = id; save(); go('scenes'); };
    $('#cg').append(d);
  });
}

function sceneRow(s) {
  const d = document.createElement('div');
  d.className = 'aw rv';
  d.innerHTML = `<div class="tb"><span>S${s.s} · E${s.e} · ${s.et}</span><button class="star${isFav(s.id) ? ' on' : ''}" title="Save / unsave">★</button></div>`;
  d.querySelector('.star').onclick = e => {
    toggleFav(s.id);
    e.currentTarget.classList.toggle('on', isFav(s.id));
    if ($('#p-saved').classList.contains('on')) renderSaved();
  };
  const b = document.createElement('div');
  b.className = 'bd scn';
  const t = document.createElement('div');
  t.className = 'th';
  s.ch.forEach(i => { const x = slot(i, C[i].n); x.style.width = '90px'; t.append(x); });
  b.append(t);
  const r = document.createElement('div');
  r.innerHTML = `<h3 style="font-size:36px">${s.t}</h3><p>${s.d}</p><p>${s.ch.map(i => `<span class="tag">${C[i].n}</span>`).join('')}</p><span class="btn">Play scene</span>`;
  r.lastChild.onclick = () => { S.scene = s.id; save(); go('player'); };
  b.append(r); d.append(b);
  return d;
}

function renderScenes() {
  const c = S.char, list = SC.filter(s => s.s == S.season && s.ch.includes(c));
  $('#sh').textContent = `Season ${S.season || '—'} · POV ${c ? C[c].n : '—'}`;
  $('#sl').innerHTML = !S.season || !c ? '<p>Choose a season and character first.</p>'
    : list.length ? '' : '<p class="mono">No archived scenes for this season and character yet.</p>';
  list.forEach(s => $('#sl').append(sceneRow(s)));
}

function renderSaved() {
  const list = SC.filter(s => S.fav.includes(s.id));
  $('#fv').innerHTML = list.length ? '' : '<p class="mono">No saved scenes yet. Press ★ on any scene to keep it here.</p>';
  list.forEach(s => $('#fv').append(sceneRow(s)));
  reveal();
}

/* ---------- 6. SCENE PLAYER ---------- */
let sc, ix, typing, tm, paused;

function setup() {
  sc = SC.find(s => s.id == S.scene);
  if (!sc) return go('scenes');
  ix = 0; paused = false;
  const st = $('#stage');
  st.innerHTML = `<div class="ph"><div>Scene background placeholder<br><br>S${sc.s} · E${sc.e} · ${sc.t}<br>1600 × 900 px<br><br>Save your image as<br>${sc.bg || '(add  bg: "..."  to this scene in data.js)'}</div></div>`;
  setBackground(st, sc.bg, st.querySelector('.ph'));
  sc.ch.forEach((id, i) => {
    const w = document.createElement('div');
    w.className = 'sp'; w.id = 'sp-' + id;
    w.style[i ? 'right' : 'left'] = '12%';
    w.append(slot(id, C[id].n));
    st.append(w);
  });
  $('#pi').textContent = `S${sc.s}·E${sc.e} ${sc.et} — ${sc.t}`;
  paintFav();
  show();
}

function show() {
  const [id, tx, ex] = sc.L[ix];
  $('#dn').textContent = C[id].n.toUpperCase();
  $$('.sp').forEach(e => e.classList.toggle('on', e.id == 'sp-' + id));
  $('#dp').replaceChildren(slot(id, C[id].n, ex));            // dialogue-box portrait
  const sp = $('#sp-' + id);
  if (sp) sp.replaceChildren(slot(id, C[id].n, ex));          // stage sprite changes expression too
  $('#pp').textContent = `${ix + 1} / ${sc.L.length}`;
  $('#pb').style.width = ((ix + 1) / sc.L.length * 100) + '%';
  clearInterval(tm);
  let n = 0; typing = true; $('#dt').textContent = '';
  tm = setInterval(() => {                                    // typing speed: change 22 (ms per letter)
    $('#dt').textContent = tx.slice(0, ++n);
    if (n >= tx.length) { clearInterval(tm); typing = false; }
  }, 22);
}

function adv() {
  if (paused || !$('#p-player').classList.contains('on')) return;
  if (typing) { clearInterval(tm); typing = false; $('#dt').textContent = sc.L[ix][1]; return; }
  if (ix < sc.L.length - 1) { ix++; show(); } else done();
}
const ov = (t, e, b) => { $('#ot').textContent = t; $('#oe').textContent = e; $('#ob').innerHTML = b; $('#ov').classList.add('on'); };
function done() {
  paused = true;
  ov('Scene complete', `Season ${sc.s} · Episode ${sc.e} · “${sc.et}”`, '<button class="btn" id="o1">Replay scene</button> <a class="btn g" href="#seasons">Return to archive</a>');
  $('#o1').onclick = () => { $('#ov').classList.remove('on'); setup(); };
}
function pause() {
  if (!paused) {
    paused = true;
    ov('Paused', 'Scene controls', '<button class="btn" id="o2">Resume</button> <a class="btn g" href="#scenes">Exit scene</a>');
    $('#o2').onclick = () => { paused = false; $('#ov').classList.remove('on'); };
  } else if ($('#o2')) { paused = false; $('#ov').classList.remove('on'); }
}
$('#db').onclick = adv;
$('#stage').onclick = adv;
$('#bp').onclick = pause;
$('#br').onclick = () => { $('#ov').classList.remove('on'); setup(); };
addEventListener('keydown', e => {
  const p = $('#p-player').classList.contains('on');
  if (p && (e.code == 'Space' || e.key == 'Enter')) { e.preventDefault(); adv(); }
  if (p && e.key == 'Escape') pause();
});

/* start menu + reset */
$('#orb').onclick = () => $('#sm').classList.toggle('on');
$('#sm').onclick = () => $('#sm').classList.remove('on');
$('#rs').onclick = e => { e.preventDefault(); S = { season: null, char: null, scene: null, outfit: { harvey: 0, jessica: 0 }, fav: S.fav }; save(); route(1); };

/* ---------- 7. ROUTER ---------- */
function route(keep) {
  const h = (location.hash || '#home').slice(1), pg = $('#p-' + h) ? h : 'home';
  $('#ov').classList.remove('on');
  $$('.pg').forEach(p => p.classList.toggle('on', p.id == 'p-' + pg));
  $$('.tk .t').forEach(a => a.classList.toggle('on', a.dataset.n == pg));
  if (keep !== 1) scrollTo(0, 0);
  ({ home: renderHome, seasons: renderSeasons, characters: renderChars, scenes: renderScenes, saved: renderSaved, player: setup, about: () => {} })[pg]();
  reveal();
}
addEventListener('hashchange', () => route());
setInterval(() => $('#clk').textContent = new Date().toTimeString().slice(0, 5), 1000);

/* ---------- 8. SCROLL ANIMATION ----------
   Any element with class "rv" fades/slides up when it scrolls into view.
   The look is in styles.css (section 9). Stagger step = 90 ms; change it here. */
const io = new IntersectionObserver(entries => entries.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: 0.12 });
function reveal() {
  $$('.rv:not(.in)').forEach((el, i) => { el.style.setProperty('--d', (i % 6) * 90 + 'ms'); io.observe(el); });
}

/* ---------- 9. OPERATIONS MENU: SOUND + SAVE BUTTON ---------- */
const bgm = $('#bgm'), sndState = $('#sndState');
$('#sndBtn').onclick = e => {
  e.preventDefault(); e.stopPropagation();          // keeps the menu open so the label updates
  if (bgm.paused) bgm.play().then(() => sndState.textContent = 'On').catch(() => sndState.textContent = 'file missing');
  else { bgm.pause(); sndState.textContent = 'Off'; }
};
function paintFav() { const b = $('#bf'); if (b) b.textContent = isFav(S.scene) ? '★ Saved' : '☆ Save'; }
$('#bf').onclick = () => { toggleFav(S.scene); paintFav(); };

route();