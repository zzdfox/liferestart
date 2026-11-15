// ===== 惊喜天赋（g:4） =====
// 投胎成动物：species 换物种，ageScale 是一年相当于人类几岁
const NOT_ANIMAL = ['touma', 'xiongmao'];
TALENTS.push(
  { id: 'meiji', n: '美籍', d: '出生在美国，走一条完全不同的人生路线', g: 4, eff: { MNY: 1 }, tag: '美国', ex: ['wangshi', 'youtian'] },
  { id: 'wangshi', n: '英国王室', d: '家境+6，王位第七顺位继承人', g: 4, eff: { MNY: 6, CHR: 1 }, tag: '王室', ex: ['guer', 'meiji', 'youtian'] },
  { id: 'youtian', n: '中东石油王', d: '家境+8，家里有一片望不到头的油田', g: 4, eff: { MNY: 8 }, tag: '石油', ex: ['guer', 'meiji', 'wangshi'] },
  { id: 'touma', n: '投胎成猫', d: '这辈子你是一只猫。一年顶人类五年', g: 4, on: s => { s.species = '猫'; s.ageScale = 5; }, ex: ['xiongmao', 'xixuegui', 'changsheng', 'xiandi'] },
  { id: 'xiongmao', n: '投胎成熊猫', d: '国宝待遇，每天的工作是吃竹子', g: 4, on: s => { s.species = '熊猫'; s.ageScale = 3; }, ex: ['touma', 'xixuegui', 'changsheng', 'xiandi'] },
  { id: 'chongsheng', n: '重生者', d: '第一次死亡后，带着记忆回到过去重来', g: 4, tag: '重生' },
  { id: 'zhujue', n: '主角光环', d: '60岁前死不了，还会遇到爽文剧情', g: 4, tag: '主角' },
  { id: 'juexing', n: 'NPC觉醒', d: '智力+2，你开始怀疑这个世界是假的', g: 4, eff: { INT: 2 }, tag: '觉醒' },
  { id: 'shijian', n: '时间旅行者', d: '智力+1，你迟早会造出一台时光机', g: 4, eff: { INT: 1 }, tag: '时空' },
  { id: 'xiandi', n: '仙帝转世', d: '体质+2，智力+2，前世是一代仙帝', g: 4, eff: { STR: 2, INT: 2 }, tag: ['仙缘', '仙帝'], ex: NOT_ANIMAL },
  { id: 'xixuegui', n: '吸血鬼', d: '颜值+3，青春永驻，就是怕晒太阳', g: 4, eff: { CHR: 3 }, life: 500, tag: '吸血鬼', ex: NOT_ANIMAL },
  { id: 'xingerdai', n: '星二代', d: '颜值+3，家境+3，出生第一天就上热搜', g: 4, eff: { CHR: 3, MNY: 3 }, tag: '星二代', ex: ['guer'] },
);
