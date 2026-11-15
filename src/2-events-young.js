// ===== 事件：出生 ~ 18岁 =====
// age:[起,止]  must:必定发生  w:权重(数或函数)  if:条件  text:文字(串或函数)
// eff:属性变化  add/del:标签  fx(s):自定义效果(返回字符串则替换文字)
// then:[[事件id, 条件]] 同年连锁  chain:只能被连锁触发  repeat:可重复
// die:死亡  fatal:可被预知梦躲过  skip:跳过年数  end:结局名
const BIRTH_THEN = [
  ['birth_weak', s => s.STR <= 1],
  ['birth_chuanyue', s => s.has('穿越')],
  ['birth_waixing', s => s.has('外星')],
];
ev('birth_orphan', { age: [0, 0], must: 1, if: s => s.has('孤儿'), text: s => `你是个${s.kid}，出生没几天就被放在了福利院门口，襁褓里只有一张写着生日的纸条。`, eff: { SPR: -1 }, then: BIRTH_THEN });
ev('birth_rich', { age: [0, 0], must: 1, if: s => !s.has('孤儿') && s.MNY >= 10, text: s => `你出生在一个极其富有的家庭，产房外站了一排保镖。你是个${s.kid}。`, add: '豪门', then: BIRTH_THEN });
ev('birth_wealthy', { age: [0, 0], must: 1, if: s => !s.has('孤儿') && s.MNY >= 7 && s.MNY <= 9, text: s => `你出生在城里一个殷实的家庭，是个${s.kid}。`, then: BIRTH_THEN });
ev('birth_normal', { age: [0, 0], must: 1, if: s => !s.has('孤儿') && s.MNY >= 4 && s.MNY <= 6, text: s => `你出生在一个普通的工薪家庭，是个${s.kid}。`, then: BIRTH_THEN });
ev('birth_poor', { age: [0, 0], must: 1, if: s => !s.has('孤儿') && s.MNY >= 1 && s.MNY <= 3, text: s => `你出生在偏远的小山村，家里只有几亩薄田。你是个${s.kid}。`, then: BIRTH_THEN });
ev('birth_vpoor', { age: [0, 0], must: 1, if: s => !s.has('孤儿') && s.MNY <= 0, text: s => `你出生在一个家徒四壁的家庭，父母为你的奶粉钱整夜发愁。你是个${s.kid}。`, then: BIRTH_THEN });
ev('birth_weak', { chain: 1, text: '你生下来就体弱多病，在保温箱里住了一个月。' });
ev('birth_chuanyue', { chain: 1, text: '你睁开眼，发现自己变成了婴儿。上辈子的记忆还清清楚楚。' });
ev('birth_waixing', { chain: 1, text: '你出生那晚，医院上空出现了一道奇怪的光，监控录像全部损坏。' });

ev('zhuazhou', { age: [1, 1], w: 4, fx: s => {
  const r = pickOne([['一本书', 'INT'], ['一把算盘', 'MNY'], ['一面小镜子', 'CHR'], ['一根鸡腿', 'STR'], ['奶奶的手机', 'SPR']]);
  s.chg({ [r[1]]: 1 }); return `周岁抓周，你一把抓住了${r[0]}。`;
} });
ev('walk', { age: [1, 2], text: '你学会了走路，第一天摔了十几跤。' });
ev('firstword', { age: [1, 2], fx: s => `你说出了人生第一个词：“${pickOne(['妈妈', '爸爸', '不要', '饭饭', '手机'])}”。` });
ev('weak_die', { age: [0, 4], w: 3, if: s => s.STR <= 0, text: '你在一场高烧中没能挺过来。', die: 1 });
ev('pneumonia', { age: [1, 6], w: s => s.STR < 4 ? 3 : 1, text: '你得了肺炎，在医院住了半个月。', eff: { STR: -1 } });
ev('dog', { age: [2, 8], text: '你被邻居家的大黄狗追了半条街，从此看见狗就绕道走。', eff: { SPR: -1 } });
ev('cartoon', { age: [2, 6], text: '你迷上了一部动画片，每天准时守在电视机前。', eff: { SPR: 1 } });
ev('kinder', { age: [3, 3], w: 3, if: s => !s.has('留守'), text: '你上幼儿园了，第一天哭得整栋楼都听得见。' });
ev('cute', { age: [1, 6], w: 2, if: s => s.CHR >= 7, text: '长辈们都说你长得像年画上的娃娃，见了你就往你兜里塞糖。', eff: { CHR: 1, SPR: 1 } });
ev('lost', { age: [2, 7], text: '你在集市上走丢了，被好心人送回了家。', eff: { SPR: -1 } });
ev('kidnap', { age: [3, 6], w: s => s.has('倒霉') ? 1.5 : 0.2, if: s => !s.has('孤儿'), text: '你在家门口被人贩子拐走，辗转卖到了千里之外的一户人家。', eff: { MNY: -2, SPR: -3 }, add: '被拐' });
ev('poem', { age: [3, 6], w: 2, if: s => s.INT >= 7, text: '你三岁就能背一百首唐诗，被亲戚们当成神童。', eff: { INT: 1 } });
ev('divorce_p', { age: [3, 12], w: 0.5, if: s => !s.has('孤儿'), fx: s => `你的父母离婚了，你跟着${pickOne(['妈妈', '爸爸'])}生活。`, eff: { SPR: -2 }, add: '单亲' });
ev('leftbehind', { age: [1, 6], w: 2, if: s => s.MNY <= 4 && !s.has('孤儿'), text: '父母去外地打工，你被留在老家跟爷爷奶奶生活。', eff: { SPR: -1 }, add: '留守' });
ev('adopt', { age: [2, 8], w: 3, if: s => s.has('孤儿'), text: '一对夫妇来到福利院，领养了你。你第一次有了自己的房间。', eff: { MNY: 2, SPR: 2 }, add: '被领养' });
ev('orphan_stay', { age: [7, 7], w: 5, if: s => s.has('孤儿') && !s.has('被领养'), text: '你一直没被领养，在福利院里学会了照顾比你小的孩子。', eff: { INT: 1, SPR: -1 } });
ev('stray_cat', { age: [3, 12], w: s => s.has('猫缘') ? 4 : 0.3, text: '一只流浪猫跟着你回了家，从此成了你最好的朋友。', eff: { SPR: 2 }, add: '有猫' });
ev('cy_kid', { age: [3, 6], w: 4, if: s => s.has('穿越'), text: '你在幼儿园用方程解出了老师的应用题，老师愣在原地。', eff: { INT: 1 } });
ev('wx_kid', { age: [4, 10], w: 4, if: s => s.has('外星'), text: '你常常半夜望着星空发呆，偶尔能听懂蟋蟀在说什么。', eff: { INT: 1 } });
ev('gs_kid', { age: [4, 10], w: 4, if: s => s.has('古神'), text: '你梦见一座沉在海底的城市，醒来后在墙上画满了奇怪的符号。', eff: { INT: 1, SPR: -1 } });
ev('swim', { age: [6, 14], w: s => s.has('谨慎') ? 0.1 : 0.5, text: '暑假里你偷偷跑去河里游泳，', then: [['drown_die', s => s.STR < 3], ['drown_ok']] });
ev('drown_die', { chain: 1, fatal: 1, text: '不幸溺水身亡。', die: 1 });
ev('drown_ok', { chain: 1, text: '差点被水冲走，幸好路过的大人把你捞了上来。', eff: { SPR: -1 } });
ev('chickenpox', { age: [4, 10], text: '你出了水痘，忍不住去抓，脸上留下了几个小坑。', eff: { CHR: -1 } });

ev('primary', { age: [6, 6], must: 1, if: s => !s.has('被拐'), fx: s => s.MNY >= 8 ? '你进了市里最好的私立小学，校服是定制的。' : s.MNY <= 2 ? '你每天走一个小时山路去村小上学。' : '你上小学了，背着新书包神气得不行。' });
ev('primary_kid', { age: [6, 6], must: 1, if: s => s.has('被拐'), text: '买下你的那户人家让你上了村里的小学，你渐渐忘了家乡的样子。' });
ev('monitor', { age: [7, 12], w: 2, if: s => s.INT >= 6 && s.CHR >= 5, text: '你被选为班长，每天负责喊“起立”。', eff: { SPR: 1 }, add: '班干部' });
ev('double100', { age: [7, 12], w: 2, if: s => s.INT >= 7, text: '你期末考了双百，奖状贴满了一面墙。', eff: { INT: 1, SPR: 1 } });
ev('fight', { age: [7, 14], text: '你和同学打了一架，被老师叫了家长。', eff: { STR: 1, SPR: -1 } });
ev('bullied', { age: [7, 15], w: s => s.STR <= 3 || s.CHR <= 2 ? 3 : 0.3, text: '你在学校被高年级的学生欺负，每天早上都不想出门。', eff: { SPR: -2 } });
ev('loveletter', { age: [9, 13], w: 2, if: s => s.CHR >= 6, text: '有人往你书包里塞了一封情书，你脸红了一整天。', eff: { SPR: 1 } });
ev('olympiad', { age: [9, 14], w: 2, if: s => s.INT >= 9, text: '你参加奥数竞赛拿了全国一等奖。', eff: { INT: 1 }, add: '竞赛' });
ev('piano', { age: [5, 12], w: 1.5, if: s => s.MNY >= 6, text: '父母给你报了钢琴班。', then: [['piano_good', s => s.has('艺术')], ['piano_bad']] });
ev('piano_good', { chain: 1, text: '你很有天分，十岁就考过了十级。', eff: { CHR: 1, INT: 1 } });
ev('piano_bad', { chain: 1, text: '你每天练琴两小时，弹得邻居天天来敲门。', eff: { SPR: -1 } });
ev('latiao', { age: [6, 12], text: '你用攒了一个月的零花钱买了一大包辣条，吃完拉了三天肚子。', eff: { SPR: 1, STR: -1 } });
ev('myopia', { age: [8, 15], if: s => s.INT >= 6 && !s.tal('jinshi'), text: '你天天躲在被窝里打着手电看书，眼睛近视了。', eff: { CHR: -1, INT: 1 } });
ev('farm', { age: [6, 14], w: 2, if: s => s.MNY <= 3, text: '放学后你要帮家里干农活：割猪草、喂鸡、挑水。', eff: { STR: 1, SPR: -1 } });
ev('skipgrade', { age: [7, 12], w: 2, if: s => s.INT >= 10, text: '你连跳两级，成了班上年纪最小的学生。', eff: { INT: 1 }, add: '跳级' });
ev('cat_old', { age: [10, 16], w: 2, if: s => s.has('有猫'), text: '你的猫老了，在一个午后安静地离开了。你哭了很久。', eff: { SPR: -2 } });
ev('netgame', { age: [9, 16], text: '你迷上了网络游戏，成绩一落千丈。', eff: { INT: -1, SPR: 1 }, add: '网瘾' });
ev('sportschool', { age: [8, 14], w: 4, if: s => s.has('运动'), text: '你被体校教练一眼相中，开始了专业训练。', eff: { STR: 2 }, add: '体校' });
ev('art_prize', { age: [6, 14], w: 4, if: s => s.has('艺术'), text: '你的画拿了全国少儿美术大赛金奖。', eff: { CHR: 1, SPR: 1 } });
ev('coder_kid', { age: [8, 14], w: 4, if: s => s.has('码农'), text: '你自学编程，写了一个能自动帮你写作业的程序。', eff: { INT: 2 } });
ev('lucky_kid', { age: [6, 14], w: 3, if: s => s.has('幸运'), text: '你在路边捡到一张没刮的彩票，刮出了五百块。', eff: { MNY: 1, SPR: 1 } });
ev('unlucky_kid', { age: [6, 14], w: 3, if: s => s.has('倒霉'), text: '你走在路上被楼上掉下的花盆砸中脑袋，缝了五针。', eff: { STR: -1, INT: -1 } });
ev('moving', { age: [5, 14], w: 0.6, if: s => s.MNY >= 3 && s.MNY <= 7 && !s.has('孤儿'), text: '家里在城里买了房，你转学去了新学校。', eff: { MNY: 1 } });
ev('homework', { age: [7, 14], text: '暑假最后一天，你通宵补完了所有作业。', eff: { SPR: -1 } });

ev('zhongkao', { age: [15, 15], must: 1, if: s => !s.has('辍学') && !s.has('练习生') && !s.has('美国') && !s.has('王室') && !s.has('石油'), text: '你参加了中考，', then: [['zk_top', s => s.INT >= 8], ['zk_ok', s => s.INT >= 5], ['zk_fail']] });
ev('zk_top', { chain: 1, text: '考进了市重点高中。', eff: { INT: 1 }, add: '重点高中' });
ev('zk_ok', { chain: 1, text: '上了一所普通高中。' });
ev('zk_fail', { chain: 1, text: '没考上高中，去了一所职业学校。', eff: { SPR: -1 }, add: '职校' });
ev('puberty', { age: [12, 15], text: '你进入了青春期，开始每天对着镜子研究发型。', eff: { CHR: 1 } });
ev('acne', { age: [13, 17], text: '你脸上长满了青春痘。', eff: { CHR: -1, SPR: -1 } });
ev('growtall', { age: [12, 16], if: s => s.STR >= 5, text: '你一年长高了十五厘米，裤子全短了一截。', eff: { STR: 1, CHR: 1 } });
ev('puppylove', { age: [13, 17], w: s => s.has('桃花') ? 3 : 1, if: s => s.CHR >= 6 && !s.has('孤星'), text: '你和同桌偷偷谈起了恋爱，', add: '早恋', eff: { SPR: 2 }, then: [['pl_caught', s => s.r(0.4)], ['pl_ok']] });
ev('pl_caught', { chain: 1, text: '被班主任抓了个正着，两边家长都被请到了学校。', eff: { SPR: -1 } });
ev('pl_ok', { chain: 1, text: '每天放学一起走一段路。' });
ev('teen_breakup', { age: [14, 18], w: 2, if: s => s.has('早恋'), text: '你们分手了，你在日记本上写满了伤感的句子。', eff: { SPR: -2 }, del: '早恋' });
ev('rebel', { age: [13, 16], text: '你进入了叛逆期，跟父母大吵一架后离家出走了一晚上。', eff: { SPR: -1 } });
ev('dropout', { age: [13, 16], w: 3, if: s => s.MNY <= 2 && s.INT <= 5, text: '家里实在供不起，你辍学去了南方的电子厂打工。', eff: { MNY: 1, SPR: -2 }, add: ['辍学', '工作', '打工'] });
ev('netcafe', { age: [13, 17], w: 2, if: s => s.has('网瘾'), text: '你逃课去网吧通宵，被班主任亲手从网吧里揪了出来。', eff: { INT: -1 } });
ev('baosong', { age: [16, 17], w: 5, if: s => s.has('竞赛') && s.INT >= 11, text: '你在国际奥赛中夺得金牌，被顶尖大学提前录取。', eff: { INT: 1, SPR: 2 }, add: ['保送', '大学', '名校'] });
ev('grind', { age: [16, 17], if: s => s.INT >= 6 && !s.has('职校'), text: '你每天五点起床背书，桌上的试卷堆得比人还高。', eff: { INT: 1, STR: -1 } });
ev('scout', { age: [14, 20], w: 3, if: s => s.CHR >= 10 && !s.has('练习生'), text: '你在街上被星探拦住，签约了一家经纪公司当练习生。', eff: { CHR: 1 }, add: '练习生' });
ev('national_team', { age: [15, 22], w: 4, if: s => s.has('体校') && s.STR >= 10, text: '你在全运会上打破了纪录，入选国家队。', eff: { STR: 1, SPR: 2 }, add: '国家队' });
ev('gs_book', { age: [13, 17], w: 4, if: s => s.has('古神'), text: '你在图书馆角落找到一本没有书名的古书。读完后，你整整三天没有说话。', eff: { INT: 2, SPR: -2 }, add: '禁书' });
ev('cy_exam', { age: [12, 17], w: 3, if: s => s.has('穿越'), text: '你凭前世记忆提前知道了考试题目，可惜前世你也没考好。', eff: { SPR: 1 } });
ev('confess', { age: [15, 17], if: s => s.CHR <= 4, text: '你鼓起勇气向暗恋的人表白，被当场拒绝了。', eff: { SPR: -2 } });

ev('gaokao', { age: [18, 18], must: 1, if: s => !s.has('辍学') && !s.has('职校') && !s.has('保送') && !s.has('练习生') && !s.has('修仙') && !s.has('美国') && !s.has('王室') && !s.has('石油'), text: '你参加了高考，',
  then: [['gk_top', s => s.INT >= 12], ['gk_good', s => s.INT >= 9], ['gk_ok', s => s.INT >= 6], ['gk_low', s => s.INT >= 4], ['gk_abroad', s => s.MNY >= 9], ['gk_fail']] });
ev('gk_top', { chain: 1, text: '考上了全国最好的大学，老家村口挂起了横幅。', eff: { SPR: 2 }, add: ['大学', '名校'], then: [['ch_major']] });
ev('gk_good', { chain: 1, text: '考上了一所重点大学。', eff: { SPR: 1 }, add: '大学', then: [['ch_major']] });
ev('gk_ok', { chain: 1, text: '考上了一所普通本科。', add: '大学', then: [['ch_major']] });
ev('gk_low', { chain: 1, text: '只考上了专科。', eff: { SPR: -1 }, add: ['大学', '专科'], then: [['ch_major']] });
ev('gk_abroad', { chain: 1, text: '分数惨不忍睹，父母花钱把你送出了国。', add: ['大学', '留学'] });
ev('gk_fail', { chain: 1, text: '落榜了。', eff: { SPR: -2 }, add: '落榜' });
ev('retake', { age: [19, 19], w: 4, if: s => s.has('落榜') && s.INT >= 4, text: '你复读了一年，第二次高考终于考上了大学。', eff: { INT: 1 }, add: '大学', del: '落榜' });
ev('vocational', { age: [18, 18], must: 1, if: s => s.has('职校'), text: '你从职业学校毕业，进工厂当了一名技术工人。', add: ['工作', '蓝领'] });
