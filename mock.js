// mock.js — 唯一数据源：三档昨晚战况 + 翌日恢复航线
// 节点 icon 字段对应 index.html 内联 SVG sprite 的 symbol id（#i-xxx）
// gain 为该行动的「今日恢复力」增量（%），同一条航线内合计 100
const DB = {
  updatedAt: '2026-10-25 08:00',
  conditions: [
    {
      id: 'light', lv: 'LV.1', name: '小熬怡情', sub: '熬到 01:00',
      icon: 'bed', color: '#00e5ff', rgb: '0,229,255',
      balance: 70, note: '睡眠余额尚在，恢复轻松'
    },
    {
      id: 'heavy', lv: 'LV.2', name: '重度阵亡', sub: '熬到 03:00',
      icon: 'coffee', color: '#ff3ea5', rgb: '255,62,165',
      balance: 40, note: '明显透支，需要认真回血'
    },
    {
      id: 'allnighter', lv: 'MAX', name: '通宵爆肝', sub: '直接没睡',
      icon: 'sun', color: '#ffd60a', rgb: '255,214,10',
      balance: 0, note: '余额清零，今日主旋律：止损'
    }
  ],
  plans: {
    light: {
      id: 'light',
      name: '轻度恢复航线',
      code: 'NR-R1',
      slept: '01:00', debt: '1.5 小时', tonight: '22:30',
      tonightWhy: '比昨晚提前 2.5 小时躺下，把睡眠债连本带息还清。',
      darkCircle: '今晚睡够，黑眼圈明日基本消退。',
      verdict: '轻度透支，科学止损后基本无损。你与床的关系，仍有救。',
      end: { time: '22:30', title: '修复入箱', desc: '比昨晚提前 2.5 小时躺下。今晚的睡眠，就是明天的回血包。' },
      nodes: [
        {
          time: '07:30', seg: '晨间重启', icon: 'alarm-clock', title: '固定闹钟，只此一次', gain: 15,
          teaser: '昨晚欠的觉，别想赖账到中午。',
          detail: '定 07:30 就 07:30 起。补觉可以，但起床时间浮动别超过 1 小时——固定起床时间，比固定入睡时间更能稳住生物钟。',
          tip: '生物钟靠「起床锚点」校准：稳住起床，就稳住了全天节律。',
          chips: [
            { type: 'heal', icon: 'battery-charging', text: '回血 +15%' },
            { type: 'info', text: '节律锚点' }
          ]
        },
        {
          time: '08:00', seg: '晨间重启', icon: 'sun', title: '拉开窗帘晒 10 分钟', gain: 18,
          teaser: '别摸手机，先摸窗帘。',
          detail: '晨光会关掉褪黑素开关，通知身体：白天模式启动。阴天也有效——窗外的光亮度是室内灯的好几倍。',
          tip: '10 分钟晨光，约等于给生物钟按了一次每日重置键。',
          chips: [
            { type: 'heal', icon: 'battery-charging', text: '回血 +18%' },
            { type: 'info', text: '褪黑素开关' }
          ]
        },
        {
          time: '08:30', seg: '上午续航', icon: 'utensils', title: '高蛋白早餐 + 咖啡一支', gain: 15,
          teaser: '鸡蛋牛奶走起，咖啡今天仅此一支。',
          detail: '咖啡因半衰期约 5 小时——下午那杯咖啡，是偷走你今晚睡眠的小偷。14:00 之后，咖啡因谢绝入内。',
          tip: '咖啡因半衰期约 5 小时，14:00 后自动关闸。',
          chips: [
            { type: 'heal', icon: 'battery-charging', text: '回血 +15%' },
            { type: 'info', text: '咖啡因半衰期' }
          ]
        },
        {
          time: '12:30', seg: '午间回血', icon: 'utensils', title: '午餐七分饱', gain: 12,
          teaser: '别精准投喂下午的困意。',
          detail: '大碳水中午下肚，下午两点准时昏迷。蛋白质和蔬菜打底，主食减半，饭后溜达十分钟。',
          tip: '高 GI 大餐会让餐后困倦直接翻倍。',
          chips: [
            { type: 'heal', icon: 'battery-charging', text: '回血 +12%' },
            { type: 'info', text: '餐后血糖' }
          ]
        },
        {
          time: '13:15', seg: '午间回血', icon: 'battery-charging', title: '20 分钟午睡，闹钟定死', gain: 22,
          teaser: '超过 30 分钟，醒来反而更昏。',
          detail: '躺平 20 分钟必须起——再睡就坠入深睡，被打断后获得「睡眠惰性」debuff，比不睡还惨。20 分钟刚好清缓存、不加载新剧情。',
          tip: '约 20 分钟小睡：提升警觉，又不坠入深睡。',
          chips: [
            { type: 'heal', icon: 'battery-charging', text: '回血 +22%' },
            { type: 'info', text: '睡眠惰性' }
          ]
        },
        {
          time: '19:00', seg: '傍晚降速', icon: 'activity', title: '轻度活动 30 分钟', gain: 18,
          teaser: '散步拉伸都行，就是别上 HIIT。',
          detail: '睡眠不足时皮质醇本来就高，再猛练等于给压力贷款加杠杆。今天练柔韧，别练强度。',
          tip: '缺觉日：练强度不如练柔韧，受伤风险更低。',
          chips: [
            { type: 'heal', icon: 'battery-charging', text: '回血 +18%' },
            { type: 'info', text: '皮质醇' }
          ]
        }
      ]
    },
    heavy: {
      id: 'heavy',
      name: '重度恢复航线',
      code: 'NR-R2',
      slept: '03:00', debt: '4 小时', tonight: '22:00',
      tonightWhy: '睡眠债先还大头，尾款交给周末，别试图一天还完。',
      darkCircle: '认真执行两天早睡，约 48 小时自然淡出。',
      verdict: '检测到重度透支。好消息：按航线走，今晚就能止住血。',
      end: { time: '22:00', title: '修复入箱', desc: '手机放客厅充电——物理隔离，永远比意志力可靠。' },
      nodes: [
        {
          time: '08:00', seg: '晨间重启', icon: 'alarm-clock', title: '闹钟只准按掉一次', gain: 10,
          teaser: '回笼觉是甜毒药：再睡 20 分钟，昏 2 小时。',
          detail: '第二次闹钟响必须起。回笼觉容易一头扎进深睡，被打断后睡惰性直接拉满，起床像被人从水里捞出来。',
          tip: '深睡中断 = 睡眠惰性，昏感 ×2。',
          chips: [
            { type: 'heal', icon: 'battery-charging', text: '回血 +10%' },
            { type: 'info', text: '睡眠惰性' }
          ]
        },
        {
          time: '08:20', seg: '晨间重启', icon: 'sun', title: '全屋开灯，窗边晒光', gain: 15,
          teaser: '光照是今天最免费的回血药，越早吃越有效。',
          detail: '把屋里亮成白昼，人凑到窗边站十分钟。有条件直接出门两圈——窗外的光，永远是室内灯的高配版。',
          tip: '光照强度：自然光远高于室内灯，能出门就不隔窗。',
          chips: [
            { type: 'heal', icon: 'battery-charging', text: '回血 +15%' },
            { type: 'info', text: '光照疗法' }
          ]
        },
        {
          time: '09:00', seg: '上午续航', icon: 'utensils', title: '高蛋白早餐 + 咖啡一号', gain: 12,
          teaser: '先吃再喝，咖啡不空腹。',
          detail: '鸡蛋管够，豆浆牛奶二选一。咖啡今天限量两支，这是第一支，第二支要间隔 4 小时以上——并且 14:00 后一律谢客。',
          tip: '空腹咖啡因更伤胃，提神效果也更差。',
          chips: [
            { type: 'heal', icon: 'battery-charging', text: '回血 +12%' },
            { type: 'info', text: '咖啡因配额' }
          ]
        },
        {
          time: '11:30', seg: '上午续航', icon: 'droplet', title: '咖啡因关闸仪式', gain: 12,
          teaser: '此刻不关闸，今晚大脑继续蹦迪。',
          detail: '11:30 之后，咖啡、奶茶、可乐全部谢客，白水顶上。倒推 5 小时半衰期，现在关闸，23:00 你的神经系统才能下夜班。',
          tip: '下午的咖啡因，就是今晚失眠的定金。',
          chips: [
            { type: 'heal', icon: 'battery-charging', text: '回血 +12%' },
            { type: 'info', text: '半衰期倒推' }
          ]
        },
        {
          time: '13:00', seg: '午间回血', icon: 'battery-charging', title: '25 分钟午睡，26 分钟必须起', gain: 22,
          teaser: '今天格外困，所以格外要定死闹钟。',
          detail: '比平时多给 5 分钟额度，闹钟音量调到最大。缺觉日午睡收益最高，但也最容易坠入深睡——深睡边缘的 5 分钟，值得一场暴力唤醒。',
          tip: '睡眠不足日小睡收益最高，坠入深睡的风险也最高。',
          chips: [
            { type: 'heal', icon: 'battery-charging', text: '回血 +22%' },
            { type: 'info', text: '限时充电' }
          ]
        },
        {
          time: '15:30', seg: '下午稳态', icon: 'activity', title: '起身走 5 分钟 + 喝水 300ml', gain: 14,
          teaser: '大脑 75% 是水，别让它泡在浓缩咖啡里上班。',
          detail: '每坐一小时就起来晃一圈。轻度脱水就会明显放大疲劳感——你以为是困，其实有一半是渴。',
          tip: '轻度脱水即可显著放大疲劳感，先喝水再喊累。',
          chips: [
            { type: 'heal', icon: 'battery-charging', text: '回血 +14%' },
            { type: 'info', text: '补水止损' }
          ]
        },
        {
          time: '19:30', seg: '傍晚降速', icon: 'droplet', title: '热水澡，水温别烫', gain: 15,
          teaser: '体温先升后降，是身体认识的「入睡信号」。',
          detail: '睡前 90 分钟洗个热水澡，洗完体温自然回落，睡意跟着上线。另外今天不练力量——缺觉时肌肉和反应都打折，受伤概率翻倍。',
          tip: '睡前 90 分钟热水澡：借体温曲线助眠。',
          chips: [
            { type: 'heal', icon: 'battery-charging', text: '回血 +15%' },
            { type: 'info', text: '体温曲线' }
          ]
        }
      ]
    },
    allnighter: {
      id: 'allnighter',
      name: '通宵止损航线',
      code: 'NR-R3',
      slept: '没睡', debt: '7 小时', tonight: '21:30',
      tonightWhy: '通宵的债一天还不起，但今晚 21:30 躺下，就是在重启整个系统。',
      darkCircle: '遮瑕膏先顶一晚，连续三天早睡才有明显消退。',
      verdict: '通宵无法被完全补救，只能被聪明地止损。今晚 21:30，不见不散。',
      end: { time: '21:30', title: '提前入箱 · 战略性躺平', desc: '今晚不是熬夜的反面，是通宵的解药。' },
      nodes: [
        {
          time: '08:00', seg: '晨间重启', icon: 'bed', title: '补觉 90 分钟，封顶', gain: 15,
          teaser: '一个完整睡眠周期的量，多一分钟都是负债。',
          detail: '允许补觉，但定死 90 分钟——正好一个完整周期。超过就会坠入深睡，醒来自带「宿醉感」皮肤。10:00 前必须见到太阳。',
          tip: '按 90 分钟周期补觉，醒来正好落在浅睡层。',
          chips: [
            { type: 'heal', icon: 'battery-charging', text: '回血 +15%' },
            { type: 'info', text: '睡眠周期' }
          ]
        },
        {
          time: '10:00', seg: '晨间重启', icon: 'sun', title: '冷水洗脸 + 出门晒太阳', gain: 12,
          teaser: '今天的阳光是主药，剂量：至少 15 分钟。',
          detail: '冷水洗脸关掉「昨晚模式」，出门走两步换换气。光照加低温，是重启唤醒度的黄金组合——顺便把熬夜的浑浊之气从肺里换出去。',
          tip: '光照 + 轻活动，是提升唤醒度最便宜的处方。',
          chips: [
            { type: 'heal', icon: 'battery-charging', text: '回血 +12%' },
            { type: 'info', text: '唤醒组合拳' }
          ]
        },
        {
          time: '11:00', seg: '上午续航', icon: 'utensils', title: '迟到的早餐，高蛋白优先', gain: 10,
          teaser: '是的，你今天还有早餐。',
          detail: '通宵后身体疯狂想吃糖，但你要给它蛋白加复合碳水的组合拳。鸡蛋、燕麦、酸奶都行——血糖稳住，下午才不会断崖。',
          tip: '睡眠剥夺会放大对高糖食物的渴望，警惕甜品柜。',
          chips: [
            { type: 'heal', icon: 'battery-charging', text: '回血 +10%' },
            { type: 'info', text: '食欲骗局' }
          ]
        },
        {
          time: '13:00', seg: '午间回血', icon: 'coffee', title: '今天唯一一杯咖啡', gain: 10,
          teaser: '现在喝，13:00 后与咖啡因永别。',
          detail: '今天额度只有一杯，上午用掉。多喝一杯，都是向今晚的睡眠放高利贷——而你已经负债累累了。',
          tip: '通宵日咖啡因额度：1 杯，上午用掉，下午清零。',
          chips: [
            { type: 'heal', icon: 'battery-charging', text: '回血 +10%' },
            { type: 'info', text: '最后一杯' }
          ]
        },
        {
          time: '14:00', seg: '下午稳态', icon: 'laptop', title: '只排机械性工作', gain: 12,
          teaser: '重大决定一律缓——你的前额叶已经下班了。',
          detail: '睡眠剥夺 24 小时，认知水平约等于醉酒（真有研究这么比）。今天别签合同、别做大决定——别为难一个正在带病加班的大脑。',
          tip: '通宵后的判断力显著下降，重要决定推迟到明天。',
          chips: [
            { type: 'heal', icon: 'battery-charging', text: '回血 +12%' },
            { type: 'info', text: '认知保护' }
          ]
        },
        {
          time: '18:00', seg: '傍晚降速', icon: 'sunset', title: '提前收工，路上晒夕阳', gain: 10,
          teaser: '今天不卷，卷也卷不动。',
          detail: '傍晚的自然光会帮生物钟标记「黄昏」，让褪黑素在正确的时间上线。顺路买点清淡的晚饭，今天全天不许出现第三杯咖啡。',
          tip: '傍晚光照帮助褪黑素准点上班，入睡更顺。',
          chips: [
            { type: 'heal', icon: 'battery-charging', text: '回血 +10%' },
            { type: 'info', text: '黄昏标记' }
          ]
        },
        {
          time: '19:30', seg: '夜间修复', icon: 'utensils', title: '清淡晚餐，零咖啡因', gain: 10,
          teaser: '今晚肠胃也要早下班。',
          detail: '粥、青菜、少量蛋白。大鱼大肉会拖长消化时间，核心体温降不下来，入睡就跟着推迟——今晚最贵的是时间。',
          tip: '晚餐过饱 → 核心体温难降 → 入睡延迟。',
          chips: [
            { type: 'heal', icon: 'battery-charging', text: '回血 +10%' },
            { type: 'info', text: '减负晚餐' }
          ]
        },
        {
          time: '21:00', seg: '夜间修复', icon: 'droplet', title: '热水澡 + 手机出卧室', gain: 21,
          teaser: '卧室只留你、枕头，和一盏暗灯。',
          detail: '热水澡洗完，手机去客厅充电。21:30 躺平，允许自己废掉这一晚——这不是摆烂，这是重启整个系统的战略部署。',
          tip: '通宵后的早睡不是认输，是最强力的止损。',
          chips: [
            { type: 'heal', icon: 'battery-charging', text: '回血 +21%' },
            { type: 'info', text: '战略躺平' }
          ]
        }
      ]
    }
  }
};

// ===== 定制化：昨夜行为 → 加项节点 / 结算提醒 =====
DB.actions = [
  { id: 'coffee', name: '咖啡因续命', icon: 'coffee' },
  { id: 'snack',  name: '深夜放毒',   icon: 'flame' },
  { id: 'game',   name: '连夜开黑',   icon: 'gamepad-2' },
  { id: 'ddl',    name: '赶 DDL',     icon: 'laptop' },
  { id: 'emo',    name: '深夜 emo',   icon: 'frown' },
  { id: 'scroll', name: '短视频漩涡', icon: 'smartphone' }
];

// 每个行为对应一枚「定制加项」节点（时间槽已避开三条基础航线的既有节点）
DB.tagNodes = {
  coffee: {
    time: '10:30', seg: '上午续航', icon: 'droplet', title: '水化冲洗计划', gain: 10,
    teaser: '多喝 500ml 水，帮身体代谢昨晚的咖啡因。',
    detail: '咖啡因走肾脏代谢，水就是它的专车。今天主动补水，残余药效会提前下班——顺便治治你「渴了当饿」的老毛病。',
    tip: '主动补水能明显加快咖啡因的清除节奏。',
    chips: [
      { type: 'heal', icon: 'battery-charging', text: '回血 +10%' },
      { type: 'custom', text: '定制加项' }
    ]
  },
  snack: {
    time: '16:30', seg: '下午稳态', icon: 'utensils', title: '肠胃减负时段', gain: 10,
    teaser: '昨晚的烧烤还在肠胃里值夜班呢。',
    detail: '今晚主食自动减半，蛋白质选清淡的——鱼、鸡胸、豆腐都行。给加班一整晚的肠胃放个假，晚上 8 点后厨房关闭。',
    tip: '晚餐减量 + 提前，是最快的「肠胃回血」方式。',
    chips: [
      { type: 'heal', icon: 'battery-charging', text: '回血 +10%' },
      { type: 'custom', text: '定制加项' }
    ]
  },
  game: {
    time: '20:30', seg: '夜间修复', icon: 'activity', title: '肩颈松绑 5 分钟', gain: 10,
    teaser: '连跪的怨气，全堆在斜方肌上。',
    detail: '靠墙收下巴、耸肩画圈各 10 次，再热敷脖子 3 分钟。昨晚僵掉的颈椎今天必须松绑，不然明天的头疼会准时到账。',
    tip: '颈肩放松能显著缓解紧张性头痛。',
    chips: [
      { type: 'heal', icon: 'battery-charging', text: '回血 +10%' },
      { type: 'custom', text: '定制加项' }
    ]
  },
  ddl: {
    time: '16:00', seg: '下午稳态', icon: 'route', title: '离线散步 15 分钟', gain: 10,
    teaser: 'DDL 交卷了，大脑还在超频。',
    detail: '不带手机走 15 分钟，让注意力和血压一起落地。走完你会发现：刚才觉得天塌的事，其实只是「很急」而已。',
    tip: '低强度步行是恢复专注力最快的方式之一。',
    chips: [
      { type: 'heal', icon: 'battery-charging', text: '回血 +10%' },
      { type: 'custom', text: '定制加项' }
    ]
  },
  emo: {
    time: '20:45', seg: '夜间修复', icon: 'frown', title: '情绪着陆仪式', gain: 10,
    teaser: '凌晨的情绪，今天该签收了。',
    detail: '拿纸笔写三行：昨晚在 emo 什么、最坏能坏到哪、明天能做的最小一步。写完合上——情绪从脑内搬到纸上，睡眠就不会被它反复 @。',
    tip: '「书写表达」被证实能降低睡前反刍思维。',
    chips: [
      { type: 'heal', icon: 'battery-charging', text: '回血 +10%' },
      { type: 'custom', text: '定制加项' }
    ]
  },
  scroll: {
    time: '09:30', seg: '上午续航', icon: 'eye', title: '护眼补水时段', gain: 10,
    teaser: '眼睛：昨晚的债主找上门了。',
    detail: '热敷眼睛 3 分钟，全天执行 20-20-20（每看屏 20 分钟，看 6 米外 20 秒）。干涩报警就上人工泪液，别硬扛。',
    tip: '20-20-20 法则是缓解视疲劳的经典处方。',
    chips: [
      { type: 'heal', icon: 'battery-charging', text: '回血 +10%' },
      { type: 'custom', text: '定制加项' }
    ]
  }
};

// 选中的行为 → 结算报告里的「定制提醒」
DB.tagAdvice = {
  coffee: '今天咖啡因已到账，14:00 后只喝白水，给今晚的睡眠让路。',
  snack:  '昨晚的夜宵还在肠胃值夜班——今晚晚餐减半，让它准点下班。',
  game:   '连跪的怨气别带进今晚：睡前 1 小时关闭所有排位入口。',
  ddl:    'DDL 已交卷，今晚强制存档——大脑的 commit 不能拖到床上。',
  emo:    '情绪已记档。今晚允许它放映一集，但不允许它循环加播。',
  scroll: '眼睛昨晚超负荷，今晚 22:00 后所有屏幕切夜间模式。'
};

// 「今日彩蛋」池：按日期轮换，同一天稳定、隔天变化
DB.extras = [
  {
    time: '14:45', seg: '下午稳态', icon: 'activity', title: '微休 5 分钟', gain: 6,
    teaser: '闭眼，来一套 4-7-8 呼吸。',
    detail: '吸气 4 秒、屏住 7 秒、呼气 8 秒，做三轮。副交感神经上线，心率降下来，下午的烦躁跟着贬值。',
    tip: '4-7-8 呼吸是快速切换出「战斗模式」的开关。',
    chips: [
      { type: 'heal', icon: 'battery-charging', text: '回血 +6%' },
      { type: 'custom', text: '今日彩蛋' }
    ]
  },
  {
    time: '21:15', seg: '夜间修复', icon: 'droplet', title: '温水一杯 + 明日三件事', gain: 6,
    teaser: '把明天的事，先卸载到纸上。',
    detail: '喝完这杯温水，写下明天最重要的三件事。睡前清空工作记忆，凌晨三点的大脑就没素材循环播放了。',
    tip: '睡前「清空清单」能显著减少入睡前的反刍。',
    chips: [
      { type: 'heal', icon: 'battery-charging', text: '回血 +6%' },
      { type: 'custom', text: '今日彩蛋' }
    ]
  },
  {
    time: '17:30', seg: '傍晚降速', icon: 'activity', title: '拉伸 10 分钟', gain: 7,
    teaser: '肩颈和腰，都在写抗议信。',
    detail: '颈侧拉伸、猫式伸展、站立体前屈，每个 30 秒 ×2。缺觉日不练强度，但柔韧要天天发工资。',
    tip: '缺觉日拉伸：零受伤风险，还能降皮质醇。',
    chips: [
      { type: 'heal', icon: 'battery-charging', text: '回血 +7%' },
      { type: 'custom', text: '今日彩蛋' }
    ]
  }
];

// 组装当日定制航线：基础航线 + 今日彩蛋（按日期轮换）+ 行为加项，按时间排序
DB.buildPlan = function (conditionId, actions = []) {
  const base = DB.plans[conditionId];
  const dayIndex = Math.floor(Date.now() / 86400000); // 按天轮换，同一天稳定
  const condIdx = Math.max(0, DB.conditions.findIndex((c) => c.id === conditionId));
  const extra = DB.extras[(dayIndex + condIdx) % DB.extras.length];
  const tagNodes = actions.map((a) => DB.tagNodes[a]).filter(Boolean);
  const nodes = [...base.nodes, extra, ...tagNodes]
    .slice()
    .sort((x, y) => x.time.localeCompare(y.time));
  return Object.assign({}, base, { nodes, custom: actions.slice() });
};
