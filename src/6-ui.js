// ===== 界面（像素冒险风） =====
const store = {
  get(k, d) { try { const v = localStorage.getItem('liferestart_' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('liferestart_' + k, JSON.stringify(v)); } catch (e) { /* 存储不可用时忽略 */ } },
};
const meta = Object.assign({ lives: 0, best: 0, ach: [], seenT: [], hist: [], inherit: null }, store.get('meta', {}));
const saveMeta = () => store.set('meta', meta);

const G = { screen: 'home', hand: [], drawn: false, sel: [], alloc: { CHR: 0, INT: 0, STR: 0, MNY: 0 }, life: null, timer: null, auto: false, newAch: [], overlay: null, rerolls: 2 };
const $app = document.getElementById('app');
const BASE_PTS = 20;
const RARITY = ['N', 'R', 'SR', 'SSR', 'UR'];
const RANK = ['F', 'E', 'D', 'C', 'B', 'A', 'S'];
const BADGE = { CHR: '颜', INT: '智', STR: '体', MNY: '家', SPR: '乐' };
const totalPts = () => BASE_PTS + extraPoints(G.sel);
const usedPts = () => KEYS4.reduce((a, k) => a + G.alloc[k], 0);
const talBonus = k => G.sel.reduce((a, id) => a + ((TMAP[id].eff || {})[k] || 0), 0);
const signed = n => (n > 0 ? '+' : '') + n;
const pct = (v, max) => Math.max(0, Math.min(100, Math.round(v / max * 100)));
const badge = (color, ch) => `<i class="badge" style="--ac:${color}">${ch}</i>`;
const attrBadge = k => badge(`var(--a-${k})`, BADGE[k]);

const SAMPLE = [
  [0, '你出生在城里一个殷实的家庭，是个女孩。地点是美国加州，你一出生就拿到了美国护照。'],
  [17, '你参加了SAT考试，被一所常春藤名校录取。填志愿时你犹豫了很久，最后选了计算机。'],
  [24, '你进了硅谷一家科技公司，拿了一大把期权。'],
  [31, '朋友神神秘秘地推荐你买一种叫“狗狗币”的东西。你把积蓄全投了进去。它涨了一百倍！'],
  [40, '【签到系统】签到成功，颜值+1。', 'tal'],
];
const KEYWORDS = { 名校: '名校', 留学: '留学', 大厂: '大厂', 公务员: '公务员', 科研: '科学家', 明星: '顶流', 网红: '网红', 奥运冠军: '奥运冠军', 富豪: '富豪', CEO: 'CEO', 市长: '市长', 元首: '元首', 诺奖: '诺奖', 已婚: '结婚', 离婚: '离婚', 再婚: '再婚', 有孩子: '为人父母', 有孙: '含饴弄孙', 金婚: '金婚', 中彩票: '中彩票', 被裁: '被裁员', 修仙: '修仙', 筑基: '筑基', 金丹: '金丹', 元婴: '元婴', 宗主: '开宗立派', 被绑架: '外星接触', 被拐: '被拐', 团聚: '寻亲', 孤儿: '孤儿', 辍学: '辍学', 落榜: '落榜', 打工: '打工', 老板: '开店', 有房: '有房', 有猫: '养猫', 人瑞: '人瑞', 美国: '美国人', 王室: '王室', 退出王室: '退出王室', 国王: '加冕', 美国总统: '美国总统', 石油: '石油王', 星二代: '星二代', 猫生: '喵星人', 猫妖: '猫妖', 熊猫生: '国宝', 重生过: '重生', 逆袭: '逆袭', 时光机: '时光机', 吸血鬼: '吸血鬼', 返老还童: '返老还童', 拾金不昧: '拾金不昧', 码农: '码农', 土木: '土木人' };
const END_TITLE = { 飞升: '白日飞升', 回归星海: '回归星海', 数字永生: '数字永生', 冰封未来: '冰封未来', 深海回响: '深海回响', 陨落: '渡劫陨落', 时间尽头: '时间尽头', 跳出模拟器: '跳出模拟器', 迷失时空: '迷失时空', 迎接日出: '迎接日出' };

// ---------- 8-bit 音效 ----------
const SFX = { on: store.get('sfx', true), ctx: null };
function beep(freqs, dur = 0.07, type = 'square', gain = 0.035) {
  if (!SFX.on) return;
  try {
    SFX.ctx = SFX.ctx || new (window.AudioContext || window.webkitAudioContext)();
    const ctx = SFX.ctx;
    let t = ctx.currentTime;
    for (const f of [].concat(freqs)) {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = type; o.frequency.value = f;
      g.gain.setValueAtTime(gain, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g).connect(ctx.destination);
      o.start(t); o.stop(t + dur);
      t += dur * 0.85;
    }
  } catch (e) { /* 浏览器不支持音频时静默 */ }
}
const sfx = {
  click: () => beep(660, 0.04),
  pick: () => beep([523, 784], 0.05),
  draw: () => beep([392, 523, 659], 0.05),
  rare: () => beep([523, 659, 784, 1047, 1319], 0.07, 'square', 0.04),
  step: () => beep(330, 0.03, 'triangle', 0.03),
  choice: () => beep([392, 523], 0.06),
  death: () => beep([392, 330, 262, 196], 0.18, 'triangle', 0.06),
  ach: () => beep([784, 988, 1175, 1568], 0.08, 'square', 0.04),
  no: () => beep([220, 165], 0.08, 'sawtooth', 0.03),
};

// ---------- 星空背景 ----------
(function stars() {
  const c = document.getElementById('stars');
  if (!c || !c.getContext) return;
  const ctx = c.getContext('2d');
  const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cols = ['#FFFFFF', '#FFFFFF', '#FFD15C', '#5AB8FF', '#B884FF'];
  let pts = [];
  const draw = t => {
    ctx.clearRect(0, 0, c.width, c.height);
    for (const p of pts) {
      ctx.globalAlpha = reduce ? 0.7 : 0.25 + 0.75 * Math.abs(Math.sin(p.p + t / 1100));
      ctx.fillStyle = p.c;
      ctx.fillRect(p.x, p.y, p.s, p.s);
    }
  };
  const size = () => {
    c.width = Math.ceil(window.innerWidth / 3); c.height = Math.ceil(window.innerHeight / 3);
    pts = Array.from({ length: Math.round(c.width * c.height / 700) }, () => ({
      x: Math.floor(Math.random() * c.width), y: Math.floor(Math.random() * c.height),
      p: Math.random() * 6.28, s: Math.random() < 0.12 ? 2 : 1, c: pickOne(cols),
    }));
    draw(0);
  };
  size();
  window.addEventListener('resize', size);
  if (!reduce) setInterval(() => draw(performance.now()), 160);
})();

// ---------- 工具 ----------
const deathLine = L => { const l = [...L.history].reverse().flatMap(y => y.lines.filter(x => x.cls === 'dead')).shift(); return l ? l.t : ''; };
function lifeTitle(L) {
  const who = L.species !== '人' ? `${L.species} · ` : '';
  if (END_TITLE[L.end]) return `${who}${L.age}岁 · ${END_TITLE[L.end]}`;
  return L.ageScale > 1 ? `${who}享年 ${L.age} 岁（约合人类 ${L.hAge} 岁）` : `享年 ${L.age} 岁`;
}
function shareText() {
  const L = G.life;
  if (!L) return '';
  const S = L.summary();
  const kws = Object.keys(KEYWORDS).filter(k => L.ever.has(k)).map(k => KEYWORDS[k]);
  return [
    `【人生重开】第 ${meta.lives} 世 · ${lifeTitle(L)}`,
    `评级：${RANK[S.tier]}（${S.label}，${S.score} 分）`,
    `天赋：${L.talents.map(t => t.n).join('、')}`,
    kws.length ? `关键词：${kws.join('、')}` : '',
    deathLine(L) ? `结局：${deathLine(L)}` : '',
  ].filter(Boolean).join('\n');
}
function toast(msg) {
  document.querySelectorAll('.toast').forEach(t => t.remove());
  const t = document.createElement('div');
  t.className = 'toast'; t.textContent = msg; t.setAttribute('role', 'status');
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2400);
}

const topbar = (full = true) => `
  <header class="bar">
    <button class="mark" data-act="home" aria-label="返回首页"><i>生</i>人生重开</button>
    <div class="bar-actions">
      ${full ? `<button class="chip-btn" data-act="showAch">成就 <b>${meta.ach.length}/${ACH.length}</b></button>
      <button class="chip-btn" data-act="showHist">档案</button>` : ''}
      <button class="chip-btn" data-act="sfx" aria-pressed="${SFX.on}">音效 <b>${SFX.on ? '开' : '关'}</b></button>
    </div>
  </header>`;

const cardHTML = (id, opts = {}) => {
  const t = TMAP[id];
  return `<button class="card ${opts.on ? 'on' : ''} ${opts.flip ? 'flip' : ''}" data-g="${t.g}" data-act="${opts.act || 'pick'}" data-id="${id}" style="${opts.delay != null ? `animation-delay:${opts.delay}ms` : ''}" aria-pressed="${!!opts.on}">
    <span class="rk" title="${GRADE[t.g]}">${RARITY[t.g]}</span>
    <span class="nm">${t.n}</span>
    <span class="ds">${t.d}</span>
    ${opts.inh ? '<span class="inh">▲ 上一世继承</span>' : ''}
  </button>`;
};

const lineHTML = (age, lines, cls, pending) => `<li class="${cls || ''}"><span class="age">${age}<small>岁</small></span><div class="txt">${lines.map(l => `<p class="${l.cls || ''}">${l.t}</p>`).join('')}${pending ? `<p>${pending.text}……</p><div class="choices" role="group" aria-label="做出选择">${pending.choices.map((c, i) => `<button class="choice-btn" data-act="choose" data-i="${i}">${c}</button>`).join('')}</div>` : ''}</div></li>`;
const yearHTML = (y, cls) => lineHTML(y.age, y.lines, cls, y.pending);
const logHTML = L => L.history.map((y, i, a) => yearHTML(y, i === a.length - 1 ? 'cur' : '')).join('');

const attrHTML = (k, v) => `<div class="attr" data-k="${k}" style="--ac:var(--a-${k})">
  <div class="attr-top">${attrBadge(k)}<b>${v}</b></div>
  <div class="meter"><i style="width:${pct(v, 12)}%"></i></div>
</div>`;

// ---------- 页面 ----------
const SCREENS = {
  home() {
    return `<section class="screen">
      ${topbar()}
      <div class="logo">
        <div class="logo-sub">LIFE RESTART</div>
        <h1 class="logo-title">人生重开</h1>
        <div class="logo-ver">模拟器</div>
      </div>
      <div class="start-wrap">
        <button class="btn btn-start" data-act="start" id="btn-start">▶ 立即重开</button>
        <p class="blink" aria-hidden="true">PRESS START</p>
      </div>
      <p class="tagline">这辈子过得不太满意？再投一次胎试试。十连抽天赋，说不定抽到美籍、英国王室，甚至投胎成猫；分好属性，在人生的岔路口自己做选择。</p>
      <div class="hud-stats">
        <div class="px"><b>${meta.lives}</b><span>已重开</span></div>
        <div class="px"><b>${meta.best || '—'}</b><span>最高分</span></div>
        <div class="px"><b>${meta.ach.length}</b><span>成就</span></div>
        <div class="px"><b>${meta.seenT.length}/${TALENTS.length}</b><span>天赋图鉴</span></div>
      </div>
      <div class="dialog px"><span class="dialog-tag">示例存档</span>
        <ul class="log">${SAMPLE.map(([a, t, c]) => lineHTML(a, [{ t, cls: c }])).join('')}</ul>
      </div>
      <ol class="quests">
        <li class="px"><small>STEP 1</small><b>抽天赋</b>十连抽，每次必出惊喜天赋</li>
        <li class="px"><small>STEP 2</small><b>分属性</b>颜值、智力、体质、家境，共二十点</li>
        <li class="px"><small>STEP 3</small><b>做选择</b>表白、买房、梭哈，关键时刻你说了算</li>
      </ol>
    </section>`;
  },

  talent() {
    const cards = G.drawn
      ? G.hand.map((id, i) => cardHTML(id, { on: G.sel.includes(id), flip: G.justDrew, delay: G.justDrew ? i * 70 : null, inh: id === G.inheritId })).join('')
      : Array.from({ length: 10 }, () => '<div class="card back" aria-hidden="true"></div>').join('');
    G.justDrew = false;
    return `<section class="screen">
      ${topbar()}
      <div><h2 class="h2">天赋十连抽</h2><p class="sub">选三个天赋带进这一世。每次十连至少出一个惊喜天赋，不满意还能重抽。</p></div>
      <div class="odds">${ODDS.map((p, g) => `<span style="--rc:var(--r${g})">${RARITY[g]} ${GRADE[g]} ${Math.round(p * 100)}%</span>`).join('')}</div>
      <div class="cards">${cards}</div>
      <div class="btn-row">
        ${G.drawn
          ? `<button class="btn btn-ghost" data-act="reroll" ${G.rerolls > 0 ? '' : 'disabled'}>重抽 ×${G.rerolls}</button>
             <button class="btn" data-act="toAlloc" ${G.sel.length === 3 ? '' : 'disabled'}>下一步（${G.sel.length}/3）</button>`
          : `<button class="btn" data-act="draw">▶ 十连抽</button>`}
      </div>
    </section>`;
  },

  alloc() {
    const left = totalPts() - usedPts();
    const rows = KEYS4.map(k => {
      const v = G.alloc[k], b = talBonus(k);
      return `<div class="arow" style="--ac:var(--a-${k})">
        <span class="an">${attrBadge(k)}${ATTR[k]}</span>
        <div class="cells" aria-hidden="true">${Array.from({ length: 10 }, (_, i) => `<i class="${i < v ? 'f' : ''}"></i>`).join('')}</div>
        <div class="stepper">
          <button data-act="dec" data-k="${k}" ${v <= 0 ? 'disabled' : ''} aria-label="${ATTR[k]}减一">−</button>
          <output>${v}${b ? `<small>${signed(b)}</small>` : ''}</output>
          <button data-act="inc" data-k="${k}" ${v >= 10 || left <= 0 ? 'disabled' : ''} aria-label="${ATTR[k]}加一">+</button>
        </div>
      </div>`;
    }).join('');
    return `<section class="screen">
      ${topbar()}
      <div><h2 class="h2">分配属性</h2><p class="sub">每项 0 到 10 点，绿色数字是天赋加成，快乐从 5 点起步。</p></div>
      <div class="picked">${G.sel.map(id => `<span class="pill" data-g="${TMAP[id].g}">${TMAP[id].n}</span>`).join('')}</div>
      <p class="points">剩余点数 <b>${left}</b><span class="sub">共 ${totalPts()} 点</span></p>
      <div class="alloc px">${rows}</div>
      <div class="btn-row">
        <button class="btn btn-ghost" data-act="randAlloc">随机分配</button>
        <button class="btn" data-act="begin" ${left === 0 ? '' : 'disabled'}>▶ 开始新人生</button>
      </div>
    </section>`;
  },

  life() {
    const L = G.life;
    return `<section class="screen life">
      ${topbar(false)}
      <div class="hud px">
        <div class="hud-age"><b id="hud-age">${Math.max(L.age, 0)}</b><span id="hud-sp">${L.species === '人' ? '岁' : L.species + ' · 岁'}</span></div>
        <div class="attrs" id="attrs">${KEYS5.map(k => attrHTML(k, L[k])).join('')}</div>
      </div>
      <div class="logwrap" id="logwrap" data-act="next" title="点击推进一年">
        <div class="dialog px"><span class="dialog-tag">人生记录</span><ul class="log" id="log">${logHTML(L)}</ul></div>
      </div>
      <div class="controls" id="controls">${controlsHTML()}</div>
    </section>`;
  },

  summary() {
    const L = G.life, S = L.summary();
    const kws = Object.keys(KEYWORDS).filter(k => L.ever.has(k)).map(k => KEYWORDS[k]);
    const rate = (color, ch, name, v, max, r) => `<div class="rate" style="--ac:${color}">
      <span class="an">${badge(color, ch)}${name}</span>
      <div class="meter"><i style="width:${pct(v, max)}%"></i></div>
      <span class="v">${v}</span><span class="tier" data-t="${r.tier}">${r.label}</span>
    </div>`;
    return `<section class="screen">
      ${topbar()}
      <h2 class="h2">人生结算</h2>
      <div class="result px">
        <div class="rank" data-t="${S.tier}"><div style="display:grid;justify-items:center"><b>${RANK[S.tier]}</b><small>${S.label}</small></div></div>
        <div>
          <span class="label">第 ${meta.lives} 世</span>
          <p class="big">${lifeTitle(L)}</p>
          <span class="score">SCORE ${S.score}</span>
          <p class="epi">${deathLine(L)}</p>
        </div>
      </div>
      <div class="rates px">
        ${S.rows.map(r => rate(`var(--a-${r.k})`, BADGE[r.k], r.name, r.v, 12, r)).join('')}
        ${rate('var(--orange)', '寿', '寿命', S.hAge, 100, S.ageR)}
      </div>
      <p class="sub">各项按一生中的最高值评级。总分 = 五项最高值之和 × 2 + 寿命 ÷ 2。</p>
      ${kws.length ? `<div class="section"><span class="label">人生关键词</span><div class="picked">${kws.map(k => `<span class="pill">${k}</span>`).join('')}</div></div>` : ''}
      ${G.newAch.length ? `<div class="section"><span class="label">成就解锁</span><div class="unlock">${G.newAch.map(a => `<span class="pill" title="${a.d}">★ ${a.n}</span>`).join('')}</div></div>` : ''}
      <div class="section inherit">
        <span class="label">选一个天赋带进下一世</span>
        <div class="cards">${L.talents.map(t => cardHTML(t.id, { act: 'inherit', on: meta.inherit === t.id })).join('')}</div>
      </div>
      <div class="btn-row">
        <button class="btn btn-ghost" data-act="showLog">回看这一世</button>
        <button class="btn btn-ghost" data-act="share">复制结局</button>
        <button class="btn" data-act="start">▶ 再活一次</button>
      </div>
    </section>`;
  },
};

function controlsHTML() {
  if (!G.life.alive) return `<button class="btn" data-act="toSummary">▶ 人生结算</button>`;
  return `<button class="btn" data-act="next">下一年</button>
    <button class="btn btn-ghost" data-act="auto" aria-pressed="${G.auto}">${G.auto ? '暂停' : '自动'}</button>
    <button class="btn btn-ghost" data-act="finish">速通</button>`;
}

function render() {
  $app.innerHTML = SCREENS[G.screen]();
  if (G.screen === 'life') scrollLog();
  renderOverlay();
}

// ---------- 弹层 ----------
function renderOverlay() {
  document.querySelector('.overlay')?.remove();
  if (!G.overlay) return;
  const el = document.createElement('div');
  el.className = 'overlay'; el.dataset.act = 'closeOverlay';
  let body = '';
  if (G.overlay === 'ach') {
    body = `<div class="panel-head"><h2 class="h2">成就</h2><span class="sub">已解锁 ${meta.ach.length}/${ACH.length}。每解锁一个，抽到高品级天赋的概率略微提升。</span></div>
      <div class="ach-grid">${ACH.map(a => meta.ach.includes(a.id)
        ? `<div class="ach got"><b>★ ${a.n}</b><span>${a.d}</span></div>`
        : `<div class="ach lock"><b>？？？</b><span>${a.d}</span></div>`).join('')}</div>`;
  } else if (G.overlay === 'hist') {
    body = `<div class="panel-head"><h2 class="h2">轮回档案</h2><span class="sub">最近 ${meta.hist.length} 世</span></div>
      ${meta.hist.length ? `<ul class="hist">${meta.hist.map(h => `<li><b>第 ${h.n} 世 · ${h.title}</b><span class="tier" data-t="${h.tier}">${RANK[h.tier]} ${h.score}</span><small>${h.tals.join('、')} — ${h.epi}</small></li>`).join('')}</ul>`
        : '<p class="empty">还没有完成过任何一世。</p>'}`;
  } else if (G.overlay === 'share') {
    body = `<div class="panel-head"><h2 class="h2">复制结局</h2><span class="sub">这里没法自动复制，请长按或拖选下面的文字。</span></div>
      <textarea id="share-text" class="share-box" readonly rows="7">${shareText()}</textarea>`;
  } else if (G.overlay === 'log') {
    body = `<div class="panel-head"><h2 class="h2">这一世</h2></div>
      <div class="dialog"><ul class="log">${G.life.history.map(y => yearHTML(y)).join('')}</ul></div>`;
  }
  el.innerHTML = `<div class="panel px" role="dialog" aria-modal="true">${body}<div class="btn-row"><button class="btn btn-ghost" data-act="closeOverlay">关闭</button></div></div>`;
  document.body.appendChild(el);
}

// ---------- 人生推进 ----------
function scrollLog() {
  const w = document.getElementById('logwrap');
  if (w) w.scrollTop = w.scrollHeight;
}
function updateAttrs(delta) {
  const L = G.life;
  const ageEl = document.getElementById('hud-age');
  if (ageEl) ageEl.textContent = Math.max(L.age, 0);
  const spEl = document.getElementById('hud-sp');
  if (spEl) spEl.textContent = L.species === '人' ? '岁' : L.species + ' · 岁';
  KEYS5.forEach(k => {
    const box = document.querySelector(`.attr[data-k="${k}"]`);
    if (!box) return;
    box.querySelector('b').textContent = L[k];
    box.querySelector('.meter i').style.width = pct(L[k], 12) + '%';
    const d = delta && delta[k];
    box.querySelector('em')?.remove();
    if (d) box.insertAdjacentHTML('beforeend', `<em class="${d > 0 ? 'u' : 'd'}">${signed(d)}</em>`);
  });
}
function appendYear(yr) {
  const log = document.getElementById('log');
  log.querySelector('li.cur')?.classList.remove('cur');
  log.insertAdjacentHTML('beforeend', yearHTML(yr, 'new cur'));
}
function stepOnce() {
  const L = G.life;
  if (!L || !L.alive || L.pending) return;
  const yr = L.step();
  appendYear(yr);
  updateAttrs(yr.delta);
  scrollLog();
  if (yr.pending) sfx.choice();
  else if (L.alive) sfx.step();
  if (!L.alive) onDeath();
}
function chooseOption(i) {
  const L = G.life;
  if (!L || !L.pending) return;
  sfx.pick();
  const yr = L.choose(i);
  document.getElementById('log').lastElementChild.outerHTML = yearHTML(yr, 'cur');
  updateAttrs(yr.delta);
  scrollLog();
  if (!L.alive) onDeath();
}
function stopAuto() { clearInterval(G.timer); G.timer = null; G.auto = false; }
function onDeath() {
  stopAuto();
  const L = G.life, S = L.summary();
  meta.lives += 1;
  meta.best = Math.max(meta.best, S.score);
  G.newAch = ACH.filter(a => !meta.ach.includes(a.id) && (() => { try { return a.c(L, meta); } catch (e) { return false; } })());
  meta.ach.push(...G.newAch.map(a => a.id));
  meta.hist.unshift({ n: meta.lives, title: lifeTitle(L), score: S.score, tier: S.tier, label: S.label, epi: deathLine(L), tals: L.talents.map(t => t.n) });
  meta.hist = meta.hist.slice(0, 20);
  meta.inherit = null;
  saveMeta();
  document.getElementById('controls').innerHTML = controlsHTML();
  sfx.death();
  if (G.newAch.length) setTimeout(() => { sfx.ach(); toast(`★ 成就解锁：${G.newAch.map(a => a.n).join('、')}`); }, 700);
}

// ---------- 交互 ----------
const ACT = {
  home() { stopAuto(); G.screen = 'home'; G.overlay = null; render(); },
  start() {
    stopAuto();
    Object.assign(G, { screen: 'talent', hand: [], drawn: false, sel: [], alloc: { CHR: 0, INT: 0, STR: 0, MNY: 0 }, life: null, newAch: [], overlay: null, rerolls: 2 });
    render(); window.scrollTo(0, 0);
  },
  draw() {
    G.inheritId = meta.inherit;
    G.hand = drawTalents(meta.ach.length, meta.inherit);
    G.drawn = true; G.justDrew = true;
    meta.seenT = [...new Set([...meta.seenT, ...G.hand])];
    saveMeta();
    render();
    if (G.hand.some(id => TMAP[id].g >= 3)) sfx.rare(); else sfx.draw();
  },
  reroll() {
    if (G.rerolls <= 0) return;
    G.rerolls -= 1;
    G.hand = drawTalents(meta.ach.length, G.inheritId);
    G.sel = []; G.justDrew = true;
    meta.seenT = [...new Set([...meta.seenT, ...G.hand])];
    saveMeta(); render();
    if (G.hand.some(id => TMAP[id].g >= 3)) sfx.rare(); else sfx.draw();
  },
  pick(b) {
    const id = b.dataset.id;
    if (G.sel.includes(id)) G.sel = G.sel.filter(x => x !== id);
    else if (G.sel.length >= 3) { sfx.no(); return toast('最多只能选三个天赋'); }
    else {
      const c = conflict(G.sel, id);
      if (c) { sfx.no(); return toast(`「${TMAP[id].n}」和「${TMAP[c].n}」不能同时选择`); }
      G.sel.push(id);
    }
    sfx.pick();
    render();
  },
  toAlloc() { if (G.sel.length === 3) { G.screen = 'alloc'; render(); window.scrollTo(0, 0); } },
  inc(b) { const k = b.dataset.k; if (G.alloc[k] < 10 && usedPts() < totalPts()) { G.alloc[k]++; render(); } },
  dec(b) { const k = b.dataset.k; if (G.alloc[k] > 0) { G.alloc[k]--; render(); } },
  randAlloc() {
    const a = { CHR: 0, INT: 0, STR: 0, MNY: 0 };
    let n = Math.min(totalPts(), 40);
    while (n > 0) { const k = pickOne(KEYS4); if (a[k] < 10) { a[k]++; n--; } }
    G.alloc = a; render();
  },
  begin() {
    if (usedPts() !== totalPts()) return;
    G.life = new Life(G.sel, G.alloc);
    G.screen = 'life'; render();
    stepOnce();
  },
  next() {
    if (G.life && G.life.pending) { sfx.no(); return toast('先做出你的选择'); }
    if (!G.auto) stepOnce();
  },
  auto() {
    if (G.auto) stopAuto();
    else { G.auto = true; G.timer = setInterval(stepOnce, 450); }
    if (G.life.alive) document.getElementById('controls').innerHTML = controlsHTML();
  },
  finish() {
    stopAuto();
    const L = G.life;
    let guard = 0;
    while (L.alive && guard++ < 5000) { if (L.pending) L.autoChoose(); else L.step(); }
    document.getElementById('log').innerHTML = logHTML(L);
    updateAttrs(null); scrollLog(); onDeath();
  },
  choose(b) { chooseOption(+b.dataset.i); },
  toSummary() { G.screen = 'summary'; render(); window.scrollTo(0, 0); },
  inherit(b) {
    const id = b.dataset.id;
    meta.inherit = meta.inherit === id ? null : id; saveMeta();
    render();
    if (meta.inherit) toast(`下一世会带着「${TMAP[id].n}」出生`);
  },
  share() {
    const text = shareText();
    const done = () => toast('结局已复制，可以直接粘贴分享');
    const fallback = () => { G.overlay = 'share'; renderOverlay(); };
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fallback);
      else fallback();
    } catch (err) { fallback(); }
  },
  sfx() {
    SFX.on = !SFX.on; store.set('sfx', SFX.on);
    document.querySelectorAll('[data-act="sfx"]').forEach(b => { b.setAttribute('aria-pressed', SFX.on); b.innerHTML = `音效 <b>${SFX.on ? '开' : '关'}</b>`; });
  },
  showAch() { G.overlay = 'ach'; renderOverlay(); },
  showHist() { G.overlay = 'hist'; renderOverlay(); },
  showLog() { G.overlay = 'log'; renderOverlay(); },
  closeOverlay(b, e) { if (e.target === b) { G.overlay = null; renderOverlay(); } },
};
const OWN_SOUND = new Set(['draw', 'reroll', 'pick', 'next', 'choose', 'finish', 'begin', 'closeOverlay']);

document.addEventListener('click', e => {
  const b = e.target.closest('[data-act]');
  if (!b || b.disabled) return;
  const act = b.dataset.act;
  if (!OWN_SOUND.has(act)) sfx.click();
  const fn = ACT[act];
  if (fn) fn(b, e);
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && G.overlay) { G.overlay = null; renderOverlay(); return; }
  if (G.screen === 'life' && !G.overlay && (e.key === ' ' || e.key === 'Enter') && !e.target.closest('button')) {
    e.preventDefault(); ACT.next();
  }
});

render();
