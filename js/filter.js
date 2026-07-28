        // 筛选功能
        const filterButtons = document.querySelectorAll('.filter-btn');
        const characterCards = document.querySelectorAll('.character-card');
        const noResults = document.querySelector('.no-results');

        let currentElementFilter = 'all';
        let currentWeaponFilter = 'all';

        // 为筛选按钮添加点击事件
        filterButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const filterType = this.getAttribute('data-type');
                const filterValue = this.getAttribute('data-filter');

                if (filterType === 'element') {
                    currentElementFilter = filterValue;
                } else if (filterType === 'weapon') {
                    currentWeaponFilter = filterValue;
                }

                const sameTypeButtons = document.querySelectorAll(`.filter-btn[data-type="${filterType}"]`);
                sameTypeButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                applyFilters();
            });
        });

        function applyFilters() {
            let visibleCount = 0;

            characterCards.forEach(card => {
                const cardElement = card.getAttribute('data-element');
                const cardWeapon = card.getAttribute('data-weapon');

                const elementMatch = currentElementFilter === 'all' || cardElement === currentElementFilter;
                const weaponMatch = currentWeaponFilter === 'all' || cardWeapon === currentWeaponFilter;

                if (elementMatch && weaponMatch) {
                    card.classList.remove('hidden');
                    visibleCount++;
                } else {
                    card.classList.add('hidden');
                }
            });

            if (visibleCount === 0) {
                noResults.classList.add('show');
            } else {
                noResults.classList.remove('show');
            }

            // 隐藏没有可见角色的地区区块
            document.querySelectorAll('.region-section').forEach(section => {
                const visible = section.querySelectorAll('.character-card:not(.hidden)').length;
                section.style.display = visible === 0 ? 'none' : 'block';
            });
        }

        // ========================
        // 折叠 / 展开 功能
        // ========================

        let allRegionsCollapsed = false; // 全局状态

        // 1. 地区折叠 —— 点击标题切换
        document.querySelectorAll('.region-title').forEach(title => {
            title.addEventListener('click', function(e) {
                // 如果点到了 toggle 按钮本身，不重复触发
                if (e.target.closest('.region-toggle')) return;
                const section = this.closest('.region-section');
                section.classList.toggle('collapsed');
                updateToggleAllBtn();
            });
        });

        // 2. 角色卡片折叠 —— 点击卡片切换描述显示
        characterCards.forEach(card => {
            card.addEventListener('click', function(e) {
                // 如果点到了提示条或描述区域，算作卡片点击，不影响
                this.classList.toggle('collapsed');
                const hintText = this.querySelector('.hint-text');
                const hintIcon = this.querySelector('.hint-icon');
                if (hintText) {
                    hintText.textContent = this.classList.contains('collapsed')
                        ? '点击展开详情'
                        : '点击收起详情';
                }
            });
        });

        // 3. 全局全部展开 / 收起
        const toggleAllBtn = document.getElementById('toggleAllBtn');
        toggleAllBtn.addEventListener('click', function() {
            allRegionsCollapsed = !allRegionsCollapsed;

            document.querySelectorAll('.region-section').forEach(section => {
                if (allRegionsCollapsed) {
                    section.classList.add('collapsed');
                } else {
                    section.classList.remove('collapsed');
                }
            });

            // 同时收起/展开所有卡片详情
            characterCards.forEach(card => {
                if (allRegionsCollapsed) {
                    card.classList.add('collapsed');
                    const hintText = card.querySelector('.hint-text');
                    if (hintText) hintText.textContent = '点击展开详情';
                } else {
                    card.classList.remove('collapsed');
                    const hintText = card.querySelector('.hint-text');
                    if (hintText) hintText.textContent = '点击收起详情';
                }
            });

            updateToggleAllBtn();
        });

        // 更新全局按钮文字
        function updateToggleAllBtn() {
            const collapsedCount = document.querySelectorAll('.region-section.collapsed').length;
            const totalCount = document.querySelectorAll('.region-section').length;
            const allCollapsed = collapsedCount === totalCount;
            allRegionsCollapsed = allCollapsed;

            if (allCollapsed) {
                toggleAllBtn.innerHTML = '<span>📖</span> 全部展开';
            } else if (collapsedCount === 0) {
                toggleAllBtn.innerHTML = '<span>📂</span> 全部收起';
            } else {
                toggleAllBtn.innerHTML = '<span>📂</span> 全部收起';
            }
        }

        // ========================
        // 横向滚动控制
        // ========================

        // 每个滚动区域绑定箭头按钮
        document.querySelectorAll('.scroll-wrapper').forEach(wrapper => {
            const scrollContainer = wrapper.querySelector('.characters-scroll');
            const leftBtn = wrapper.querySelector('.scroll-arrow.left');
            const rightBtn = wrapper.querySelector('.scroll-arrow.right');

            if (!scrollContainer || !leftBtn || !rightBtn) return;

            const scrollAmount = () => {
                const card = scrollContainer.querySelector('.character-card');
                if (!card) return 300;
                return card.offsetWidth + 20; // card width + gap
            };

            leftBtn.addEventListener('click', () => {
                scrollContainer.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
            });

            rightBtn.addEventListener('click', () => {
                scrollContainer.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
            });

            // 鼠标滚轮横向滚动
            scrollContainer.addEventListener('wheel', (e) => {
                if (e.deltaY !== 0) {
                    e.preventDefault();
                    scrollContainer.scrollBy({ left: e.deltaY * 2, behavior: 'auto' });
                }
            }, { passive: false });

            // 更新箭头可见性
            function updateArrows() {
                const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;
                leftBtn.classList.toggle('hidden', scrollLeft <= 2);
                rightBtn.classList.toggle('hidden', scrollLeft + clientWidth >= scrollWidth - 2);
            }

            scrollContainer.addEventListener('scroll', updateArrows);
            // 初始检查（延迟确保布局完成）
            setTimeout(updateArrows, 100);
            // 窗口改变时重新检查
            window.addEventListener('resize', updateArrows);
        });
