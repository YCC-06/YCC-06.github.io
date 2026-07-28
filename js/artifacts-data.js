// ========== 原神圣遗物图鉴数据 ==========
const artifactsData = [
    // === 蒙德 / 早期 ===
    {
        id: 'viridescent-venerer',
        name: '翠绿之影',
        imgUrl: "images/artifacts/15002.png",
        icon: '🍃',
        color: '#74c69d',
        rarity: 5,
        region: '蒙德',
        twoPiece: '获得15%风元素伤害加成。',
        fourPiece: '扩散反应造成的伤害提升60%。根据扩散的元素类型，降低受到影响的敌人40%的对应元素抗性，持续10秒。'
    },
    {
        id: 'gladiators-finale',
        name: '角斗士的终幕礼',
        imgUrl: "images/artifacts/15001.png",
        icon: '⚔️',
        color: '#b8856c',
        rarity: 5,
        region: '蒙德',
        twoPiece: '攻击力提高18%。',
        fourPiece: '装备该圣遗物套装的角色为单手剑、双手剑、长柄武器角色时，角色普通攻击造成的伤害提高35%。'
    },
    {
        id: 'wanderers-troupe',
        name: '流浪大地的乐团',
        imgUrl: "images/artifacts/15003.png",
        icon: '🎵',
        color: '#c084fc',
        rarity: 5,
        region: '蒙德',
        twoPiece: '元素精通提高80点。',
        fourPiece: '装备该圣遗物套装的角色为法器、弓箭角色时，角色重击造成的伤害提高35%。'
    },
    {
        id: 'bloodstained-chivalry',
        name: '染血的骑士道',
        imgUrl: "images/artifacts/15008.png",
        icon: '🩸',
        color: '#d62828',
        rarity: 5,
        region: '蒙德',
        twoPiece: '造成的物理伤害提高25%。',
        fourPiece: '击败敌人后的10秒内，施放重击时不消耗体力，且重击造成的伤害提升50%。'
    },
    // === 璃月 ===
    {
        id: 'archaic-petra',
        name: '悠古的磐岩',
        imgUrl: "images/artifacts/15014.png",
        icon: '🪨',
        color: '#ffc300',
        rarity: 5,
        region: '璃月',
        twoPiece: '获得15%岩元素伤害加成。',
        fourPiece: '获得结晶反应形成的晶片时，队伍中所有角色获得35%对应元素伤害加成，持续10秒。同时只能通过该效果获得一种元素伤害加成。'
    },
    {
        id: 'noblesse-oblige',
        name: '昔日宗室之仪',
        imgUrl: "images/artifacts/15007.png",
        icon: '👑',
        color: '#6c5ce7',
        rarity: 5,
        region: '璃月',
        twoPiece: '元素爆发造成的伤害提升20%。',
        fourPiece: '施放元素爆发后，队伍中所有角色攻击力提升20%，持续12秒。该效果不可叠加。'
    },
    {
        id: 'retracing-bolide',
        name: '逆飞的流星',
        imgUrl: "images/artifacts/15015.png",
        icon: '☄️',
        color: '#a8a8b0',
        rarity: 5,
        region: '璃月',
        twoPiece: '护盾强效提高35%。',
        fourPiece: '处于护盾庇护下时，额外获得40%普通攻击和重击伤害加成。'
    },
    // === 稻妻 ===
    {
        id: 'emblem-of-severed-fate',
        name: '绝缘之旗印',
        imgUrl: "images/artifacts/15020.png",
        icon: '⚡',
        color: '#9d4edd',
        rarity: 5,
        region: '稻妻',
        twoPiece: '元素充能效率提高20%。',
        fourPiece: '基于元素充能效率的25%，提高元素爆发的伤害。通过这种方式最多获得75%提升。'
    },
    {
        id: 'shimenawa-reminiscence',
        name: '追忆之注连',
        imgUrl: "images/artifacts/15019.png",
        icon: '🌸',
        color: '#e8796e',
        rarity: 5,
        region: '稻妻',
        twoPiece: '攻击力提高18%。',
        fourPiece: '施放元素战技时，如果角色的元素能量大于或等于15点，则会流失15点元素能量，使接下来的10秒内，普通攻击、重击、下落攻击造成的伤害提高50%。'
    },
    {
        id: 'husk-of-opulent-dreams',
        name: '华馆梦醒形骸记',
        imgUrl: "images/artifacts/15021.png",
        icon: '🏛️',
        color: '#a0aec0',
        rarity: 5,
        region: '稻妻',
        twoPiece: '防御力提高30%。',
        fourPiece: '装备此圣遗物套装的角色在场上用岩元素攻击命中敌人后，获得一层问答效果，每0.3秒至多触发一次。处于队伍后台时，每3秒获得一层问答效果。问答效果至多叠加4层，每层能提供6%防御力与6%岩元素伤害加成。每6秒未获得问答效果，会损失一层。'
    },
    {
        id: 'ocean-hued-clam',
        name: '海染砗磲',
        imgUrl: "images/artifacts/15022.png",
        icon: '🐚',
        color: '#48cae4',
        rarity: 5,
        region: '稻妻',
        twoPiece: '治疗加成提高15%。',
        fourPiece: '装备此圣遗物套装的角色对队伍中的角色进行治疗时，将产生持续3秒的海染泡沫，记录治疗的生命值回复量（包括溢出值）。持续时间结束时，海染泡沫将会爆炸，对周围的敌人造成基于累计回复量90%的伤害（该伤害值最大为30000）。'
    },
    // === 须弥 ===
    {
        id: 'deepwood-memories',
        name: '深林的记忆',
        imgUrl: "images/artifacts/15025.png",
        icon: '🌿',
        color: '#55a630',
        rarity: 5,
        region: '须弥',
        twoPiece: '获得15%草元素伤害加成。',
        fourPiece: '元素战技或元素爆发命中敌人后，使命中目标的草元素抗性降低30%，持续8秒。装备者处于队伍后台时依然能触发该效果。'
    },
    {
        id: 'gilded-dreams',
        name: '饰金之梦',
        imgUrl: "images/artifacts/15026.png",
        icon: '🌙',
        color: '#ffb347',
        rarity: 5,
        region: '须弥',
        twoPiece: '元素精通提高80点。',
        fourPiece: '触发元素反应后的8秒内，会根据队伍中其他角色的元素类型，使装备者获得强化：队伍中每存在一个和装备者同类元素的角色，攻击力提升14%；每存在一个和装备者不同元素类型的角色，元素精通提升50点。上述每类效果至多计算3个角色。该效果每8秒至多触发一次。'
    },
    {
        id: 'flower-of-paradise-lost',
        name: '乐园遗落之花',
        imgUrl: "images/artifacts/15028.png",
        icon: '🌸',
        color: '#ff6b9d',
        rarity: 5,
        region: '须弥',
        twoPiece: '元素精通提高80点。',
        fourPiece: '装备者的绽放、超绽放、烈绽放反应造成的伤害提升40%。此外，装备者触发绽放、超绽放、烈绽放后，上述效果带来的加成效果再提升25%，持续10秒，至多叠加4次。装备者处于队伍后台时依然能触发该效果。'
    },
    {
        id: 'desert-pavilion-chronicle',
        name: '沙上楼阁史话',
        imgUrl: "images/artifacts/15027.png",
        icon: '🏜️',
        color: '#d4a373',
        rarity: 5,
        region: '须弥',
        twoPiece: '获得15%风元素伤害加成。',
        fourPiece: '重击命中敌人后，该角色的普通攻击速度提升10%，普通攻击、重击与下落攻击造成的伤害提升40%，持续15秒。'
    },
    // === 枫丹 ===
    {
        id: 'marechaussee-hunter',
        name: '逐影猎人',
        imgUrl: "images/artifacts/15031.png",
        icon: '🎯',
        color: '#667eea',
        rarity: 5,
        region: '枫丹',
        twoPiece: '普通攻击与重击造成的伤害提高15%。',
        fourPiece: '当前生命值提升或降低时，暴击率提升12%，该效果持续5秒，至多叠加3次。'
    },
    {
        id: 'golden-troupe',
        name: '黄金剧团',
        imgUrl: "images/artifacts/15032.png",
        icon: '🎭',
        color: '#ffd700',
        rarity: 5,
        region: '枫丹',
        twoPiece: '元素战技造成的伤害提升20%。',
        fourPiece: '元素战技造成的伤害提升25%。此外，处于队伍后台时，元素战技造成的伤害还将进一步提升25%，该效果将在登场后2秒移除。'
    },
    {
        id: 'vourukasha-glow',
        name: '花海甘露之光',
        imgUrl: "images/artifacts/15030.png",
        icon: '💧',
        color: '#72efdd',
        rarity: 5,
        region: '枫丹',
        twoPiece: '生命值提升20%。',
        fourPiece: '元素战技与元素爆发造成的伤害提升10%。装备者受到伤害后的5秒内，上述伤害提升效果提高80%，该提高效果至多叠加5层，每层持续时间独立计算。处于队伍后台时依然能触发该效果。'
    },
    {
        id: 'nighttime-whispers',
        name: '回声之林夜话',
        imgUrl: "images/artifacts/15034.png",
        icon: '🌲',
        color: '#6c757d',
        rarity: 5,
        region: '枫丹',
        twoPiece: '攻击力提高18%。',
        fourPiece: '施放元素战技后的10秒内，岩元素伤害加成提升20%；若处于结晶反应的护盾庇护下，上述效果提高150%，进一步提高的效果将在失去结晶护盾庇护的1秒后解除。'
    },
    {
        id: 'song-of-days-past',
        name: '昔时之歌',
        imgUrl: "images/artifacts/15033.png",
        icon: '📜',
        color: '#e8c4a0',
        rarity: 5,
        region: '枫丹',
        twoPiece: '治疗加成提高15%。',
        fourPiece: '装备者对队伍中的角色进行治疗时，将产生持续6秒的渴盼效果，记录治疗的生命值回复量（包括溢出值）。持续时间结束时，渴盼效果将转变为「彼时的浪潮」效果：队伍中自己的当前场上角色的普通攻击、重击、下落攻击、元素战技与元素爆发命中敌人时，基于渴盼效果所记录的回复量的8%提高造成的伤害，「彼时的浪潮」将在生效5次或10秒后移除。一次渴盼效果至多记录15000点回复量。'
    },
    // === 纳塔 ===
    {
        id: 'obsidian-codex',
        name: '黑曜秘典',
        icon: '📖',
        color: '#1a1a2e',
        rarity: 5,
        region: '纳塔',
        twoPiece: '装备者处于夜魂加持状态，并且在场上时，造成的伤害提高15%。',
        fourPiece: '装备者在场上消耗1点夜魂值后，暴击率提高40%，持续6秒。该效果每1秒至多触发一次。'
    },
    {
        id: 'scroll-of-the-hero-of-cinder-city',
        name: '烬城勇者绘卷',
        icon: '🔥',
        color: '#ef476f',
        rarity: 5,
        region: '纳塔',
        twoPiece: '队伍中附近的角色触发「夜魂迸发」时，装备者恢复6点元素能量。',
        fourPiece: '装备者触发其对应元素类型的相关反应后，队伍中附近的所有角色的该元素反应相关的元素伤害加成提升12%，持续15秒。若触发该效果时，装备者处于夜魂加持状态下，还将使队伍中附近的所有角色的与该元素反应相关的元素伤害加成提升28%，持续20秒。装备者处于后台时也能触发。'
    },
    // === 通用 / 其他五星 ===
    {
        id: 'crimson-witch-of-flames',
        name: '炽烈的炎之魔女',
        imgUrl: "images/artifacts/15006.png",
        icon: '🔥',
        color: '#d62828',
        rarity: 5,
        region: '通用',
        twoPiece: '获得15%火元素伤害加成。',
        fourPiece: '超载、燃烧、烈绽放反应造成的伤害提升40%，蒸发、融化反应的加成系数提高15%。施放元素战技后的10秒内，2件套的效果提高50%，该效果最多叠加3次。'
    },
    {
        id: 'thundering-fury',
        name: '如雷的盛怒',
        imgUrl: "images/artifacts/15005.png",
        icon: '⚡',
        color: '#7b2ff7',
        rarity: 5,
        region: '通用',
        twoPiece: '获得15%雷元素伤害加成。',
        fourPiece: '超载、感电、超导、超绽放反应造成的伤害提升40%，激化反应带来的伤害提升提高20%。触发上述元素反应时，元素战技冷却时间减少1秒。该效果每0.8秒至多触发一次。'
    },
    {
        id: 'heart-of-depth',
        name: '沉沦之心',
        imgUrl: "images/artifacts/15016.png",
        icon: '💧',
        color: '#0096c7',
        rarity: 5,
        region: '通用',
        twoPiece: '获得15%水元素伤害加成。',
        fourPiece: '施放元素战技后的15秒内，普通攻击与重击造成的伤害提高30%。'
    },
    {
        id: 'blizzard-strayer',
        name: '冰风迷途的勇士',
        imgUrl: "images/artifacts/14001.png",
        icon: '❄️',
        color: '#90e0ef',
        rarity: 5,
        region: '通用',
        twoPiece: '获得15%冰元素伤害加成。',
        fourPiece: '攻击处于冰元素影响下的敌人时，暴击率提高20%；若敌人处于冻结状态下，暴击率额外提高20%。'
    },
    {
        id: 'lavawalker',
        name: '渡过烈火的贤人',
        imgUrl: "images/artifacts/14003.png",
        icon: '🔥',
        color: '#e63946',
        rarity: 5,
        region: '通用',
        twoPiece: '火元素抗性提高40%。',
        fourPiece: '对处于火元素影响下的敌人，造成的伤害提升35%。'
    },
    {
        id: 'thundersoother',
        name: '平息鸣雷的尊者',
        imgUrl: "images/artifacts/14002.png",
        icon: '⚡',
        color: '#6c4ab6',
        rarity: 5,
        region: '通用',
        twoPiece: '雷元素抗性提高40%。',
        fourPiece: '对处于雷元素影响下的敌人，造成的伤害提升35%。'
    },
    {
        id: 'tenacity-of-the-millelith',
        name: '千岩牢固',
        imgUrl: "images/artifacts/15017.png",
        icon: '🛡️',
        color: '#b87333',
        rarity: 5,
        region: '通用',
        twoPiece: '生命值提升20%。',
        fourPiece: '元素战技命中敌人后，使队伍中附近的所有角色攻击力提升20%，护盾强效提升30%，持续3秒。该效果每0.5秒至多触发一次。装备者处于队伍后台时依然能触发该效果。'
    },
    {
        id: 'pale-flame',
        name: '苍白之火',
        imgUrl: "images/artifacts/15018.png",
        icon: '💀',
        color: '#6c757d',
        rarity: 5,
        region: '通用',
        twoPiece: '造成的物理伤害提高25%。',
        fourPiece: '元素战技命中敌人后，攻击力提升9%，持续7秒，该效果最多叠加2层，每0.3秒至多触发一次。叠加至2层时，2件套的效果提升100%。'
    },
    {
        id: 'vermillion-hereafter',
        name: '辰砂往生录',
        imgUrl: "images/artifacts/15023.png",
        icon: '📿',
        color: '#d64045',
        rarity: 5,
        region: '通用',
        twoPiece: '攻击力提高18%。',
        fourPiece: '施放元素爆发后，将产生持续16秒的「潜光」效果：攻击力提升8%。并在角色的生命值降低时，攻击力进一步提升10%，每0.8秒至多触发一次，至多叠加4层。「潜光」效果将在角色退场时移除。'
    },
    {
        id: 'echoes-of-an-offering',
        name: '来歆余响',
        imgUrl: "images/artifacts/15024.png",
        icon: '🔔',
        color: '#e8c4a0',
        rarity: 5,
        region: '通用',
        twoPiece: '攻击力提高18%。',
        fourPiece: '普通攻击命中敌人时，有36%概率触发「幽谷祝祀」：普通攻击造成的伤害提高，伤害提高值为攻击力的70%，该效果将在普通攻击造成伤害后的0.05秒后清除。普通攻击未触发时，会使下次触发概率提升20%，每0.2秒至多判定一次。'
    },
    {
        id: 'nymphs-dream',
        name: '水仙之梦',
        imgUrl: "images/artifacts/15029.png",
        icon: '🧚',
        color: '#48cae4',
        rarity: 5,
        region: '通用',
        twoPiece: '获得15%水元素伤害加成。',
        fourPiece: '普通攻击、重击、下落攻击、元素战技或元素爆发命中敌人后，将产生1层「镜中水仙」效果，持续8秒。处于1/2/3层及以上「镜中水仙」效果下时，攻击力提升7%/16%/25%，水元素伤害加成提升4%/9%/15%。由普通攻击、重击、下落攻击、元素战技或元素爆发产生的「镜中水仙」将分别独立存在。'
    },
    {
        id: 'unfinished-reverie',
        name: '未竟的遐思',
        icon: '💭',
        color: '#a78bfa',
        rarity: 5,
        region: '通用',
        twoPiece: '攻击力提高18%。',
        fourPiece: '脱离战斗状态3秒后，造成的伤害提升50%。在战斗状态下，附近不存在处于燃烧状态下的敌人超过6秒后，上述伤害提升效果每秒降低10%，直到降低至0%；存在处于燃烧状态下的敌人时，每秒提升10%，直到达到50%。'
    },
    
    {
        id: 'nod-krai-天之美赐',
        name: '天之美赐',
        icon: '✨',
        color: '#ffd700',
        rarity: 5,
        region: '挪德卡莱',
        twoPiece: '元素充能效率提高20%。',
        fourPiece: '施放元素战技后，获得「天光之引」效果：依据装备者的元素类型，使队伍中附近的所有角色获得20%对应元素伤害加成，持续20秒。装备者处于后台时也能触发，同名套装效果无法叠加。'
    },

    
    {
        id: 'nod-krai-影中沉凝的幻灭',
        name: '影中沉凝的幻灭',
        icon: '🌑',
        color: '#6c5ce7',
        rarity: 5,
        region: '挪德卡莱',
        twoPiece: '攻击力提高18%。',
        fourPiece: '超导反应造成的伤害提升80%；装备者攻击受到超导反应影响的敌人时，本次攻击的暴击率提高16%。'
    },

    
    {
        id: 'nod-krai-晨星与月的晓歌',
        name: '晨星与月的晓歌',
        icon: '🌙',
        color: '#a8b4ff',
        rarity: 5,
        region: '挪德卡莱',
        twoPiece: '元素精通提高80点。',
        fourPiece: '装备者处于队伍后台时，造成的月曜反应伤害提升20%；队伍的月兆等级至少为满辉时，月曜反应伤害进一步提升40%。装备者位于场上3秒后移除。'
    },

    
    {
        id: 'nod-krai-风起之日',
        name: '风起之日',
        icon: '🌪️',
        color: '#74c69d',
        rarity: 5,
        region: '挪德卡莱',
        twoPiece: '攻击力提高18%。',
        fourPiece: '普通攻击、重击、元素战技或元素爆发命中敌人后，获得持续6秒的「风与牧歌的眷怜」：攻击力提高25%。额外使装备者暴击率提升20%。后台也能触发。'
    },

    
    {
        id: 'nod-krai-穹境示现之夜',
        name: '穹境示现之夜',
        icon: '🌌',
        color: '#1a1a2e',
        rarity: 5,
        region: '挪德卡莱',
        twoPiece: '元素精通提高80点。',
        fourPiece: '队伍触发月曜反应时，若装备者在场上，获得持续4秒的月辉明光效果：月兆为初辉时暴击率提升15%，满辉时提升30%。不同月辉明光效果使月曜反应伤害提升10%。'
    },

    
    {
        id: 'nod-krai-纺月的夜歌',
        name: '纺月的夜歌',
        icon: '🎵',
        color: '#c084fc',
        rarity: 5,
        region: '挪德卡莱',
        twoPiece: '元素充能效率提高20%。',
        fourPiece: '造成元素伤害时，获得月辉明光·崇信效果：月兆为初辉时全队元素精通提高60点，满辉时提高120点。后台也能触发。'
    },

    
    {
        id: 'nod-krai-深廊终曲',
        name: '深廊终曲',
        icon: '❄️',
        color: '#90e0ef',
        rarity: 5,
        region: '挪德卡莱',
        twoPiece: '获得15%冰元素伤害加成。',
        fourPiece: '装备者的元素能量为0时，普通攻击造成的伤害提升60%，元素爆发造成的伤害提升60%。两种效果互斥切换。后台也能触发。'
    },

    
    {
        id: 'nod-krai-长夜之誓',
        name: '长夜之誓',
        icon: '⚔️',
        color: '#b87333',
        rarity: 5,
        region: '挪德卡莱',
        twoPiece: '下落攻击造成的伤害提升25%。',
        fourPiece: '下落攻击/重击/元素战技命中敌人后获得永照的流辉：下落攻击伤害提升15%，持续6秒，至多叠加5层，每层独立计时。'
    },

    // === 四星圣遗物 ===
    {
        id: 'instructor',
        name: '教官',
        imgUrl: "images/artifacts/10007.png",
        icon: '📚',
        color: '#4a90d9',
        rarity: 4,
        region: '通用',
        twoPiece: '元素精通提高80点。',
        fourPiece: '触发元素反应后，队伍中所有角色的元素精通提高120点，持续8秒。'
    },
    {
        id: 'exile',
        name: '流放者',
        imgUrl: "images/artifacts/10009.png",
        icon: '🔗',
        color: '#8c8c8c',
        rarity: 4,
        region: '通用',
        twoPiece: '元素充能效率提高20%。',
        fourPiece: '施放元素爆发后，每2秒为队伍中所有角色（不包括自己）恢复2点元素能量，持续6秒。该效果不可叠加。'
    },
    {
        id: 'scholar',
        name: '学士',
        imgUrl: "images/artifacts/10012.png",
        icon: '🎓',
        color: '#6c757d',
        rarity: 4,
        region: '通用',
        twoPiece: '元素充能效率提高20%。',
        fourPiece: '获得元素能量时，队伍中所有弓箭和法器角色额外恢复3点元素能量。该效果每3秒至多触发一次。'
    },
    {
        id: 'berserker',
        name: '战狂',
        imgUrl: "images/artifacts/10005.png",
        icon: '⚔️',
        color: '#d62828',
        rarity: 4,
        region: '通用',
        twoPiece: '暴击率提高12%。',
        fourPiece: '生命值低于70%时，暴击率额外提高24%。'
    },
    {
        id: 'martial-artist',
        name: '武人',
        imgUrl: "images/artifacts/10008.png",
        icon: '🥋',
        color: '#b87333',
        rarity: 4,
        region: '通用',
        twoPiece: '普通攻击与重击造成的伤害提高15%。',
        fourPiece: '施放元素战技后的8秒内，普通攻击和重击造成的伤害提升25%。'
    },
    {
        id: 'gambler',
        name: '赌徒',
        imgUrl: "images/artifacts/10013.png",
        icon: '🎲',
        color: '#ffb347',
        rarity: 4,
        region: '通用',
        twoPiece: '元素战技造成的伤害提升20%。',
        fourPiece: '击败敌人时，有100%概率重置元素战技的冷却时间。该效果每15秒至多触发一次。'
    },
    {
        id: 'traveling-doctor',
        name: '游医',
        imgUrl: "images/artifacts/10006.png",
        icon: '💊',
        color: '#55a630',
        rarity: 3,
        region: '通用',
        twoPiece: '角色受到的治疗效果提高20%。',
        fourPiece: '施放元素爆发时，恢复20%生命值。'
    },
    {
        id: 'tiny-miracle',
        name: '奇迹',
        imgUrl: "images/artifacts/10004.png",
        icon: '⭐',
        color: '#ffd700',
        rarity: 3,
        region: '通用',
        twoPiece: '所有元素抗性提高20%。',
        fourPiece: '受到元素伤害后，相应的元素抗性额外提高30%，持续10秒。该效果每10秒至多触发一次。'
    }
];

// 按稀有度排序（5星优先），再按地区分组
function getArtifactsByRegion() {
    const regions = {};
    artifactsData.forEach(a => {
        if (!regions[a.region]) regions[a.region] = [];
        regions[a.region].push(a);
    });
    return regions;
}

// 按稀有度分组
function getArtifactsByRarity() {
    const rarities = {};
    artifactsData.forEach(a => {
        const key = a.rarity + '星';
        if (!rarities[key]) rarities[key] = [];
        rarities[key].push(a);
    });
    return rarities;
}
