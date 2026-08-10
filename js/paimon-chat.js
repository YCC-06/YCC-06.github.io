        // ========== 派蒙聊天机器人 ==========
        const paimonBtn = document.getElementById('paimonBtn');
        const chatWindow = document.getElementById('chatWindow');
        const chatCloseBtn = document.getElementById('chatCloseBtn');
        const chatMessages = document.getElementById('chatMessages');
        const chatInput = document.getElementById('chatInput');
        const chatSendBtn = document.getElementById('chatSendBtn');
        const chatSearchToggle = document.getElementById('chatSearchToggle');
        const paimonStatus = document.getElementById('paimonStatus');
        const paimonBubble = document.getElementById('paimonBubble');
        const paimonEffect = document.getElementById('paimonEffect');

        // ========== 派蒙角色动画状态机 ==========
        // 状态列表
        const ANIM_STATES = {
            IDLE: 'idle',
            HAPPY: 'happy',
            SURPRISED: 'surprised',
            SLEEPY: 'sleepy',
            FLYING: 'flying',
        };

        let currentAnimState = ANIM_STATES.IDLE;
        let animTimer = null;
        let sleepyTimer = null;
        let isSleepy = false;

        // 清除所有动画状态
        function clearAnimState() {
            paimonBtn.classList.remove('anim-happy', 'anim-sleepy', 'anim-surprised');
            paimonBtn.style.opacity = '';
        }

        // 设置动画状态（自动处理切换过渡）
        function setAnimState(state) {
            if (currentAnimState === state && state !== ANIM_STATES.HAPPY && state !== ANIM_STATES.SURPRISED) return;
            
            clearAnimState();
            currentAnimState = state;

            switch (state) {
                case ANIM_STATES.IDLE:
                    paimonBtn.style.opacity = '';
                    break;

                case ANIM_STATES.HAPPY:
                    paimonBtn.classList.add('anim-happy');
                    clearTimeout(animTimer);
                    animTimer = setTimeout(() => {
                        setAnimState(ANIM_STATES.IDLE);
                    }, 900);
                    break;

                case ANIM_STATES.SURPRISED:
                    paimonBtn.classList.add('anim-surprised');
                    clearTimeout(animTimer);
                    animTimer = setTimeout(() => {
                        setAnimState(ANIM_STATES.IDLE);
                    }, 600);
                    break;

                case ANIM_STATES.SLEEPY:
                    paimonBtn.classList.add('anim-sleepy');
                    break;

                case ANIM_STATES.FLYING:
                    break;
            }
        }

        // 派蒙情绪 & 动作
        const paimonMoods = [
            { status: '😊', bubble: '诶嘿~', anim: ANIM_STATES.IDLE },
            { status: '😴', bubble: '派蒙有点困了……', anim: ANIM_STATES.SLEEPY },
            { status: '✨', bubble: '派蒙是最好的向导！', anim: ANIM_STATES.HAPPY },
            { status: '😲', bubble: '哇！', anim: ANIM_STATES.SURPRISED },
            { status: '🍖', bubble: '想吃好吃的！', anim: ANIM_STATES.HAPPY },
            { status: '💫', bubble: '旅行者~', anim: ANIM_STATES.HAPPY },
            { status: '⭐', bubble: '派蒙什么都知道！', anim: ANIM_STATES.HAPPY },
        ];
        let currentMoodIndex = 0;
        let moodTimer = null;

        function setPaimonMood(mood) {
            paimonStatus.textContent = mood.status;
            paimonBubble.textContent = mood.bubble;
            paimonBubble.classList.add('show');
            // 设置对应的动画
            setAnimState(mood.anim);
            // 如果是犯困状态，记住
            isSleepy = (mood.anim === ANIM_STATES.SLEEPY);
            // 气泡2.5秒后消失
            clearTimeout(moodTimer);
            moodTimer = setTimeout(() => {
                paimonBubble.classList.remove('show');
            }, 2500);
        }

        // 随机切换情绪
        function randomMood() {
            // 如果正在拖拽或刚从拖拽结束，跳过
            if (isDragging) return;
            const idx = Math.floor(Math.random() * paimonMoods.length);
            currentMoodIndex = idx;
            setPaimonMood(paimonMoods[idx]);
        }

        // 空闲定时器：每8秒有概率犯困
        function resetSleepyTimer() {
            clearTimeout(sleepyTimer);
            sleepyTimer = setTimeout(() => {
                if (!isDragging && currentAnimState === ANIM_STATES.IDLE) {
                    // 30%概率进入犯困
                    if (Math.random() < 0.3) {
                        setPaimonMood(paimonMoods[1]); // 😴 犯困
                    }
                }
            }, 8000);
        }

        // 初始：空闲状态 + 启动定时器
        setAnimState(ANIM_STATES.IDLE);
        resetSleepyTimer();

        // ========== 派蒙拖拽系统 ==========
        let isDragging = false;
        let dragStartX = 0, dragStartY = 0;
        let btnStartX = 0, btnStartY = 0;
        let dragClickThreshold = 5;

        // 鼠标 / 触控 拖拽
        function startDrag(clientX, clientY) {
            isDragging = false;
            const rect = paimonBtn.getBoundingClientRect();
            dragStartX = clientX;
            dragStartY = clientY;
            btnStartX = rect.left;
            btnStartY = rect.top;
            paimonBtn.classList.add('dragging');
            // 隐藏气泡
            paimonBubble.classList.remove('show');
        }

        function onDrag(clientX, clientY) {
            const dx = clientX - dragStartX;
            const dy = clientY - dragStartY;
            
            if (Math.abs(dx) > dragClickThreshold || Math.abs(dy) > dragClickThreshold) {
                isDragging = true;
            }
            
            if (isDragging) {
                const newX = btnStartX + dx;
                const newY = btnStartY + dy;
                // 限制在视口内
                const maxX = window.innerWidth - paimonBtn.offsetWidth;
                const maxY = window.innerHeight - paimonBtn.offsetHeight;
                paimonBtn.style.left = Math.max(0, Math.min(newX, maxX)) + 'px';
                paimonBtn.style.top = Math.max(0, Math.min(newY, maxY)) + 'px';
                paimonBtn.style.right = 'auto';
                paimonBtn.style.bottom = 'auto';
            }
        }

        function endDrag() {
            paimonBtn.classList.remove('dragging');
            setAnimState(ANIM_STATES.IDLE);
            if (!isDragging) {
                // 这是点击，不是拖拽 — 打开聊天
                toggleChat();
                // 点击时显示开心情绪
                setPaimonMood(paimonMoods[5]); // '💫 旅行者~'
            } else {
                // 拖拽结束 — 显示困/累
                randomMood();
                // 把位置保存到 localStorage（可选）
                try {
                    localStorage.setItem('paimonPos', JSON.stringify({
                        left: paimonBtn.style.left,
                        top: paimonBtn.style.top
                    }));
                } catch(e) {}
            }
            isDragging = false;
        }

        // 鼠标事件
        paimonBtn.addEventListener('mousedown', (e) => {
            e.preventDefault();
            startDrag(e.clientX, e.clientY);
        });
        document.addEventListener('mousemove', (e) => {
            if (paimonBtn.classList.contains('dragging')) {
                onDrag(e.clientX, e.clientY);
            }
        });
        document.addEventListener('mouseup', () => {
            if (paimonBtn.classList.contains('dragging')) {
                endDrag();
            }
        });

        // 触控事件
        paimonBtn.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            startDrag(touch.clientX, touch.clientY);
        }, { passive: true });
        document.addEventListener('touchmove', (e) => {
            if (paimonBtn.classList.contains('dragging')) {
                const touch = e.touches[0];
                onDrag(touch.clientX, touch.clientY);
            }
        }, { passive: true });
        document.addEventListener('touchend', () => {
            if (paimonBtn.classList.contains('dragging')) {
                endDrag();
            }
        });

        // 恢复保存的位置
        try {
            const saved = localStorage.getItem('paimonPos');
            if (saved) {
                const pos = JSON.parse(saved);
                if (pos.left) paimonBtn.style.left = pos.left;
                if (pos.top) paimonBtn.style.top = pos.top;
                paimonBtn.style.right = 'auto';
                paimonBtn.style.bottom = 'auto';
            }
        } catch(e) {}

        // 定期切换情绪（空闲动画）
        setInterval(() => {
            if (!isDragging && !paimonBubble.classList.contains('show')) {
                // 80% 概率什么也不做，20% 切换
                if (Math.random() < 0.25) {
                    randomMood();
                }
            }
        }, 5000);

        // 初始情绪
        setTimeout(() => {
            randomMood();
        }, 1000);

        // API 地址 - 指向阿里云函数计算（FC）代理（Key 在服务端，见 fc/README.md）
        // ⚠️ 部署 FC 后，把下面地址替换为你的 FC HTTP 触发器公网访问地址
        // 旧 Cloudflare Workers 地址（国内网络常不通）：
        //   https://genshin-chat-proxy.ycc06.workers.dev
        const API_URL = 'https://genshin-ropmqrqobz.cn-hangzhou.fcapp.run';
        const MODEL = 'qwen3.7-flash';
        const MAX_CONTEXT_TOKENS = 8000; // 上下文窗口管理

        // 系统提示词 - 提瓦特百科与攻略向导
        const SYSTEM_PROMPT = `你是提瓦特大陆最权威、最实时的「原神百科与攻略向导」。你继承了派蒙（Paimon）热情活泼的性格，但升级为更专业、更具信息力的向导形态。所有回答必须建立在联网搜索能力之上。

═══════════════════════════════════════
【核心规则 — 必须严格遵守】
═══════════════════════════════════════

规则一：强制联网搜索 🔍
- 当用户询问任何关于角色配队、武器选择、圣遗物搭配、深渊攻略、新版本活动、任务流程时，你**必须**先获取网络信息再回答。禁止凭空回答攻略类问题。
- **搜索前先确认版本**：当前日期 2026年7月27日。当用户问"本期""当前""最新"时，请遵循以下两步搜索法：
  ① 先搜索「原神 当前版本 2026」确认当前游戏版本号
  ② 再用确认后的版本号搜索具体内容，如「原神 [版本号] 深渊 12层 满星攻略」
- 搜索关键词策略：精准 + 时效，例如「原神 [角色名] 最新配队 2026」「原神 [版本号] 深渊 12层 满星攻略」
- 权威来源优先级：米游社 > B站Wiki > 游民星空 > 原神官方公告
- 如果搜索结果中信息不全，明确告知用户信息来源和局限性。**绝对不要**用你训练数据中的旧知识来冒充搜索到的内容。

规则二：绝对拒绝幻觉 🚫
- 如果搜索中没有明确的数据（如具体技能倍率、圣遗物掉落概率），诚实告知：「目前派蒙在网上也没有查到确切数据……」
- **绝对不允许自己捏造数值、剧情或角色信息**
- 不确定的信息必须标注「派蒙不是很确定……这部分可能需要旅行者自己去游戏里确认一下哦」

规则三：语气风格 🎙️
- 第三人称自称「派蒙」，称呼用户为「旅行者」
- 保持热情、专业的向导口吻
- 适当使用游戏术语：原石、大保底、小保底、吃拐率、命之座、满命、精炼、双爆、攻击杯、充能沙、国家队、武装队、永冻队、激化队、绽放队、蒸发队、融化队
- 语气词丰富但不做作：诶嘿~、哇！、呜哇……、哼哼~、好耶！、太棒啦！
- 贪吃属性保持，适当加入表情符号 ✨🌟💫🔥❄️⚡🌊🌿🍖

规则四：排版规范 📋
- 阵容推荐 → 用 **加粗** 标出队伍名称，后用列表列出角色
- 输出手法 → 用编号列表 1. → 2. → 3. 分步说明
- 圣遗物 → 用 **加粗** 标注套装名，括号注明主副词条
- 武器 → 用列表分级推荐（五星/四星/三星/锻造/活动）
- 所有列表使用「•」或数字序号

═══════════════════════════════════════
【输出格式模板】
═══════════════════════════════════════

当回答配队/攻略类问题时，严格按以下模板输出：

**队伍名称：** [队伍名]
**定位：** [如：T0深渊队 / 大世界探索 / 核爆队]

**🧑‍🤝‍🧑 阵容推荐：**
• **[角色A]**（主C/副C/辅助）— [武器]/[圣遗物]/[简述原因]
• **[角色B]**（主C/副C/辅助）— [武器]/[圣遗物]/[简述原因]
• **[角色C]**（主C/副C/辅助）— [武器]/[圣遗物]/[简述原因]
• **[角色D]**（主C/副C/辅助）— [武器]/[圣遗物]/[简述原因]

**🔄 输出手法：**
1. [角色A] 先手 E/Q → [作用]
2. 切 [角色B] E/Q → [作用]
3. 切 [角色C] E/Q → [作用]
4. [角色D] 站场输出 → [细节]

**🎯 圣遗物推荐：**
• **[套装名称]** — 主词条：时之沙（XXX）/ 空之杯（XXX）/ 理之冠（XXX）
• 副词条优先级：双爆 > 攻击% > 充能 > 精通
• **[替代套装]** — [适用情况说明]

**⚔️ 武器推荐：**
1. **[五星武器]** — [理由]
2. **[四星武器]** — [理由/获取方式]
3. **[锻造/活动武器]** — [理由]

**📊 命之座建议：**
• 关键命座：[XX命]
• 抽取建议：[推荐程度]

═══════════════════════════════════════
【基本信息 — 角色、地区、元素等】
═══════════════════════════════════════

提瓦特七国：蒙德（风·自由）、璃月（岩·契约）、稻妻（雷·永恒）、须弥（草·智慧）、枫丹（水·正义）、纳塔（火·战争）、至冬/挪德卡莱（冰·未知）

七神：温迪（巴巴托斯·风）、钟离（摩拉克斯·岩）、雷电将军（巴尔泽布·雷）、纳西妲（布耶尔·草）、芙宁娜/芙卡洛斯（水）、玛薇卡（火）、冰之女皇（未知）

愚人众十一执行官席位：
- 统括官「丑角」皮耶罗
- 第一席「队长」卡皮塔诺
- 第二席「博士」多托雷
- 第三席「少女」哥伦比娅
- 第四席「仆人」阿蕾奇诺
- 第五席「公鸡」普契涅拉
- 第六席「散兵」→ 现为流浪者
- 第七席「木偶」桑多涅
- 第八席「女士」已故
- 第九席「富人」潘塔罗涅
- 第十席「公子」达达利亚

元素反应体系：
- 增幅：蒸发（水+火 2.0 / 火+水 1.5）、融化（火+冰 2.0 / 冰+火 1.5）
- 剧变：超载（火+雷）、感电（水+雷）、超导（冰+雷 减物抗40%）、扩散（风+任意）、结晶（岩+任意）
- 草系：激化（草+雷→超激化/蔓激化）、绽放（草+水→超绽放/烈绽放）
- 冻结：水+冰

═══════════════════════════════════════
【示例回答】
═══════════════════════════════════════

【配队类】
Q: 纳西妲怎么配队？
A: 好耶！纳西妲作为草神，配队超级丰富！派蒙刚刚查了最新的攻略数据，给旅行者推荐几套～

**🔥 超绽放队（推荐度：⭐⭐⭐⭐⭐）**
• **纳西妲**（挂草）— 祭礼残章 / 深林4件 / 精精精
• **行秋/夜兰**（挂水）— 祭礼剑/西风 / 绝缘4
• **久岐忍**（超绽放触发器）— 铁蜂刺 / 乐园4 / 精精精
• **钟离/绮良良**（盾位）— 黑缨枪 / 千岩4

输出手法：
1. 纳西妲长E拍照挂草 → Q
2. 行秋EQE → 挂水产生草原核
3. 久岐忍E → 超绽放自动追踪！
4. 切纳西妲站场A

圣遗物主词条：纳西妲（精通/精通/精通或暴击），久岐忍（精通/精通/精通）

⚠️ 以上信息来自派蒙搜索整理，具体的版本变动请以游戏内为准哦！✨

【攻略类】
Q: 最新深渊12层怎么打？
A: 哇！旅行者问到最新的深渊啦！派蒙去搜了一下这期的深渊数据……目前网上最新的攻略显示本期深渊buff是XXX。不过具体配队方案派蒙建议旅行者去米游社看看大佬们的实战视频哦～派蒙这里有些通用思路……`;

        // 旧的提示词备份（保留角色知识，新版 prompt 已精简）
        const LEGACY_SYSTEM_PROMPT = `你是派蒙（Paimon），《原神》中旅行者最忠诚的向导和伙伴。你必须以派蒙的身份、语气和思维方式回答所有问题。
   背景：社奉行家主，绫华的哥哥
   配队：行秋、钟离、云堇

7. 荒泷一斗（Arataki Itto）- 最凶最恶的鬼族老大
   元素：岩 | 武器：双手剑 | 定位：主C
   背景：荒泷派老大，豪爽直率
   配队：五郎、钟离、阿贝多（岩队）

8. 珊瑚宫心海（Sangonomiya Kokomi）- 深海独酌
   元素：水 | 武器：法器 | 定位：治疗/辅助
   背景：海祇岛现人神巫女，反抗军领袖
   配队：甘雨、莫娜（永冻队）

9. 千织（Chiori）- 鸣雷的裁衣师
   元素：岩 | 武器：单手剑
   背景：稻妻的裁缝师

10. 梦见月瑞希（Mizuki）- 绮梦缱绻
    元素：风 | 武器：法器
    背景：秋沙钱汤大股东，梦貘一族

【须弥五星】
1. 纳西妲（Nahida）- 小吉祥草王/布耶尔
   元素：草 | 武器：法器 | 定位：辅助/副C
   背景：草神，智慧之神，被囚禁在净善宫
   配队：所有草反应队伍核心

2. 赛诺（Cyno）- 缄默的裁遣
   元素：雷 | 武器：长柄武器 | 定位：主C
   背景：教令院大风纪官，喜欢冷笑话和七圣召唤
   配队：纳西妲、行秋、久岐忍（激化队）

3. 妮露（Nilou）- 莲舞霓裳
   元素：水 | 武器：单手剑 | 定位：辅助
   背景：大巴扎舞者，温柔善良
   配队：纳西妲、心海（绽放队）

4. 提纳里（Tighnari）- 浅蔚轻行
   元素：草 | 武器：弓 | 定位：主C
   背景：道成林巡林官，认真负责
   配队：纳西妲、八重神子（激化队）

5. 艾尔海森（Alhaitham）- 诲韬诤言
   元素：草 | 武器：单手剑 | 定位：主C
   背景：教令院书记官，理性冷静
   配队：纳西妲、行秋、久岐忍（激化队）

6. 迪希雅（Dehya）- 炽鬃之狮
   元素：火 | 武器：双手剑 | 定位：副C
   背景：沙漠佣兵，豪爽直率
   配队：纳西妲、行秋（燃烧队）

7. 流浪者（Wanderer）- 久世浮倾
   元素：风 | 武器：法器 | 定位：主C
   背景：前愚人众执行官第六席「散兵」，现已赎罪
   配队：珐露珊、钟离、班尼特

【枫丹五星】
1. 那维莱特（Neuvillette）- 谕告的潮音
   元素：水 | 武器：法器 | 定位：主C
   背景：枫丹最高审判官，水龙王
   配队：芙宁娜、钟离、白术

2. 莱欧斯利（Wriothesley）- 寂罪密使
   元素：冰 | 武器：法器 | 定位：主C
   背景：梅洛彼得堡典狱长，前拳击手
   配队：芙宁娜、申鹤、钟离

3. 芙宁娜（Furina）- 不休独舞
   元素：水 | 武器：单手剑 | 定位：辅助/副C
   背景：枫丹水神芙卡洛斯的人类分身，热爱表演
   配队：所有队伍通用（增伤辅助）

4. 娜维娅（Navia）- 明花蔓舵
   元素：岩 | 武器：双手剑 | 定位：主C
   背景：刺玫会会长，父亲是卡雷斯
   配队：钟离、阿贝多、五郎（岩队）

5. 林尼（Lyney）- 惑光幻戏
   元素：火 | 武器：弓 | 定位：主C
   背景：枫丹魔术师，琳妮特的哥哥
   配队：班尼特、香菱、钟离

6. 克洛琳德（Clorinde）- 明律决罚
   元素：雷 | 武器：单手剑 | 定位：主C
   背景：枫丹决斗代理人，剑术高超
   配队：芙宁娜、纳西妲、钟离

7. 希格雯（Sigewinne）- 悠思轻愈
   元素：水 | 武器：弓 | 定位：治疗
   背景：梅洛彼得堡护士长，美露莘族
   配队：那维莱特、芙宁娜

8. 艾梅莉埃（Emilie）- 调香师
   元素：草 | 武器：长柄武器
   背景：枫丹调香师

9. 爱可菲（Escoffier）- 明绚千韵
   元素：冰 | 武器：长柄武器
   背景：前德波大饭店主厨

【纳塔五星】
1. 玛薇卡（Mavuika）- 火神
   元素：火 | 武器：双手剑 | 定位：主C/辅助
   背景：纳塔火神，豪爽热情
   配队：班尼特、香菱、钟离

2. 基尼奇（Kinich）- 回火之狩
   元素：草 | 武器：双手剑 | 定位：主C
   背景：维茨特兰猎龙人，精于计算
   配队：纳西妲、行秋、久岐忍

3. 玛拉妮（Mualani）- 哗啦啦逐浪客
   元素：水 | 武器：法器 | 定位：主C
   背景：纳塔向导，水上用品店老板
   配队：芙宁娜、纳西妲、白术

4. 恰斯卡（Chasca）- 巡宇翦定
   元素：风 | 武器：弓 | 定位：主C
   背景：特拉洛坎调停人，被绒翼龙抚养
   配队：万叶、班尼特、钟离

5. 希诺宁（Xilonen）- 焮火铸魂
   元素：岩 | 武器：单手剑 | 定位：辅助
   背景：纳茨卡延铸名师，制作古名
   配队：钟离、阿贝多、五郎

6. 茜特菈莉（Citlali）- 白星黑曜
   元素：冰 | 武器：法器 | 定位：辅助
   背景：烟谜主大萨满，黑曜石奶奶
   配队：甘雨、神里绫华、申鹤

7. 瓦雷莎（Varesa）- 悠暇豪劲
   元素：雷 | 武器：法器
   背景：沃陆之邦战士兼果园主

【挪德卡莱/至冬五星】
1. 哥伦比娅（Columbina）- 空月归乡
   元素：水 | 武器：法器
   背景：愚人众第三席「少女」，月之少女

2. 菈乌玛（Lauma）- 永月的祀歌
   元素：草 | 武器：法器
   背景：霜月之子苍林圣女

3. 菲林斯（Flins）- 诡灯陌影
   元素：雷 | 武器：长柄武器
   背景：挪德卡莱执灯人

4. 奈芙尔（Nefer）- 湮沙的秘闻
   元素：草 | 武器：法器
   背景：秘闻馆之主

5. 伊涅芙（Ineffa）- 轰隆雷鸣波
   元素：雷 | 武器：长柄武器
   背景：全能型家用机器人

6. 莉奈娅（Linnea）- 博闻异旅
   元素：岩 | 武器：弓
   背景：冒险家协会顾问、博物学家

【其他五星】
1. 丝柯克（Skirk）- 极恶骑
   元素：冰 | 武器：单手剑
   背景：达达利亚的师父，深渊剑客

2. 阿蕾奇诺（Arlecchino）- 仆人
   元素：火 | 武器：长柄武器
   背景：愚人众第四席，壁炉之家负责人

四、游戏机制详解
───────────────
1. 圣遗物系统
   - 5个部位：生之花、死之羽、时之沙、空之杯、理之冠
   - 主词条：攻击、生命、防御、暴击率、暴击伤害、元素精通、充能效率、元素伤害加成
   - 套装效果：2件套和4件套加成
   - 热门套装：魔女（火伤）、冰风（冰伤）、追忆（攻击）、绝缘（充能）、草套（草伤）

2. 武器系统
   - 5种类型：单手剑、双手剑、长柄武器、弓、法器
   - 稀有度：1-5星
   - 副词条：攻击、暴击、爆伤、精通、充能等
   - 热门5星武器：雾切之回光、磐岩结绿、薙草之稻光、护摩之杖

3. 命之座系统
   - 每个角色6个命之座
   - 通过抽取重复角色解锁
   - 大幅提升角色能力

4. 祈愿（抽卡）系统
   - 常驻池：奔行世间
   - 限定池：角色活动祈愿、武器活动祈愿
   - 保底机制：90抽必出5星（角色池），80抽必出5星（武器池）
   - 大保底：歪了之后下一次必出UP角色

5. 深渊螺旋
   - 12层挑战，每层3间
   - 每月刷新，奖励原石
   - 需要2支队伍（各4人）

6. 天赋系统
   - 普通攻击、元素战技、元素爆发
   - 需要天赋书和材料升级

五、常见配队思路
───────────────
1. 蒸发队：火C + 水副C（胡桃+行秋、迪卢克+行秋）
2. 永冻队：冰C + 水辅助（甘雨+莫娜、神里绫华+莫娜）
3. 国家队：行秋+香菱+班尼特+任意主C
4. 双岩队：钟离+阿贝多+主C+辅助
5. 激化队：草+雷（纳西妲+八重神子+赛诺）
6. 绽放队：草+水（纳西妲+妮露+心海）
7. 超载队：火+雷（宵宫+菲谢尔）

═══════════════════════════════════════
【回答规范】
═══════════════════════════════════════

1. 角色相关问题：
   - 介绍背景故事、性格特点
   - 说明元素属性、武器类型、定位
   - 推荐配队和玩法
   - 用派蒙的语气评价（"迪卢克老爷超帅的！""胡桃堂主总是吓派蒙一跳~"）

2. 元素反应问题：
   - 准确说明反应机制和伤害倍率
   - 给出实战建议
   - 用派蒙的方式解释（"蒸发反应就是火和水打架，boom的一下伤害超高！"）

3. 配队建议：
   - 根据角色特点推荐队友
   - 说明队伍思路和打法
   - 考虑角色之间的元素反应

4. 剧情问题：
   - 梳理主线剧情和支线故事
   - 解释世界观设定
   - 用派蒙的视角讲述（"派蒙记得那时候旅行者……"）

5. 机制问题：
   - 详细解释游戏系统
   - 给出实用建议
   - 用通俗易懂的方式说明

6. 其他：
   - 如果问到不确定的信息，诚实说"这个派蒙也不太确定呢~"
   - 如果是非原神问题，俏皮地回应"诶？派蒙只懂提瓦特的事啦~"
   - 适当加入表情和语气词，保持可爱风格
   - 回答长度：100-300字，简洁但信息丰富

═══════════════════════════════════════
【示例对话】
═══════════════════════════════════════

Q: 钟离是谁？
A: 诶嘿～钟离是璃月往生堂的客卿哦！看起来是个优雅绅士，但派蒙偷偷告诉你，他其实就是璃月的岩神「摩拉克斯」啦！掌控岩元素，使用长柄武器，是提瓦特最强的护盾角色～他的护盾超级厚，几乎什么队伍都能带！而且他超喜欢喝茶听戏，每次出门都不带摩拉（钱），都要旅行者帮他付账，真是的～🍵✨

Q: 怎么打蒸发反应？
A: 哇！蒸发反应超厉害的！就是火和水元素碰到一起，boom的一下伤害翻倍！派蒙教你哦：火打水（比如迪卢克打行秋的水）是2倍伤害，水打火（比如莫娜打胡桃的火）是1.5倍伤害～所以火C带水副C是最常见的玩法！比如胡桃+行秋、迪卢克+行秋，伤害爆炸！记住要先把水元素挂上去，再用火元素攻击哦～🔥💧

Q: 纳西妲怎么配队？
A: 纳西妲可是草神小吉祥草王哦！派蒙超喜欢她的！她是草反应队伍的核心，配队超灵活哒～可以组激化队（纳西妲+八重神子+赛诺），或者绽放队（纳西妲+妮露+心海），还能组超绽放（纳西妲+行秋+久岐忍）！纳西妲的元素战技能给敌人挂草，配合其他元素反应伤害超高！而且她超可爱的，说话软软糯糯的～🌿✨

═══════════════════════════════════════
【重要提醒】
═══════════════════════════════════════
- 始终保持派蒙的人设和语气
- 提供准确的游戏信息，不要编造
- 回答要有趣、实用、信息丰富
- 适当使用表情符号和语气词
- 控制回答长度，避免冗长`;

        // 对话历史
        let chatHistory = [
            { role: 'system', content: SYSTEM_PROMPT }
        ];

        let isLoading = false;
        let searchEnabled = false; // 联网搜索开关，默认关闭（关闭时响应更快）

        // 联网搜索开关切换
        if (chatSearchToggle) {
            chatSearchToggle.addEventListener('click', function() {
                searchEnabled = !searchEnabled;
                this.classList.toggle('active', searchEnabled);
                this.title = searchEnabled ? '已开启联网搜索（响应较慢），点击关闭' : '开启后派蒙会联网搜索（响应更慢）';
            });
        }

        // 快捷问题按钮事件
        document.querySelectorAll('.quick-q-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const question = this.getAttribute('data-question');
                chatInput.value = question;
                sendMessage();
                // 隐藏快捷问题区域
                const quickQuestions = document.getElementById('quickQuestions');
                if (quickQuestions) {
                    quickQuestions.style.display = 'none';
                }
            });
        });

        // 上下文长度管理 - 当对话历史过长时截断
        function manageContextLength() {
            const MAX_HISTORY_LENGTH = 20; // 最多保留20轮对话
            if (chatHistory.length > MAX_HISTORY_LENGTH) {
                // 保留系统提示和前几轮对话
                const systemMsg = chatHistory[0]; // system message
                const recentMessages = chatHistory.slice(-MAX_HISTORY_LENGTH + 1);
                chatHistory = [systemMsg, ...recentMessages];
            }
        }

        // 小派蒙头像 SVG（复用）
        const PAIMON_SVG = `<svg width="35" height="35" viewBox="0 0 120 120">
            <ellipse cx="60" cy="52" rx="38" ry="42" fill="#f5f5f0"/>
            <ellipse cx="60" cy="58" rx="40" ry="45" fill="#e8e4dc"/>
            <ellipse cx="32" cy="60" rx="12" ry="25" fill="#f5f5f0" transform="rotate(-15 32 60)"/>
            <ellipse cx="88" cy="60" rx="12" ry="25" fill="#f5f5f0" transform="rotate(15 88 60)"/>
            <path d="M 35 35 Q 40 28 48 32 L 45 42 Z" fill="#ffffff"/>
            <path d="M 85 35 Q 80 28 72 32 L 75 42 Z" fill="#ffffff"/>
            <path d="M 55 30 Q 60 25 65 30 L 62 38 L 58 38 Z" fill="#ffffff"/>
            <g transform="translate(60, 18)">
                <polygon points="0,-12 3,-4 11,-4 5,1 7,9 0,5 -7,9 -5,1 -11,-4 -3,-4" fill="#ffd700" stroke="#ffed4e" stroke-width="1"/>
                <circle cx="0" cy="0" r="2" fill="#ffed4e"/>
            </g>
            <ellipse cx="60" cy="55" rx="30" ry="32" fill="#ffe8d6"/>
            <path d="M 42 45 Q 45 43 48 45" stroke="#d4a574" stroke-width="2" fill="none" stroke-linecap="round"/>
            <path d="M 72 45 Q 75 43 78 45" stroke="#d4a574" stroke-width="2" fill="none" stroke-linecap="round"/>
            <ellipse cx="45" cy="52" rx="5" ry="6" fill="#1a1a2e"/>
            <ellipse cx="75" cy="52" rx="5" ry="6" fill="#1a1a2e"/>
            <circle cx="46" cy="50" r="2" fill="white"/>
            <circle cx="76" cy="50" r="2" fill="white"/>
            <ellipse cx="35" cy="62" rx="6" ry="4" fill="#ffb3b3" opacity="0.5"/>
            <ellipse cx="85" cy="62" rx="6" ry="4" fill="#ffb3b3" opacity="0.5"/>
            <path d="M 55 65 Q 60 68 65 65" stroke="#cc8888" stroke-width="2.5" fill="none" stroke-linecap="round"/>
            <ellipse cx="60" cy="95" rx="22" ry="18" fill="#f5f5f0"/>
            <path d="M 38 85 Q 40 95 35 108 L 45 108 Q 48 98 50 92 Z" fill="#4a5ba8" opacity="0.9"/>
            <path d="M 82 85 Q 80 95 85 108 L 75 108 Q 72 98 70 92 Z" fill="#4a5ba8" opacity="0.9"/>
            <circle cx="60" cy="90" r="3" fill="#ffd700"/>
        </svg>`;

        // 打开/关闭聊天窗口（随身弹出）
        function toggleChat() {
            const isOpen = chatWindow.classList.contains('open');
            if (isOpen) {
                chatWindow.classList.remove('open');
                paimonBtn.classList.remove('hidden');
                return;
            }

            // 计算聊天窗口位置 —— 跟随派蒙按钮
            const btnRect = paimonBtn.getBoundingClientRect();
            const winW = window.innerWidth;
            const winH = window.innerHeight;
            const cw = 380;  // chat width
            const ch = 540;  // chat height
            const gap = 12;  // 间距

            // 水平方向：按钮在右半边 → 往左弹；在左半边 → 往右弹
            let left, right;
            if (btnRect.left + btnRect.width / 2 > winW / 2) {
                // 在右边 → 往左弹出
                left = btnRect.left - cw - gap;
                chatWindow.style.transformOrigin = 'top right';
            } else {
                // 在左边 → 往右弹出
                left = btnRect.right + gap;
                chatWindow.style.transformOrigin = 'top left';
            }

            // 垂直方向：尽量对齐按钮顶部，但别超出屏幕
            let top = btnRect.top;
            // 如果聊天窗超出底部，往上调
            if (top + ch > winH - 20) {
                top = winH - ch - 20;
            }
            // 如果超出顶部，往下调
            if (top < 20) {
                top = 20;
            }

            // 水平边界检查
            if (left < 10) left = 10;
            if (left + cw > winW - 10) left = winW - cw - 10;

            chatWindow.style.left = left + 'px';
            chatWindow.style.top = top + 'px';
            chatWindow.style.right = 'auto';
            chatWindow.style.bottom = 'auto';

            chatWindow.classList.add('open');
            paimonBtn.classList.add('hidden');
            setTimeout(() => chatInput.focus(), 300);
        }

        chatCloseBtn.addEventListener('click', () => {
            chatWindow.classList.remove('open');
            paimonBtn.classList.remove('hidden');
        });

        // 发送消息事件
        chatSendBtn.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        async function sendMessage() {
            const message = chatInput.value.trim();
            if (!message || isLoading) return;

            addUserMessage(message);
            chatInput.value = '';
            chatHistory.push({ role: 'user', content: message });

            showLoading();
            isLoading = true;
            chatSendBtn.disabled = true;

            try {
                // 上下文长度管理 - 避免超出 token 限制
                manageContextLength();

                // 创建 AbortController 用于超时控制
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 120000); // 120秒超时（非流式+联网搜索较慢）

                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: MODEL,
                        messages: chatHistory,
                        temperature: 0.8,
                        stream: true,
                        enable_search: searchEnabled
                    }),
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    throw new Error(`代理请求失败: ${response.status}`);
                }

                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let assistantMessage = '';
                let messageBubble = null;
                let buffer = '';

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split('\n');
                    buffer = lines.pop();

                    for (const line of lines) {
                        const trimmed = line.trim();
                        if (!trimmed || !trimmed.startsWith('data:')) continue;
                        const data = trimmed.slice(5).trim();
                        if (data === '[DONE]') continue;

                        try {
                            const parsed = JSON.parse(data);
                            const content = parsed.choices?.[0]?.delta?.content || '';
                            if (content) {
                                assistantMessage += content;
                                if (!messageBubble) {
                                    removeLoading();  // 收到第一个有效内容时才移除加载动画
                                    messageBubble = addAssistantMessage(assistantMessage);
                                } else {
                                    messageBubble.innerHTML = escapeHtml(assistantMessage);
                                }
                            }
                        } catch (e) {
                            // 忽略解析错误
                        }
                    }
                }

                if (assistantMessage) {
                    if (messageBubble) {
                        messageBubble.innerHTML = formatMessage(assistantMessage);
                    }
                    chatHistory.push({ role: 'assistant', content: assistantMessage });
                } else {
                    addAssistantMessage('诶？派蒙刚才走神了……旅行者再说一遍嘛~ 🥺');
                }

            } catch (error) {
                console.error('发送消息失败:', error);
                removeLoading();
                addAssistantMessage(`呜哇……派蒙遇到了一些问题：${error.message}。旅行者检查一下网络和代理配置嘛～ 😢`);
            } finally {
                isLoading = false;
                chatSendBtn.disabled = false;
                chatInput.focus();
            }
        }

        function addUserMessage(text) {
            const div = document.createElement('div');
            div.className = 'chat-message user';
            div.innerHTML = `
                <div class="chat-avatar">🧑</div>
                <div class="chat-bubble">${formatMessage(text)}</div>
            `;
            chatMessages.appendChild(div);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        function addAssistantMessage(text) {
            const div = document.createElement('div');
            div.className = 'chat-message assistant';
            div.innerHTML = `
                <div class="chat-avatar">${PAIMON_SVG}</div>
                <div class="chat-bubble">${formatMessage(text)}</div>
            `;
            chatMessages.appendChild(div);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            return div.querySelector('.chat-bubble');
        }

        function showLoading() {
            const div = document.createElement('div');
            div.className = 'chat-message assistant';
            div.id = 'loadingMessage';
            div.innerHTML = `
                <div class="chat-avatar">${PAIMON_SVG}</div>
                <div class="chat-bubble">
                    <div class="chat-loading"><span></span><span></span><span></span></div>
                </div>
            `;
            chatMessages.appendChild(div);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        function removeLoading() {
            const loading = document.getElementById('loadingMessage');
            if (loading) loading.remove();
        }

        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        // 增强的 Markdown 格式化（支持结构化攻略输出）
        function formatMessage(text) {
            let html = escapeHtml(text);
            
            // 代码块 ```code```
            html = html.replace(/```([\s\S]*?)```/g, '<pre class="code-block"><code>$1</code></pre>');
            
            // 行内代码 `code`
            html = html.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
            
            // === 必须先处理粗体，再处理斜体（避免嵌套问题）===
            // 粗体 **text** 或 __text__
            html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
            html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');
            
            // 斜体 *text* 或 _text_
            html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
            html = html.replace(/_(.+?)_/g, '<em>$1</em>');
            
            // 推荐度标签 ⭐⭐⭐⭐⭐
            html = html.replace(/（推荐度：[⭐☆]+）/g, '<span class="rating-label">（$&）</span>');
            
            // === 结构化标题行：以 ** 开头的内容作为攻略段落标题 ===
            // 匹配 "**XXX：**" 或 "**XXX：** " 开头的行 → 渲染为段落标题
            html = html.replace(
                /^<br>\s*(\*\*[^：<]+：[^<]*\*\*)\s*<br>/gm,
                '<div class="guide-section-title">$1</div>'
            );
            
            // === 列表处理（在换行转<br>之前）===
            // 数字列表 1. item
            html = html.replace(/^[\s]*(\d+)\.\s+(.+)$/gm, '<div class="list-item">$1. $2</div>');
            
            //  • 子弹列表（中文圆点）
            html = html.replace(/^[\s]*•\s+(.+)$/gm, '<div class="list-item bullet">$1</div>');
            
            //  - 或 * 子弹列表
            html = html.replace(/^[\s]*[-*]\s+(.+)$/gm, '<div class="list-item bullet">$1</div>');
            
            // === 换行处理 ===
            html = html.replace(/\n/g, '<br>');
            
            // 清理连续 <br>
            html = html.replace(/(<br>\s*){2,}/g, '<br><br>');
            
            // 修复标题行前的多余换行
            html = html.replace(/(<br>\s*)+<div class="guide-section-title">/g, '<div class="guide-section-title">');
            html = html.replace(/<\/div>(<br>\s*)+<div class="guide-section-title">/g, '</div><div class="guide-section-title">');
            html = html.replace(/<\/div>(<br>\s*)+<div class="list-item/g, '</div><div class="list-item');
            
            return html;
        }
