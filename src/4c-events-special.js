// ===== 事件：投胎成动物 / 重生 / 主角 / 觉醒 / 时空 / 仙帝 / 吸血鬼 =====
// sp: 物种（默认 '人'），只有同物种才会触发

// --- 猫 ---
ev('cat_birth', { sp: '猫', age: [0, 0], must: 1, fx: () => `你出生在一个纸箱里，是一只${pickOne(['橘色', '黑色', '三花', '奶牛色', '雪白'])}的小猫。`, add: '猫生' });
ev('cat_adopt', { sp: '猫', age: [0, 2], w: 4, fx: s => (s.chg({ SPR: 2 }), `一个年轻人把你抱回了家，给你起名叫“${pickOne(['煤球', '咪咪', '大橘', '年糕', '警长'])}”。`), add: '有主人' });
ev('cat_stray', { sp: '猫', age: [1, 3], w: 3, if: s => !s.has('有主人'), text: '你在街头流浪，学会了翻垃圾桶和躲汽车。', eff: { STR: 1, SPR: -1 } });
ev('cat_vase', { sp: '猫', age: [1, 10], text: '你把桌上的花瓶推了下去，然后无辜地看着主人。', eff: { SPR: 2 } });
ev('cat_box', { sp: '猫', age: [1, 15], text: '主人买了一台三千块的猫爬架，你只喜欢装它的纸箱。', eff: { SPR: 1 } });
ev('cat_neuter', { sp: '猫', age: [1, 2], w: 2, if: s => s.has('有主人'), text: '你被带去做了绝育，醒来后看透了猫生。', eff: { SPR: -1, INT: 1 } });
ev('cat_mouse', { sp: '猫', age: [1, 10], text: '你抓到了猫生第一只老鼠，郑重地放在了主人枕头上。', eff: { STR: 1 } });
ev('cat_famous', { sp: '猫', age: [1, 12], w: 2, if: s => s.CHR >= 7 && s.has('有主人'), text: '主人把你的视频发到网上，你成了拥有千万粉丝的网红猫。', eff: { MNY: 3, SPR: 2 }, add: '网红' });
ev('cat_fat', { sp: '猫', age: [4, 12], text: '你胖成了一个球，跳不上沙发了。', eff: { STR: -1, CHR: 1 } });
ev('cat_vet', { sp: '猫', age: [3, 14], text: '你被塞进航空箱带去打疫苗，一路上骂骂咧咧。', eff: { SPR: -1 } });
ev('cat_keyboard', { sp: '猫', age: [2, 12], if: s => s.has('有主人'), text: '你在主人的键盘上睡了一觉，顺手删掉了他半篇论文。', eff: { SPR: 1 } });
ev('cat_kittens', { sp: '猫', age: [2, 8], w: 0.7, if: s => !s.seen.has('cat_neuter'), text: '你生了一窝小猫，主人忙着给它们找领养。', add: '有孩子' });
ev('cat_spirit', { sp: '猫', age: [8, 20], w: 3, if: s => s.INT >= 9, text: '你活得太久，悟出了修炼的法门，化作人形混进了人类社会。',
  add: ['修仙', '练气', '猫妖'], fx: s => { s.species = '人'; s.ageScale = 1; s.life += 80; } });
ev('cat_sun', { sp: '猫', age: [1, 40], repeat: 1, w: 0.6, fx: () => pickOne(['你在窗台上晒了一整年的太阳。', '你每天睡十六个小时，剩下的时间在吃饭和发呆。', '你半夜在家里跑酷，把主人吵醒了无数次。', '你盯着窗外的鸟看了一整年，一只也没抓到。', '你学会了自己开门，主人很头疼。']) });

// --- 熊猫 ---
ev('panda_birth', { sp: '熊猫', age: [0, 0], must: 1, text: '你出生在成都大熊猫繁育基地，体重只有一百五十克，像一只粉色的小老鼠。', add: '熊猫生' });
ev('panda_roll', { sp: '熊猫', age: [1, 4], w: 2, text: '你在雪地里打滚的视频火遍了全球。', eff: { SPR: 2 }, add: '网红' });
ev('panda_abroad', { sp: '熊猫', age: [3, 8], w: 2, text: '你作为友好使者被送到国外的动物园，当地人排队三小时只为看你吃竹子。', eff: { SPR: 1 }, add: '出国' });
ev('panda_home', { sp: '熊猫', age: [8, 14], w: 3, if: s => s.has('出国'), text: '你结束海外工作回到四川老家，机场来了几百个人接机。', eff: { SPR: 2 } });
ev('panda_twins', { sp: '熊猫', age: [6, 15], w: 1.5, text: '你生了一对双胞胎，全国人民都来道喜。', eff: { SPR: 2 }, add: '有孩子' });
ev('panda_tree', { sp: '熊猫', age: [2, 10], text: '你爬树时从树杈上掉了下来，滚了几圈，若无其事地继续吃竹子。', eff: { STR: 1 } });
ev('panda_keeper', { sp: '熊猫', age: [1, 20], text: '你最喜欢抱着饲养员的大腿不撒手，他每天得拖着你走路。', eff: { SPR: 1 } });
ev('panda_bamboo', { sp: '熊猫', age: [1, 40], repeat: 1, w: 0.4, fx: () => pickOne(['你吃了一整年竹子。', '你每天吃十四个小时竹子，睡十个小时觉。', '你又胖了五斤，游客们很满意。', '你在树杈上睡了一整年。', '游客给你拍了一万张照片，你一张也没看。', '你被评为年度最懒熊猫，领奖时也在睡觉。']) });

// --- 重生者 ---
const REBORN = s => s.has('重生过');
ev('rb_stock', { age: [18, 40], w: 4, if: REBORN, text: '你凭着上辈子的记忆，提前押中了几只大牛股。', eff: { MNY: 3 } });
ev('rb_love', { age: [18, 35], w: 3, if: s => REBORN(s) && SINGLE(s), text: '这一次，你没有错过上辈子让你后悔一生的那个人。', eff: { SPR: 3 }, add: '恋爱' });
ev('rb_careful', { age: [18, 60], w: 2, if: REBORN, text: '你记得上辈子是怎么死的，这辈子处处小心。', eff: { STR: 2 } });

// --- 主角光环 ---
const HERO = s => s.has('主角');
ev('zj_breakoff', { age: [18, 25], w: 3, if: HERO, fx: s => `你被${s.gender === '男' ? '未婚妻' : '未婚夫'}当众退婚。你握紧拳头：“三十年河东，三十年河西，莫欺少年穷！”`, eff: { SPR: -2 }, add: '退婚' });
ev('zj_revenge', { age: [26, 40], w: 5, if: s => s.has('退婚'), text: '你功成名就。当年退婚的那家人登门道歉，你只是淡淡一笑。', eff: { MNY: 4, SPR: 3 }, add: ['富豪', '逆袭'] });
ev('zj_cliff', { age: [12, 40], w: 2, if: HERO, text: '你失足跌下悬崖，在崖底山洞里捡到一本绝世秘籍。', eff: { INT: 2, STR: 2 } });
ev('zj_will', { age: [20, 50], w: 2, if: HERO, text: '一位素不相识的老人临终前，把全部遗产留给了你。', eff: { MNY: 4 } });
ev('zj_boss', { age: [16, 30], w: 2, if: HERO, text: '你扶起一位摔倒的老人，第二天发现他是你们集团的董事长。', eff: { MNY: 2 }, add: '主管' });

// --- NPC觉醒 ---
const AWAKE = s => s.has('觉醒');
ev('jx_npc', { age: [10, 30], w: 3, if: AWAKE, text: '你发现楼下的大爷每天说的话一字不差。', eff: { INT: 1 } });
ev('jx_glitch', { age: [15, 40], w: 3, if: AWAKE, text: '一只猫从墙角走过，三秒后又一模一样地走了一遍。', eff: { INT: 1, SPR: -1 } });
ev('jx_sky', { age: [20, 50], w: 3, if: AWAKE, text: '你在天空的角落里看到一行很小的字：人生重开模拟器。', eff: { INT: 1 }, add: '看穿' });
ev('jx_exit', { age: [30, 80], w: 0.5, if: s => s.has('看穿') && s.INT >= 11, text: '你找到了这个世界的漏洞，纵身一跃钻了出去。屏幕前的你，好像被谁盯着看了一眼。', die: 1, final: 1, end: '跳出模拟器' });
ev('jx_fail', { age: [25, 80], if: s => s.has('看穿') && s.INT < 11, text: '你逢人就说这个世界是假的，被家里人送去看了医生。', eff: { SPR: -2 } });

// --- 时间旅行者 ---
ev('sj_build', { age: [20, 45], w: 3, if: s => s.has('时空'), text: '你在车库里捣鼓了三年，造出了一台时光机。', eff: { INT: 1 }, add: '时光机' });
ev('sj_trip', { age: [21, 70], w: 3, if: s => s.has('时光机'), text: '时光机的电只够用一次，你决定去', choices: [['过去', 'sj_past'], ['未来', 'sj_future']] });
ev('sj_past', { chain: 1, text: '侏罗纪。你被一只霸王龙追了三天三夜，好不容易才逃回来。', eff: { STR: 2, SPR: 1 } });
ev('sj_future', { chain: 1, text: '一万年后。你带回来一块会说话的石头，和下期彩票的号码。', eff: { INT: 3, MNY: 3 } });
ev('sj_meet', { age: [25, 60], if: s => s.has('时光机'), text: '你在街上遇到一个和你长得一模一样的老人，他冲你眨了眨眼。', eff: { SPR: 1 } });
ev('sj_lost', { age: [50, 90], w: 0.4, if: s => s.has('时光机') && s.seen.has('sj_trip'), text: '你又一次启动了时光机。这一次，你再也没有回来。', die: 1, final: 1, end: '迷失时空' });

// --- 仙帝转世 ---
ev('xd_awake', { age: [5, 8], must: 1, if: s => s.has('仙帝') && !s.has('修仙'), text: '你在梦里记起了前世的功法，开始偷偷修炼。', eff: { STR: 1 }, add: ['修仙', '练气'], fx: s => { s.life += 30; } });

// --- 吸血鬼 ---
const VAMP = s => s.has('吸血鬼');
ev('vamp_sun', { age: [5, 15], w: 3, if: VAMP, text: '你一晒太阳就起红疹，体育课永远在请假。', eff: { STR: -1, SPR: -1 } });
ev('vamp_garlic', { age: [8, 18], w: 2, if: VAMP, text: '食堂的饺子馅里放了大蒜，你在医务室躺了一下午。', eff: { STR: -1 } });
ev('vamp_young', { age: [30, 80], w: 3, if: VAMP, text: '几十年过去了，你的样子一点没变，同事们怀疑你偷偷去打了针。', eff: { CHR: 1 } });
ev('vamp_bar', { age: [20, 120], w: 2, if: VAMP, text: '你开了一家只在夜里营业的酒吧，生意好得出奇。', eff: { MNY: 2 } });
ev('vamp_lonely', { age: [100, 400], w: 2, if: VAMP, text: '你看着认识的人一个个老去，只有你还停在原地。', eff: { SPR: -3 } });
ev('vamp_sunrise', { age: [120, 600], w: 3, if: s => VAMP(s) && s.SPR <= 3, text: '一个清晨，你推开窗，第一次也是最后一次看到了日出。', die: 1, final: 1, end: '迎接日出' });

// --- 动物补充 ---
ev('cat_bath', { sp: '猫', age: [1, 10], text: '主人给你洗了个澡，你记恨了他整整一个星期。', eff: { SPR: -1 } });
ev('cat_sofa', { sp: '猫', age: [1, 12], text: '你把新沙发挠成了流苏款，主人沉默了很久。', eff: { SPR: 1 } });
ev('cat_newcat', { sp: '猫', age: [3, 12], w: 0.8, if: s => s.has('有主人'), text: '主人又抱回来一只小猫。你很不高兴，半年后你们却睡在了一起。', eff: { SPR: 1 } });
ev('cat_runaway', { sp: '猫', age: [2, 10], w: 0.5, text: '你从窗户溜了出去，三天后瘦了一圈，自己回了家。', eff: { STR: -1 } });
ev('panda_name', { sp: '熊猫', age: [0, 1], w: 3, fx: () => `全国网友投票，给你起名叫“${pickOne(['福宝', '花花', '和叶', '萌兰', '团团'])}”。` });
ev('panda_apple', { sp: '熊猫', age: [1, 10], text: '饲养员给你发了一个苹果，你抱着它啃了一下午。', eff: { SPR: 1 } });
ev('panda_snow', { sp: '熊猫', age: [1, 15], text: '下雪了，你在雪地里滚成了一个雪球。', eff: { SPR: 1 } });
ev('panda_escape', { sp: '熊猫', age: [2, 12], w: 0.8, text: '你翻出围栏越狱，最后在隔壁小熊猫家里被找到。', eff: { SPR: 2, STR: 1 } });
ev('panda_live', { sp: '熊猫', age: [2, 20], text: '基地给你开了直播，几百万人看你睡了一整天。', eff: { MNY: 1 }, add: '网红' });
ev('panda_diet', { sp: '熊猫', age: [5, 20], text: '兽医说你太胖了，竹子减半。你气得一天没理饲养员。', eff: { SPR: -1, STR: 1 } });
ev('panda_sick', { sp: '熊猫', age: [5, 30], w: 0.6, text: '你肚子疼了好几天，兽医连夜会诊。', eff: { STR: -1 } });
ev('panda_elder', { sp: '熊猫', age: [18, 35], w: 2, fx: s => `你成了基地里最年长的熊猫，游客们都叫你“熊猫${s.gender === '男' ? '爷爷' : '奶奶'}”。`, eff: { SPR: 1 } });
