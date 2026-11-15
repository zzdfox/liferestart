// ===== 人生引擎（不依赖 DOM） =====
const TMAP = Object.fromEntries(TALENTS.map(t => [t.id, t]));
const EVENTS_BY_ID = Object.fromEntries(EVENTS.map(e => [e.id, e]));
const AGE_CAP = 5000;

class Life {
  constructor(ids, alloc) {
    this.talents = ids.map(id => TMAP[id]).filter(Boolean);
    this.tags = new Set(); this.ever = new Set(); this.seen = new Set();
    this.gender = Math.random() < 0.5 ? '男' : '女';
    this.species = '人'; this.ageScale = 1;
    this.life = 0; this.age = -1; this.alive = true; this.end = null;
    this.revived = false; this.reborn = false; this.dodged = false;
    this.skipYears = 0; this.delta = {}; this.pending = null; this.cur = null; this.choiceCount = 0;
    KEYS4.forEach(k => { this[k] = alloc[k] || 0; });
    this.SPR = 5;
    for (const t of this.talents) {
      if (t.eff) for (const k in t.eff) this[k] += t.eff[k];
      if (t.tag) this.add(t.tag);
      if (t.life) this.life += t.life;
      if (t.on) t.on(this);
    }
    this.init = {}; this.max = {}; this.min = {};
    KEYS5.forEach(k => { this.init[k] = this.max[k] = this.min[k] = this[k]; });
    this.history = [];
    this.snaps = { init: this.snap() };
  }
  get kid() { return this.gender === '男' ? '男孩' : '女孩'; }
  get hAge() { return this.age * this.ageScale; }
  has(t) { return this.tags.has(t); }
  tal(id) { return this.talents.some(t => t.id === id); }
  r(p) { return Math.random() < p; }
  add(t) { [].concat(t).forEach(x => { this.tags.add(x); this.ever.add(x); }); }
  del(t) { [].concat(t).forEach(x => this.tags.delete(x)); }
  chg(o) {
    for (const k in o) {
      const d = o[k];
      if (!d) continue;
      if (k === 'SPR' && d < 0 && this.tal('xinjing')) continue;
      this[k] += d;
      this.delta[k] = (this.delta[k] || 0) + d;
      if (this[k] > this.max[k]) this.max[k] = this[k];
      if (this[k] < this.min[k]) this.min[k] = this[k];
    }
  }
  val(x) { return typeof x === 'function' ? x(this) : x; }
  ok(e) { try { return !e.if || !!e.if(this); } catch (err) { return false; } }
  weight(e) { const w = e.w == null ? 1 : this.val(e.w); return w > 0 ? w : 0; }

  snap() {
    const o = { age: this.age, tags: [...this.tags], seen: [...this.seen], species: this.species, ageScale: this.ageScale, life: this.life };
    KEYS5.forEach(k => { o[k] = this[k]; });
    return o;
  }
  restore(o) {
    KEYS5.forEach(k => { this[k] = o[k]; });
    this.tags = new Set(o.tags); this.seen = new Set(o.seen);
    Object.assign(this, { age: o.age, species: o.species, ageScale: o.ageScale, life: o.life });
  }

  pick() {
    const pool = EVENTS.filter(e => !e.chain && (e.sp || '人') === this.species &&
      e.age[0] <= this.age && this.age <= e.age[1] &&
      (e.repeat || !this.seen.has(e.id)) && this.ok(e));
    const must = pool.filter(e => e.must);
    const src = must.length ? must : pool;
    let total = 0;
    const ws = src.map(e => (total += this.weight(e)));
    if (!total) return null;
    const x = Math.random() * total;
    return src[ws.findIndex(w => w > x)];
  }

  // 死亡：返回保命文字（主角光环 / 回光返照 / 重生）或 null
  die(end, final) {
    if (!final && this.has('主角') && this.age < 60) {
      this.STR = Math.max(this.STR, 1); this.add('主角不死');
      return '【主角光环】剧情需要，你又顽强地活了下来。';
    }
    if (!final && this.tal('huiguang') && !this.revived) {
      this.revived = true; this.STR = Math.max(this.STR, 2); this.add('复活过');
      return '【回光返照】就在所有人以为你不行了的时候，你又睁开了眼睛。';
    }
    if (!final && this.has('重生') && !this.reborn) {
      this.reborn = true;
      const sn = this.age >= 18 && this.snaps[17] ? this.snaps[17] : this.snaps.init;
      this.restore(sn);
      this.chg({ INT: 3, MNY: 2 });
      this.add('重生过');
      return sn.age < 0
        ? '【重生】你猛地睁开眼，发现自己又变回了一个婴儿。这一次，你什么都记得。'
        : '【重生】你猛地睁开眼，发现自己回到了十八岁那年的夏天。这一次，你什么都记得。';
    }
    this.alive = false; this.end = end || '寿终';
    return null;
  }

  push(t, cls) { this.cur.lines.push({ t, cls: cls || '' }); }

  step() {
    if (!this.alive || this.pending) return null;
    this.age += 1; this.delta = {};
    this.cur = { age: this.age, lines: [], delta: this.delta, alive: true, pending: null };
    this.history.push(this.cur);
    for (const t of this.talents) {
      if (!t.year) continue;
      const r = t.year(this);
      if (r) this.push(r, 'tal');
    }
    const e = this.pick();
    if (!e) this.push('这一年什么也没发生。');
    this.run(e, '');
    if (!this.pending) this.finish();
    return this.cur;
  }

  run(e, text) {
    let guard = 0;
    while (e && guard++ < 8) {
      const dodge = e.fatal && (this.has('主角') || (this.has('预知') && !this.dodged));
      if (dodge) {
        if (!this.has('主角')) this.dodged = true;
        this.add('躲过一劫');
        if (text) this.push(text);
        text = '';
        this.push(this.has('主角') ? '【主角光环】千钧一发之际，你毫发无伤地躲了过去。' : '【预知梦】你想起昨晚的噩梦，在最后一刻避开了这场灾祸。', 'tal');
        break;
      }
      this.seen.add(e.id);
      let t = e.text ? this.val(e.text) : '';
      if (e.eff) this.chg(e.eff);
      if (e.add) this.add(e.add);
      if (e.del) this.del(e.del);
      if (e.fx) { const r = e.fx(this); if (typeof r === 'string') t = r; }
      text += t;
      if (e.die) {
        this.push(text, 'dead'); text = '';
        const rv = this.die(e.end, e.final);
        if (rv) this.push(rv, 'tal');
        break;
      }
      if (e.choices) {
        this.pending = { text, choices: e.choices.map(c => c[0]), ids: e.choices.map(c => c[1]) };
        this.cur.pending = this.pending;
        return;
      }
      const nx = (e.then || []).find(([, c]) => !c || c(this));
      e = nx ? EVENTS_BY_ID[nx[0]] : null;
    }
    if (text) this.push(text);
  }

  choose(i) {
    const p = this.pending;
    if (!p) return null;
    const id = p.ids[i] != null ? p.ids[i] : p.ids[0];
    this.pending = null; this.cur.pending = null; this.choiceCount += 1;
    this.run(EVENTS_BY_ID[id], p.text);
    if (!this.pending) this.finish();
    return this.cur;
  }

  finish() {
    if (this.alive) this.ageing();
    if (this.alive && this.age >= AGE_CAP) { this.push('你活得太久，连时间都忘了你。', 'dead'); this.die('时间尽头', true); }
    if (this.alive && (this.age === 0 || this.age === 17)) this.snaps[this.age] = this.snap();
    if (this.skipYears) { this.age += this.skipYears; this.skipYears = 0; }
    this.cur.alive = this.alive;
  }

  ageing() {
    const ea = this.hAge - this.life;
    if (ea >= 50 && !this.tal('bulao') && !this.has('吸血鬼') && this.r(0.12)) this.chg({ CHR: -1 });
    if (ea >= 60 && this.r(this.tal('laojian') ? 0.1 : 0.2)) this.chg({ STR: -1 });
    if (ea >= 80 && this.r(this.tal('laojian') ? 0.1 : 0.2)) this.chg({ STR: -1 });

    let msg = null;
    if (this.STR < 0 && (this.age < 6 || this.r(0.4))) {
      msg = this.age < 1 ? '你没能熬过出生后的第一个冬天。'
        : this.hAge < 18 ? '你的身体太弱了，一场大病带走了你。'
        : '你的身体彻底垮了，再也没能好起来。';
    } else if (this.SPR <= -5 && this.age >= 15 && this.r(0.06)) {
      msg = '你积郁成疾，一病不起。';
    } else if (ea >= 65) {
      const p = Math.min(0.6, Math.max(0.004, (ea - 60 - this.STR * 1.5) * 0.012));
      if (this.r(p)) msg = this.deathText();
    }
    if (!msg) return;
    this.push(msg, 'dead');
    const rv = this.die('寿终');
    if (rv) this.push(rv, 'tal');
  }

  deathText() {
    if (this.species === '猫') return this.has('有主人') ? '你在主人怀里安静地闭上了眼睛。' : '你在一个暖洋洋的午后，在墙头上睡着了，再也没有醒来。';
    if (this.species === '熊猫') return '你在基地里安详离世，全网都在为你点蜡烛。';
    const opts = ['你在睡梦中安详地离开了人世。', '一个阳光很好的午后，你在躺椅上睡着了，再也没有醒来。'];
    if (this.has('修仙')) opts.push('你寿元耗尽，在洞府中坐化。', '你寿元耗尽，在洞府中坐化。');
    if (this.has('有孩子')) opts.push('你在儿孙的陪伴下走完了一生。', '你在儿孙的陪伴下走完了一生。');
    if (!this.has('已婚') && !this.has('有孩子') && this.SPR < 4) opts.push('你独自在家中去世，几天后才被邻居发现。');
    return pickOne(opts);
  }

  // 自动做选择（速通用）
  autoChoose() { if (this.pending) this.choose(Math.floor(Math.random() * this.pending.ids.length)); }

  summary() {
    const rows = KEYS5.map(k => ({ k, name: ATTR[k], v: this.max[k], ...rateAttr(this.max[k]) }));
    const ha = this.hAge;
    const ageR = rateAge(ha);
    const sum = KEYS5.reduce((a, k) => a + this.max[k], 0);
    const score = sum * 2 + Math.floor(Math.min(ha, 500) / 2);
    return { rows, ageR, score, hAge: ha, ...rateScore(score) };
  }
}

// 评级：tier 0地狱 1折磨 2不佳 3普通 4优秀 5罕见 6逆天
const TIER = ['地狱', '折磨', '不佳', '普通', '优秀', '罕见', '逆天'];
const tierBy = (v, cuts) => { let i = 0; while (i < cuts.length && v >= cuts[i]) i++; return { tier: i, label: TIER[i] }; };
const rateAttr = v => tierBy(v, [1, 3, 5, 7, 9, 11]);
const rateAge = a => tierBy(a, [1, 18, 40, 70, 90, 100]);
const rateScore = s => tierBy(s, [60, 80, 100, 120, 140, 170]);

// ===== 抽卡：惊喜天赋概率大幅提高，十连保底一个 =====
const ODDS = [0.40, 0.27, 0.13, 0.06, 0.14];
function drawTalents(achCount, inherit) {
  const b = Math.min(achCount, 50) * 0.002;
  const odds = [ODDS[0] - b, ODDS[1], ODDS[2], ODDS[3] + b / 2, ODDS[4] + b / 2];
  const hand = [];
  if (inherit && TMAP[inherit]) hand.push(inherit);
  let guard = 0;
  while (hand.length < 10 && guard++ < 500) {
    let x = Math.random(), g = 0;
    while (g < 4 && x >= odds[g]) { x -= odds[g]; g++; }
    const pool = TALENTS.filter(t => t.g === g && !hand.includes(t.id));
    if (pool.length) hand.push(pickOne(pool).id);
  }
  if (!hand.some(id => TMAP[id].g === 4)) {
    const pool = TALENTS.filter(t => t.g === 4 && !hand.includes(t.id));
    const slot = hand.findIndex((id, i) => TMAP[id].g === 0 && !(i === 0 && id === inherit));
    if (pool.length) hand[slot >= 0 ? slot : hand.length - 1] = pickOne(pool).id;
  }
  return hand;
}
function conflict(selected, id) {
  const t = TMAP[id];
  return selected.find(s => (t.ex || []).includes(s) || (TMAP[s].ex || []).includes(id)) || null;
}
const extraPoints = ids => ids.reduce((a, id) => a + (TMAP[id].pts || 0), 0);
