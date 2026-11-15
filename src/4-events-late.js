// ===== 事件：晚年、修仙、奇异结局、日常 =====
ev('retire', { age: [60, 60], must: 1, if: s => s.has('工作') && !s.has('修仙'), fx: s => s.has('公务员') ? (s.chg({ MNY: 1 }), '你光荣退休，每月领着一份体面的退休金。') : s.has('富豪') ? '你把公司交给了职业经理人，开始周游世界。' : '你退休了，第一天在家里转了十几圈，不知道该干什么。', add: '退休' });
ev('squaredance', { age: [58, 80], if: s => s.SPR >= 4, text: '你加入了小区的广场舞队，很快成了领舞。', eff: { SPR: 2, STR: 1 } });
ev('grandkid', { age: [58, 78], w: 2, if: s => s.has('有孩子'), text: '你抱上了孙辈，每天乐呵呵地带娃。', eff: { SPR: 2 }, add: '有孙' });
ev('oldschool', { age: [60, 80], text: '你报名了老年大学，学起了国画。', eff: { INT: 1, SPR: 1 } });
ev('pills', { age: [60, 85], w: 1.5, if: s => s.INT <= 6, text: '你花两万块买了一箱“包治百病”的保健品。', eff: { MNY: -2 } });
ev('fall', { age: [65, 95], w: 1.2, text: '你在浴室滑了一跤，摔断了髋骨。', eff: { STR: -2 } });
ev('memoir', { age: [65, 90], if: s => s.INT >= 8, text: '你写完了一本回忆录，出版社居然真给出了。', eff: { SPR: 1 } });
ev('golden', { age: [75, 90], w: 3, if: s => s.has('已婚') && !s.has('再婚'), text: '你和老伴迎来了金婚纪念日，儿孙们为你们办了一场宴席。', eff: { SPR: 2 }, add: '金婚' });
ev('widowed', { age: [70, 95], w: 1.2, if: s => s.has('已婚'), text: '你的老伴先走了一步。你常常对着空椅子说话。', eff: { SPR: -3 }, add: '丧偶', del: '已婚' });
ev('alzheimer', { age: [70, 95], w: 0.5, text: '你患上了阿尔茨海默病，渐渐认不出身边的人。', eff: { INT: -3, SPR: -1 } });
ev('lonely', { age: [75, 95], w: 1.5, if: s => !s.has('已婚') && !s.has('有孩子') && !s.has('修仙'), text: '你一个人住在老房子里，每天最大的事是等快递上门。', eff: { SPR: -1 } });
ev('marathon', { age: [60, 80], w: 2, if: s => s.STR >= 10, text: '你以古稀之年跑完了全程马拉松。', eff: { STR: 1, SPR: 2 } });
ev('shortvideo', { age: [65, 85], text: '你学会了刷短视频，每天刷到半夜。', eff: { SPR: 1, INT: -1 } });
ev('centenary', { age: [100, 100], must: 1, fx: s => s.has('有孩子') ? '你迎来了百岁寿宴，四世同堂，满屋子人给你磕头拜寿。' : '你迎来了百岁生日，社区给你送来一个大蛋糕。', eff: { SPR: 2 } });
ev('oldest', { age: [116, 125], w: 4, text: '你成了世界上最长寿的人，记者排着队来采访你的养生秘诀。', add: '人瑞' });
ev('cryo', { age: [75, 95], w: 1.5, if: s => s.MNY >= 12, text: '你花巨资把自己冷冻了起来，等待未来的医学把你唤醒。', die: 1, final: 1, end: '冰封未来' });
ev('upload', { age: [70, 100], w: 2, if: s => s.INT >= 13 && s.MNY >= 8, text: '你把意识上传到了云端，以数据的形式获得了永生。', die: 1, final: 1, end: '数字永生' });
ev('gs_end', { age: [35, 70], w: 2, if: s => s.has('呼唤'), text: '一个暴雨夜，你走进了大海，再也没有回来。有人说那晚听见深海传来了歌声。', die: 1, final: 1, end: '深海回响' });

// --- 修仙之路 ---
const XIAN = s => s.has('修仙');
ev('xian_meet', { age: [8, 40], w: s => s.has('仙缘') ? 2 : (s.INT >= 8 && s.STR >= 8 ? 0.06 : 0.01), if: s => !XIAN(s),
  text: '你在山里迷了路，遇到一位白发老者。他捏了捏你的手腕：“骨骼清奇，可愿随我修行？”', choices: [['跟他走', 'xian_join'], ['当他是骗子', 'xian_no']] });
ev('xian_join', { chain: 1, text: '你跟着老者进了深山，踏上了修仙之路。', eff: { STR: 1 }, add: ['修仙', '练气'], fx: s => { s.life += 30; } });
ev('xian_no', { chain: 1, text: '你觉得遇上了骗子，转身就跑。' });
ev('xian_train', { age: [8, 3000], repeat: 1, w: 2, if: XIAN, fx: s => {
  const r = pickOne([['你在瀑布下打坐了一整年。', 'STR'], ['你参悟了一卷残破的古经。', 'INT'], ['你下山斩了一只作恶的妖兽，百姓给你立了长生牌位。', 'SPR'], ['你在丹房里炼出了一炉丹药。', 'STR'], ['你和师兄论道三天三夜。', 'INT']]);
  s.chg({ [r[1]]: 1 }); return r[0];
} });
ev('xian_closed', { age: [12, 3000], repeat: 1, w: 3, if: XIAN, fx: s => {
  const span = s.has('元婴') ? [50, 150] : s.has('金丹') ? [30, 80] : s.has('筑基') ? [10, 30] : [3, 8];
  const n = span[0] + Math.floor(Math.random() * (span[1] - span[0]));
  s.skipYears = n; s.chg({ STR: 1, INT: 1 });
  return `你闭关修炼，再出关时已过去了${n}年。`;
} });
ev('zhuji', { age: [12, 300], w: 4, if: s => s.has('练气') && s.STR >= 10 && s.INT >= 9, text: '你成功筑基，寿元大增。', del: '练气', add: '筑基', fx: s => { s.life += 150; } });
ev('jindan', { age: [30, 600], w: 4, if: s => s.has('筑基') && s.STR >= 13 && s.INT >= 12, text: '你结成金丹，从此御剑而行。', del: '筑基', add: '金丹', fx: s => { s.life += 400; } });
ev('yuanying', { age: [80, 1500], w: 4, if: s => s.has('金丹') && s.STR >= 16 && s.INT >= 15, text: '金丹碎裂，元婴初成。你一念之间可以横渡千里。', del: '金丹', add: '元婴', fx: s => { s.life += 1000; } });
ev('dujie', { age: [200, 3000], w: 4, if: s => s.has('元婴') && s.STR >= 18, text: '九天之上雷云翻滚，你的天劫到了。', then: [['ascend', s => s.STR + s.INT + s.SPR >= 48 || s.r(0.5)], ['jie_fail']] });
ev('ascend', { chain: 1, text: '你扛过了九道天雷，白日飞升。', die: 1, final: 1, end: '飞升', add: '飞升' });
ev('jie_fail', { chain: 1, text: '第九道天雷落下，你灰飞烟灭。', die: 1, final: 1, end: '陨落' });
ev('xian_city', { age: [100, 3000], w: 2, if: XIAN, text: '你下山云游，发现人间早已换了模样，人人手里都捧着一块会发光的板子。', eff: { SPR: 1 } });
ev('xian_home', { age: [90, 3000], w: 2, if: XIAN, text: '你回到故乡，当年的同学早已不在人世，只剩村口那棵老槐树还认得你。', eff: { SPR: -2 } });
ev('xian_disciple', { age: [150, 3000], w: 2, if: s => s.has('金丹') || s.has('元婴'), text: '你开宗立派，门下弟子三千。', eff: { SPR: 2 }, add: '宗主' });

// --- 长生种 ---
ev('long_150', { age: [150, 160], w: 4, if: s => !XIAN(s), text: '你已经一百五十多岁了，户籍系统一直以为你的档案是个程序错误。', eff: { SPR: 1 } });
ev('long_mars', { age: [180, 260], w: 3, text: '你在电视上看着人类在火星建起了第一座城市。', eff: { INT: 1 } });
ev('long_tired', { age: [250, 400], w: 2, if: s => !XIAN(s), text: '你已经记不清自己活了多久，身边的人换了一茬又一茬。', eff: { SPR: -2 } });

// --- 日常（可重复，兜底用） ---
ev('f_child', { age: [1, 11], repeat: 1, w: 0.8, fx: () => pickOne(['你度过了无忧无虑的一年。', '你和小伙伴们在巷子里疯玩了一整年。', '你又长高了一点。']) });
ev('f_teen', { age: [12, 17], repeat: 1, w: 0.8, fx: () => pickOne(['你在学校里度过了平淡的一年。', '你每天在题海里沉浮。', '你偷偷在课本里夹着小说看。']) });
ev('f_adult', { age: [18, 59], repeat: 1, w: 1.5, fx: () => pickOne(['日子平平淡淡地过去了。', '你又长了一岁，生活没什么变化。', '你在通勤路上度过了一年里的四百个小时。', '你给自己定了很多新年计划，一个也没完成。', '你过了普普通通的一年。']) });
ev('f_old', { age: [60, 119], repeat: 1, w: 1.5, fx: () => pickOne(['你在公园里下了一年的象棋。', '你每天早上五点醒来，在阳台上浇花。', '你又给老朋友打了几通电话，有几个号码已经打不通了。', '平静的一年过去了。']) });
ev('f_long', { age: [120, 3000], repeat: 1, w: 0.4, fx: s => { s.skipYears = 9; return '岁月如梭，转眼又是十年。'; } });

// --- 自我调节 ---
ev('rest', { age: [18, 75], w: 2, if: s => s.STR <= 3, text: '医生警告你再这样下去身体就垮了。你戒了烟酒，开始早睡早起。', eff: { STR: 2 } });
ev('wolfberry', { age: [30, 75], if: s => s.STR <= 5, text: '你迷上了养生，保温杯里永远泡着枸杞。', eff: { STR: 1 } });
ev('getaway', { age: [18, 75], w: 2, if: s => s.SPR <= 2, text: '朋友硬拉你出门旅行了一趟，你心里的结慢慢解开了。', eff: { SPR: 2 } });
ev('therapy', { age: [18, 75], w: 2, if: s => s.SPR <= 0, text: '你开始看心理医生，情况一点点好转。', eff: { SPR: 2, MNY: -1 } });
