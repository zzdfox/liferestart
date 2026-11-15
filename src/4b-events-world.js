// ===== 事件：美籍 / 王室 / 石油王 / 星二代 + 人生抉择 =====
// choices: [[按钮文字, 事件id], ...] 触发时暂停，等玩家选择
BIRTH_THEN.push(
  ['birth_us', s => s.has('美国')],
  ['birth_royal', s => s.has('王室')],
  ['birth_oil', s => s.has('石油')],
  ['birth_xiandi', s => s.has('仙帝')],
  ['birth_vamp', s => s.has('吸血鬼')],
  ['birth_star', s => s.has('星二代')],
);
ev('birth_us', { chain: 1, text: '地点是美国加州，你一出生就拿到了美国护照。' });
ev('birth_royal', { chain: 1, text: '准确地说，你出生在白金汉宫，是王位第七顺位继承人。' });
ev('birth_oil', { chain: 1, text: '你家在迪拜，后院的油田一眼望不到头。' });
ev('birth_xiandi', { chain: 1, text: '你降生那天天降异象，紫气东来三万里。' });
ev('birth_vamp', { chain: 1, text: '你生下来就长着两颗小尖牙，护士吓得差点没抱稳。' });
ev('birth_star', { chain: 1, text: '你爸妈都是当红明星，你出生第一天就上了热搜。' });

// --- 美籍 ---
const US = s => s.has('美国');
ev('us_football', { age: [14, 18], w: 2, if: s => US(s) && s.STR >= 7, text: '你成了学校橄榄球队的四分卫，整个小镇都认识你。', eff: { STR: 1, SPR: 1 } });
ev('us_prom', { age: [16, 18], w: 2, if: US, fx: s => s.CHR >= 7
  ? (s.chg({ CHR: 1, SPR: 2 }), `你在毕业舞会上被选为舞会${s.gender === '男' ? '国王' : '皇后'}。`)
  : (s.chg({ SPR: -1 }), '你在毕业舞会上没找到舞伴，在角落里吃了一晚上薯片。') });
ev('us_sat', { age: [17, 17], must: 1, if: s => US(s) && !s.has('辍学') && !s.has('练习生') && !s.has('修仙'), text: '你参加了SAT考试，', then: [['us_ivy', s => s.INT >= 10], ['us_state', s => s.INT >= 6], ['us_cc']] });
ev('us_ivy', { chain: 1, text: '被一所常春藤名校录取。', eff: { SPR: 2 }, add: ['大学', '名校'], then: [['ch_major']] });
ev('us_state', { chain: 1, text: '去了一所州立大学。', add: '大学', then: [['ch_major']] });
ev('us_cc', { chain: 1, text: '去了社区大学。', add: ['大学', '专科'] });
ev('us_debt', { age: [22, 30], w: 3, if: s => US(s) && s.has('大学'), text: '你毕业时背着二十万美元的助学贷款。', eff: { MNY: -2, SPR: -1 } });
ev('us_bill', { age: [18, 70], w: 1.5, if: US, text: '你去急诊缝了三针，收到一张三万美元的账单。', eff: { MNY: -2, SPR: -2 } });
ev('us_valley', { age: [22, 35], w: 3, if: s => US(s) && s.INT >= 8 && !s.has('大厂'), text: '你进了硅谷一家科技公司，拿了一大把期权。', eff: { MNY: 2 }, add: ['工作', '大厂'] });
ev('us_vegas', { age: [21, 60], if: US, text: '你去拉斯维加斯玩老虎机，', then: [['vegas_win', s => s.has('幸运') || s.r(0.12)], ['vegas_lose']] });
ev('vegas_win', { chain: 1, text: '中了头奖！硬币哗啦啦流了一地。', eff: { MNY: 5, SPR: 3 }, add: '中彩票' });
ev('vegas_lose', { chain: 1, text: '输光了回家的油钱。', eff: { MNY: -1 } });
ev('us_hollywood', { age: [18, 35], w: 3, if: s => US(s) && s.CHR >= 10, text: '你在好莱坞试镜成功，主演了一部超级大片。', eff: { MNY: 3, SPR: 2 }, add: ['工作', '明星'] });
ev('us_robbery', { age: [18, 60], w: 0.3, if: US, text: '你在加油站撞上了持枪抢劫，', then: [['rob_die', s => s.STR <= 3], ['rob_ok']] });
ev('rob_die', { chain: 1, fatal: 1, text: '没能活着离开。', die: 1 });
ev('rob_ok', { chain: 1, text: '乖乖交出钱包，捡回一条命。', eff: { SPR: -2 } });
ev('us_election', { age: [35, 70], w: 2, if: s => US(s) && s.INT >= 10 && s.CHR >= 9 && s.MNY >= 8, text: '你宣布参选美国总统，', then: [['potus', s => s.CHR >= 12 || s.r(0.45)], ['potus_lose']] });
ev('potus', { chain: 1, text: '以微弱优势赢下大选，入主白宫。', eff: { SPR: 3 }, add: ['元首', '美国总统'] });
ev('potus_lose', { chain: 1, text: '在初选中惨败。', eff: { SPR: -2 } });
ev('us_turkey', { age: [20, 60], if: US, text: '感恩节你把火鸡烤糊了，全家只好去吃了麦当劳。', eff: { SPR: 1 } });

// --- 英国王室 ---
const ROYAL = s => s.has('王室');
ev('royal_corgi', { age: [5, 12], w: 2, if: ROYAL, text: '你养了三只柯基，它们每天在宫殿走廊里赛跑。', eff: { SPR: 2 } });
ev('royal_eton', { age: [13, 13], must: 1, if: ROYAL, text: '你进了伊顿公学，同学不是王子就是首相的孩子。', eff: { INT: 1 } });
ev('royal_uni', { age: [18, 18], must: 1, if: ROYAL, text: '你进了牛津大学读历史，身后永远跟着两个保镖。', eff: { INT: 1 }, add: '名校' });
ev('royal_paparazzi', { age: [16, 35], w: 2, if: ROYAL, text: '狗仔队拍到你在酒吧喝得烂醉，照片登上了全英国的头条。', eff: { SPR: -2 } });
ev('royal_wedding', { age: [24, 36], w: 4, if: s => ROYAL(s) && !s.has('已婚'), text: '你举行了盛大的皇家婚礼，全球二十亿人收看了直播。', eff: { SPR: 3 }, add: '已婚' });
ev('royal_choice', { age: [25, 40], w: 1.5, if: ROYAL, text: '你越来越受不了王室的繁文缛节。', choices: [['留下来，履行王室职责', 'royal_stay'], ['退出王室，搬去加州', 'royal_quit']] });
ev('royal_stay', { chain: 1, text: '你咬咬牙留了下来。', eff: { SPR: -1 } });
ev('royal_quit', { chain: 1, text: '你宣布退出王室，搬去了加州，开始写回忆录。', eff: { MNY: -3, SPR: 3 }, add: ['美国', '退出王室'], del: '王室' });
ev('royal_crown', { age: [40, 75], w: 1.2, if: ROYAL, text: '排在你前面的继承人接二连三放弃了王位。', then: [['crowned', s => s.r(0.6)], ['notcrowned']] });
ev('crowned', { chain: 1, fx: s => `你在威斯敏斯特教堂加冕，成为了英国${s.gender === '男' ? '国王' : '女王'}。`, eff: { SPR: 3 }, add: ['国王', '元首'] });
ev('notcrowned', { chain: 1, text: '最后关头冒出一位远房表亲，王冠和你擦肩而过。', eff: { SPR: -2 } });

// --- 中东石油王 ---
const OIL = s => s.has('石油');
ev('oil_lion', { age: [5, 15], w: 2, if: OIL, text: '你的宠物是一只狮子，它每天坐着劳斯莱斯出门兜风。', eff: { SPR: 2 } });
ev('oil_uni', { age: [18, 18], must: 1, if: s => OIL(s) && !ROYAL(s), text: '你被一所常春藤大学录取了，你家刚给学校捐了一栋楼。', add: '名校' });
ev('oil_car', { age: [18, 30], w: 2, if: OIL, text: '你把金色跑车随手停在伦敦街头，罚单收了一抽屉。', eff: { SPR: 1, MNY: -1 } });
ev('oil_island', { age: [25, 50], w: 2, if: OIL, text: '你买下了一座人工岛，用你的名字命名。', eff: { SPR: 2 } });
ev('oil_club', { age: [30, 60], w: 2, if: s => OIL(s) && s.MNY >= 10, text: '你买下了一支英超球队，球迷在看台上举着你的画像。', eff: { SPR: 2 }, add: '富豪' });
ev('oil_dry', { age: [40, 65], w: 0.6, if: OIL, text: '你家的油田枯竭了，管家们一个接一个辞职。', eff: { MNY: -5, SPR: -3 } });

// --- 星二代 ---
ev('xed_variety', { age: [5, 12], w: 2, if: s => s.has('星二代'), text: '你跟着爸妈上了一档亲子综艺，一夜之间全国都认识你了。', eff: { CHR: 1, SPR: 1 } });
ev('xed_trainee', { age: [12, 16], w: 6, if: s => s.has('星二代') && !s.has('练习生'), text: '你签进了爸妈的经纪公司当练习生。', add: '练习生' });
ev('xed_scandal', { age: [16, 30], w: 2, if: s => s.has('星二代'), text: '你被曝在片场耍大牌，全网骂了你三天三夜。', eff: { SPR: -2 } });

// ===== 人生抉择 =====
const FREE = s => !s.has('修仙');
ev('ch_major', { chain: 1, text: '填志愿时你犹豫了很久，最后选了', choices: [['计算机', 'maj_cs'], ['土木工程', 'maj_civil'], ['金融', 'maj_fin'], ['哲学', 'maj_phi']] });
ev('maj_cs', { chain: 1, text: '计算机。', eff: { INT: 1 }, add: '码农' });
ev('maj_civil', { chain: 1, text: '土木工程。', eff: { STR: 1 }, add: '土木' });
ev('maj_fin', { chain: 1, text: '金融。', eff: { MNY: 1 } });
ev('maj_phi', { chain: 1, text: '哲学。你学会了用三种方式解释“我是谁”。', eff: { INT: 2, MNY: -1 } });
ev('civil_site', { age: [23, 35], w: 3, if: s => s.has('土木'), text: '你在工地上晒得黝黑，望着远方的塔吊思考人生。', eff: { STR: 1, SPR: -1 } });

ev('ch_confess', { age: [16, 30], if: s => SINGLE(s) && !s.has('恋爱') && !s.has('早恋'), text: '一个你不太熟的人向你表白了。', choices: [['答应', 'cf_yes'], ['拒绝', 'cf_no']] });
ev('cf_yes', { chain: 1, text: '你答应了。', then: [['cf_good', s => s.r(0.55)], ['cf_bad']] });
ev('cf_good', { chain: 1, text: '对方对你特别好，你们越来越亲密。', eff: { SPR: 2 }, add: '恋爱' });
ev('cf_bad', { chain: 1, text: '三个月后你发现，对方同时在和四个人交往。', eff: { SPR: -3 } });
ev('cf_no', { chain: 1, text: '你礼貌地拒绝了。', then: [['cf_rich', s => s.r(0.3)], ['cf_fine']] });
ev('cf_rich', { chain: 1, text: '多年后你在新闻里看到，对方成了亿万富翁。', eff: { SPR: -1 } });
ev('cf_fine', { chain: 1, text: '对方转头就和你室友在一起了。' });

ev('ch_offer', { age: [22, 32], w: 1.5, if: s => s.has('工作') && !s.has('大厂') && !s.has('公务员') && !s.has('明星') && !s.has('打工') && !s.has('蓝领'), text: '你同时拿到了两份录用通知：', choices: [['大厂，钱多但996', 'of_big'], ['国企，钱少但稳定', 'of_soe'], ['创业公司，给期权', 'of_su']] });
ev('of_big', { chain: 1, text: '你选了大厂。', eff: { MNY: 2, STR: -1 }, add: '大厂' });
ev('of_soe', { chain: 1, text: '你选了国企，每天准点下班。', eff: { SPR: 1 }, add: '公务员' });
ev('of_su', { chain: 1, text: '你加入了一家创业公司，', then: [['of_su_win', s => s.r(s.has('幸运') ? 0.5 : 0.2)], ['of_su_lose']] });
ev('of_su_win', { chain: 1, text: '三年后公司上市，你的期权值几千万。', eff: { MNY: 5 }, add: '富豪' });
ev('of_su_lose', { chain: 1, text: '两年后公司倒闭，期权成了废纸。', eff: { SPR: -1 } });

ev('ch_wallet', { age: [10, 60], w: 0.8, if: FREE, text: '你在路边捡到一个钱包，里面有两万块现金。', choices: [['交给警察', 'wl_return'], ['揣进自己兜里', 'wl_keep']] });
ev('wl_return', { chain: 1, text: '失主是一位企业家，非要塞给你一面锦旗和一个大红包。', eff: { SPR: 2, MNY: 1 }, add: '拾金不昧' });
ev('wl_keep', { chain: 1, text: '', then: [['wl_caught', s => s.r(0.4)], ['wl_ok']] });
ev('wl_caught', { chain: 1, text: '第二天，警察拿着监控录像找上了门。', eff: { SPR: -3, MNY: -1 } });
ev('wl_ok', { chain: 1, text: '你心虚地花掉了这笔钱，好几个月睡不踏实。', eff: { MNY: 1, SPR: -1 } });

ev('ch_house', { age: [26, 40], if: s => FREE(s) && s.MNY >= 4 && !s.has('有房'), text: '房价看着还要涨，你要不要咬牙上车？', choices: [['掏空六个钱包买房', 'hs_buy'], ['继续租房', 'hs_rent']] });
ev('hs_buy', { chain: 1, text: '你买了房。', add: '有房', then: [['hs_up', s => s.r(0.5)], ['hs_down']] });
ev('hs_up', { chain: 1, text: '两年后房价翻了一倍。', eff: { MNY: 3, SPR: 1 } });
ev('hs_down', { chain: 1, text: '第二年房价腰斩，你的工资全拿去还了房贷。', eff: { MNY: -2, SPR: -2 } });
ev('hs_rent', { chain: 1, text: '你继续租房，心里很踏实。', eff: { SPR: 1 } });

ev('ch_marry', { age: [28, 35], w: 1.5, if: s => SINGLE(s) && !s.has('离婚') && !s.has('不婚'), text: '家里催婚催得越来越紧。', choices: [['去相亲，早点结婚', 'mr_yes'], ['坚持单身', 'mr_no']] });
ev('mr_yes', { chain: 1, text: '你和相亲对象闪婚了，', add: '已婚', then: [['mr_good', s => s.r(0.5)], ['mr_meh']] });
ev('mr_good', { chain: 1, text: '没想到越过越甜。', eff: { SPR: 2 } });
ev('mr_meh', { chain: 1, text: '日子过得不咸不淡。' });
ev('mr_no', { chain: 1, text: '你决定一个人也要过得精彩。', eff: { SPR: 1 }, add: '不婚' });

ev('ch_coin', { age: [20, 35], w: 0.8, if: s => FREE(s) && !s.has('穿越'), text: '朋友神神秘秘地推荐你买一种叫“狗狗币”的东西。', choices: [['梭哈', 'coin_all'], ['不买', 'coin_no']] });
ev('coin_all', { chain: 1, text: '你把积蓄全投了进去。', then: [['coin_moon', s => s.r(s.has('幸运') ? 0.6 : 0.25)], ['coin_zero']] });
ev('coin_moon', { chain: 1, text: '它涨了一百倍！你辞职环游世界去了。', eff: { MNY: 5 }, add: '富豪' });
ev('coin_zero', { chain: 1, text: '它归零了，你吃了半年泡面。', eff: { MNY: -3, SPR: -2 } });
ev('coin_no', { chain: 1, fx: s => s.r(0.3) ? (s.chg({ SPR: -2 }), '后来它涨了一百倍，你一想起来就睡不着。') : (s.chg({ SPR: 1 }), '后来它归零了，你暗自庆幸。') });

ev('ch_quit', { age: [30, 45], if: s => s.has('工作') && s.SPR <= 5 && !s.has('退休'), text: '你对工作厌倦透了。', choices: [['裸辞去旅行', 'qt_go'], ['再忍忍', 'qt_stay']] });
ev('qt_go', { chain: 1, text: '你背着包走了三十个国家，回来后整个人都变了。', eff: { SPR: 3, MNY: -2 }, del: '大厂' });
ev('qt_stay', { chain: 1, text: '你继续上班，每天在工位上数天花板。', eff: { SPR: -1, MNY: 1 } });

ev('ch_pill', { age: [60, 90], w: 0.5, if: FREE, text: '一个游方道士塞给你一颗“长生不老丹”。', choices: [['吃下去', 'pl_eat'], ['扔掉', 'pl_toss']] });
ev('pl_eat', { chain: 1, text: '你一口吞了下去。', then: [['pl_young', s => s.r(0.15)], ['pl_sick']] });
ev('pl_young', { chain: 1, text: '你真的返老还童了，满头白发一夜变黑！', eff: { STR: 3, CHR: 2 }, add: '返老还童', fx: s => { s.life += 30; } });
ev('pl_sick', { chain: 1, text: '然后拉了三天肚子。', eff: { STR: -1 } });
ev('pl_toss', { chain: 1, text: '你把它扔进了垃圾桶。第二天，那个道士上了法制新闻。', eff: { SPR: 1 } });

ev('ch_crow', { age: [6, 12], w: 0.4, text: '放学路上，一只会说话的乌鸦拦住你，问你想要什么。', choices: [['变聪明', 'cr_int'], ['变好看', 'cr_chr'], ['要好多钱', 'cr_mny']] });
ev('cr_int', { chain: 1, text: '乌鸦塞给你一本练习册，飞走了。', eff: { INT: 1 } });
ev('cr_chr', { chain: 1, text: '乌鸦用嘴给你梳了个头，还挺好看。', eff: { CHR: 1 } });
ev('cr_mny', { chain: 1, text: '乌鸦叼来一枚一块钱硬币，飞走了。', eff: { SPR: 1 } });
