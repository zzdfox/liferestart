// ===== 核心常量 =====
const ATTR = { CHR: '颜值', INT: '智力', STR: '体质', MNY: '家境', SPR: '快乐' };
const KEYS4 = ['CHR', 'INT', 'STR', 'MNY'];
const KEYS5 = ['CHR', 'INT', 'STR', 'MNY', 'SPR'];
const GRADE = ['普通', '稀有', '史诗', '传说', '惊喜'];
const EVENTS = [];
const ev = (id, o) => { o.id = id; EVENTS.push(o); return o; };
const pickOne = a => a[Math.floor(Math.random() * a.length)];

// ===== 天赋 =====
// g: 品级 0普通 1稀有 2史诗 3传说 4惊喜
// eff: 开局属性修正  pts: 额外可分配点  life: 寿命加成  tag: 标签  ex: 互斥
// on(s): 开局特殊效果  year(s): 每年触发，返回文字则显示
const TALENTS = [
  { id: 'putong', n: '平平无奇', d: '没有任何效果，和大多数人一样', g: 0 },
  { id: 'meimu', n: '眉清目秀', d: '颜值+1', g: 0, eff: { CHR: 1 } },
  { id: 'xiaocong', n: '小聪明', d: '智力+1', g: 0, eff: { INT: 1 } },
  { id: 'jieshi', n: '皮实', d: '体质+1', g: 0, eff: { STR: 1 } },
  { id: 'xiaokang', n: '小康之家', d: '家境+1', g: 0, eff: { MNY: 1 } },
  { id: 'meixin', n: '没心没肺', d: '快乐+1', g: 0, eff: { SPR: 1 } },
  { id: 'pts1', n: '小小祝福', d: '可分配属性点+1', g: 0, pts: 1 },
  { id: 'jinshi', n: '天生近视', d: '颜值-1，智力+1', g: 0, eff: { CHR: -1, INT: 1 } },
  { id: 'yipang', n: '喝水都胖', d: '颜值-1，体质+1', g: 0, eff: { CHR: -1, STR: 1 } },
  { id: 'yemao', n: '夜猫子', d: '智力+1，体质-1', g: 0, eff: { INT: 1, STR: -1 } },
  { id: 'tietou', n: '头铁', d: '体质+1，智力-1', g: 0, eff: { STR: 1, INT: -1 } },
  { id: 'shekong', n: '社恐', d: '智力+1，快乐-1', g: 0, eff: { INT: 1, SPR: -1 }, ex: ['sheniu'] },
  { id: 'sheniu', n: '社牛', d: '快乐+2，智力-1', g: 0, eff: { SPR: 2, INT: -1 }, ex: ['shekong'] },
  { id: 'chihuo', n: '吃货', d: '快乐+1，体质+1，家境-1', g: 0, eff: { SPR: 1, STR: 1, MNY: -1 } },
  { id: 'maonu', n: '猫奴', d: '快乐+1，和猫特别有缘', g: 0, eff: { SPR: 1 }, tag: '猫缘' },
  { id: 'zhai', n: '资深宅', d: '快乐+1，体质-1', g: 0, eff: { SPR: 1, STR: -1 } },
  { id: 'xueza', n: '学渣', d: '智力-1，快乐+2', g: 0, eff: { INT: -1, SPR: 2 } },
  { id: 'zaochan', n: '早产儿', d: '体质-2，可分配属性点+3', g: 0, eff: { STR: -2 }, pts: 3 },
  { id: 'jiaoqi', n: '娇生惯养', d: '体质-1，颜值+1', g: 0, eff: { STR: -1, CHR: 1 } },
  { id: 'danxiao', n: '胆小鬼', d: '体质-1，更少遭遇意外', g: 0, eff: { STR: -1 }, tag: '谨慎' },
  { id: 'qianbei', n: '千杯不醉', d: '酒桌上从没输过', g: 0, tag: '海量' },
  { id: 'nan', n: '生而为男', d: '性别固定为男', g: 0, ex: ['nv'], on: s => { s.gender = '男'; } },
  { id: 'nv', n: '生而为女', d: '性别固定为女', g: 0, ex: ['nan'], on: s => { s.gender = '女'; } },
  { id: 'piezi', n: '左撇子', d: '智力+1，用剪刀很别扭', g: 0, eff: { INT: 1 } },

  { id: 'pts2', n: '祝福', d: '可分配属性点+2', g: 1, pts: 2 },
  { id: 'lizhi', n: '天生丽质', d: '颜值+2', g: 1, eff: { CHR: 2 } },
  { id: 'chaoqun', n: '智商超群', d: '智力+2', g: 1, eff: { INT: 2 } },
  { id: 'qiangzhuang', n: '身强体壮', d: '体质+2', g: 1, eff: { STR: 2 } },
  { id: 'fuerdai', n: '富二代', d: '家境+2', g: 1, eff: { MNY: 2 }, ex: ['guer'] },
  { id: 'letian', n: '乐天派', d: '快乐+2', g: 1, eff: { SPR: 2 } },
  { id: 'guer', n: '孤儿', d: '家境-3，可分配属性点+4', g: 1, eff: { MNY: -3 }, pts: 4, tag: '孤儿', ex: ['fuerdai', 'shoufu'] },
  { id: 'xueba', n: '学霸体质', d: '6~22岁每年有概率智力+1', g: 1,
    year: s => s.age >= 6 && s.age <= 22 && s.r(0.3) ? (s.chg({ INT: 1 }), '【学霸体质】你的学习效率高得吓人，智力+1。') : 0 },
  { id: 'yundong', n: '运动健将', d: '体质+1，有运动天赋', g: 1, eff: { STR: 1 }, tag: '运动' },
  { id: 'yishu', n: '艺术细胞', d: '颜值+1，有艺术天赋', g: 1, eff: { CHR: 1 }, tag: '艺术' },
  { id: 'coder', n: '程序员基因', d: '智力+1，天生会写代码', g: 1, eff: { INT: 1 }, tag: '码农' },
  { id: 'jinli', n: '锦鲤体质', d: '运气特别好', g: 1, tag: '幸运', ex: ['daomei'] },
  { id: 'daomei', n: '倒霉蛋', d: '可分配属性点+3，但运气很差', g: 1, pts: 3, tag: '倒霉', ex: ['jinli'] },
  { id: 'wanrenmi', n: '万人迷', d: '颜值+1，桃花运旺盛', g: 1, eff: { CHR: 1 }, tag: '桃花' },
  { id: 'lianai', n: '恋爱脑', d: '快乐+1，为爱冲昏头脑', g: 1, eff: { SPR: 1 }, tag: '恋爱脑', ex: ['tiansha'] },
  { id: 'tiansha', n: '天煞孤星', d: '智力+2，注定孤独一生', g: 1, eff: { INT: 2 }, tag: '孤星', ex: ['lianai', 'wanrenmi'] },
  { id: 'kangya', n: '抗压体质', d: '快乐不会低于1', g: 1,
    year: s => { if (s.SPR < 1) { s.SPR = 1; return '【抗压体质】你很快调整好了心态。'; } } },
  { id: 'zaohui', n: '早慧', d: '2~6岁每年有概率智力+1', g: 1,
    year: s => s.age >= 2 && s.age <= 6 && s.r(0.5) ? (s.chg({ INT: 1 }), '【早慧】你懂的东西比同龄人多得多，智力+1。') : 0 },
  { id: 'zuchuan', n: '祖传秘方', d: '体质+1，寿命略微延长', g: 1, eff: { STR: 1 }, life: 5 },

  { id: 'pts4', n: '大祝福', d: '可分配属性点+4', g: 2, pts: 4 },
  { id: 'qingcheng', n: '倾国倾城', d: '颜值+4', g: 2, eff: { CHR: 4 } },
  { id: 'guomu', n: '过目不忘', d: '智力+4', g: 2, eff: { INT: 4 } },
  { id: 'jingang', n: '金刚不坏', d: '体质+4', g: 2, eff: { STR: 4 } },
  { id: 'shoufu', n: '首富之子', d: '家境+4', g: 2, eff: { MNY: 4 }, ex: ['guer'] },
  { id: 'xinjing', n: '心如止水', d: '快乐永远不会降低', g: 2 },
  { id: 'bulao', n: '不老容颜', d: '颜值+1，颜值不会随年龄下降', g: 2, eff: { CHR: 1 } },
  { id: 'laojian', n: '老而弥坚', d: '年老后体质衰退减半，寿命延长', g: 2, life: 8 },
  { id: 'dawan', n: '大器晚成', d: '40岁时全属性+2', g: 2,
    year: s => s.age === 40 ? (s.chg({ CHR: 2, INT: 2, STR: 2, MNY: 2, SPR: 2 }), '【大器晚成】四十不惑，你的人生忽然开了窍，全属性+2。') : 0 },
  { id: 'xianyuan', n: '仙缘', d: '更容易踏上修仙之路', g: 2, tag: '仙缘' },
  { id: 'yuzhi', n: '预知梦', d: '能躲过一次致命意外', g: 2, tag: '预知' },
  { id: 'changshou', n: '长寿基因', d: '寿命大幅延长', g: 2, life: 15 },
  { id: 'huiguang', n: '回光返照', d: '第一次死亡时活过来', g: 2, tag: '复活' },

  { id: 'pts6', n: '神之恩赐', d: '可分配属性点+6', g: 3, pts: 6 },
  { id: 'tianxuan', n: '天选之人', d: '全属性+2', g: 3, eff: { CHR: 2, INT: 2, STR: 2, MNY: 2, SPR: 2 } },
  { id: 'tianzong', n: '天纵奇才', d: '智力+6', g: 3, eff: { INT: 6 } },
  { id: 'chuanyue', n: '穿越者', d: '智力+2，带着前世的记忆出生', g: 3, eff: { INT: 2 }, tag: '穿越' },
  { id: 'xitong', n: '签到系统', d: '每年有概率随机属性+1', g: 3,
    year: s => { if (s.age > 0 && s.r(0.5)) { const k = pickOne(KEYS5); s.chg({ [k]: 1 }); return `【签到系统】签到成功，${ATTR[k]}+1。`; } } },
  { id: 'waixing', n: '外星血统', d: '体质+2，你的另一半基因来自群星', g: 3, eff: { STR: 2 }, tag: '外星' },
  { id: 'gushen', n: '古神低语', d: '智力+3，快乐-2，你总听见奇怪的声音', g: 3, eff: { INT: 3, SPR: -2 }, tag: '古神' },
  { id: 'changsheng', n: '长生种', d: '寿命极长，几乎不会老去', g: 3, life: 300, tag: '长生' },
  { id: 'hongyun', n: '鸿运当头', d: '家境+3，运气特别好', g: 3, eff: { MNY: 3 }, tag: '幸运' },
];
