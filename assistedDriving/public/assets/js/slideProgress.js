/** Contains methods for verifying users, calculating progress, and updating progress */
const progressTracker = {
    verifyUser: async function () {
        const userCode = localStorage.getItem('userCode');
        if (!userCode) return false;

        try {
            const response = await fetch(`/api/users/${userCode}/verify`);
            const data = await response.json();

            if (!data.exists) {
                this.clearUserData();
                return false;
            }

            return true;
        } catch (error) {
            console.error('Error verifying user:', error);
            return false;
        }
    },

    isUserLoggedIn: function () {
        return !!localStorage.getItem('userCode');
    },

    clearUserData: function () {
        localStorage.removeItem('userCode');
    },

    handleResponse: async function (response) {
        if (response.status === 401) {
            const data = await response.json();
            if (data.action === 'CLEAR_LOCAL_STORAGE') {
                this.clearUserData();
            }
            return null;
        }
        return response;
    },

    calculateProgress: async function (category) {
        if (!this.isUserLoggedIn()) {
            return 0;
        }

        const userCode = localStorage.getItem('userCode');
        try {
            const response = await fetch(`/api/users/${userCode}/unlocked-categories`);
            const data = await response.json();
            const unlockedCategories = JSON.parse(data.unlocked_categories || '[]');
            return unlockedCategories.includes(category) ? 100 : 0;
        } catch (error) {
            console.error('Error calculating progress:', error);
            return 0;
        }
    },

    updateProgress: async function (category, progress) {
        if (!this.isUserLoggedIn()) {
            return;
        }

        const userCode = localStorage.getItem('userCode');
        try {
            const response = await fetch(`/api/users/${userCode}/progress`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    category: category,
                    progress: progress
                })
            });

            await this.handleResponse(response);

            if (progress === 100) {
                await unlockCategory(category);
            }
        } catch (error) {
            console.error('Error updating progress:', error);
        }
    }
};

/** Updates the visual representation of progress based on the calculated progress */
function updateProgressCircle(element, progress) {
    const circle = element.querySelector('.progress-ring-progress');
    const circumference = 2 * Math.PI * 12; // ~75.398
    const offset = circumference - (progress / 100) * circumference;

    circle.style.strokeDashoffset = offset;

    if (progress === 100) {
        element.classList.add('completed');
    } else {
        element.classList.remove('completed');
    }
}

/* Renders the progress overview on the welcome or profile screen */
async function showProgressOverview() {
    const identificationCode = localStorage.getItem('userCode');
    const progressOverview = document.querySelector('.progress-overview');

    if (!progressOverview) {
        console.warn('progressOverview element not found.');
        return;
    }

    if (!identificationCode) {
        progressOverview.innerHTML = `
            <div class="no-content">
                <p>Melden Sie sich an, um Ihren Fortschritt zu sehen.</p>
            </div>
        `;

        return;
    }

    try {
        const verifyResponse = await fetch(`/api/users/${identificationCode}/verify`);
        const verifyData = await verifyResponse.json();

        if (!verifyData.exists) {
            localStorage.removeItem('userCode');
            return;
        }

        //const response = await fetch(`/api/users/${identificationCode}`); // Changed endpoint
        const response = await fetch(`/api/users/${identificationCode}`);
        const userData = await response.json();
        const unlockedCategories = JSON.parse(userData.unlocked_categories || '[]');

        //categories = categories.map(category => ({
        const prefs = JSON.parse(localStorage.getItem('preferences') || '[]');
        const filtered = prefs.length > 0 ? categories.filter(c => prefs.includes(c.key)) : categories;
        categories = filtered.map(category => ({
            ...category,
            progress: unlockedCategories.includes(category.key) ? 100 : 0
        }));

        //const totalProgress = Math.round((unlockedCategories.length / categories.length) * 100);
         const totalProgress = Math.round((unlockedCategories.filter(c => prefs.length === 0 || prefs.includes(c)).length / categories.length) * 100);
        const totalProgressHTML = `
            <div class="total-progress-container">
                <div class="total-progress-bar">
                    <div class="total-progress-fill ${totalProgress === 0 ? 'zero-progress' : ''}" style="width: ${totalProgress}%">
                        ${totalProgress}%
                    </div>
                </div>
            </div>
        `;
        const renderCategoryItem = (category) => {
            const categoryName = isWelcomeScreen ?
                category.name.replace('Adaptiver Geschwindigkeitsassistent', 'Adaptiver <br>Geschwindigkeitsassistent') :
                category.name;

            return `
                <div class="slideProgress-progress-circle-item">
                    <img src="${category.icon}" class="category-icon" alt="">
                    <div class="category-info">
                        <div class="category-name">${categoryName}</div>
                    </div>
                    <div class="progress-circle">
                        <div class="circle-icon">✓</div>
                        <svg class="progress-ring">
                            <circle class="progress-ring-bg" cx="16" cy="16" r="12" />
                            <circle class="progress-ring-progress" cx="16" cy="16" r="12" />
                        </svg>
                    </div>
                </div>
            `;
        };

        const isWelcomeScreen = document.querySelector('#tutorial') !== null;
        if (isWelcomeScreen) {
            progressOverview.innerHTML = totalProgressHTML;
            const slider = document.querySelector('.progress-slider');
            const paginationContainer = document.querySelector('.pagination-dots');

            if (slider && paginationContainer) {
                const getItemsPerPage = () => {
                    const menuItem = slider.closest('.menu-item');
                    if (!menuItem) return 6;

                    const totalHeight = menuItem.clientHeight;
                    const progressBarHeight = 50;
                    const paginationHeight = 30;
                    const padding = 40;
                    const footer = 80;

                    const availableHeight = totalHeight - (progressBarHeight + paginationHeight + padding + footer);
                    const singleItemHeight = 70;
                    const gridGap = 20;
                    const itemHeightWithGap = singleItemHeight + gridGap;

                    const possibleRows = Math.floor(availableHeight / itemHeightWithGap);
                    const rows = Math.min(Math.max(possibleRows, 1), 4);

                    return rows * 2;
                };

                const updateSliderContent = () => {
                    slider.innerHTML = '';
                    paginationContainer.innerHTML = '';

                    const itemsPerPage = getItemsPerPage();

                    for (let i = 0; i < Math.ceil(categories.length / itemsPerPage); i++) {
                        const page = document.createElement('div');
                        page.className = 'progress-page';

                        const gridContainer = document.createElement('div');
                        gridContainer.className = 'progress-grid';
                        page.appendChild(gridContainer);

                        for (let j = i * itemsPerPage; j < Math.min((i * itemsPerPage) + itemsPerPage, categories.length); j++) {
                            const category = categories[j];
                            gridContainer.insertAdjacentHTML('beforeend', renderCategoryItem(category));
                            const lastItem = gridContainer.lastElementChild;
                            updateProgressCircle(lastItem, category.progress);
                        }
                        slider.appendChild(page);

                        const dot = document.createElement('div');
                        dot.className = 'dot' + (i === 0 ? ' active' : '');
                        paginationContainer.appendChild(dot);
                    }
                };

                updateSliderContent();

                let resizeTimeout;
                window.addEventListener('resize', () => {
                    clearTimeout(resizeTimeout);
                    resizeTimeout = setTimeout(updateSliderContent, 250);
                });

                slider.addEventListener('scroll', () => {
                    const index = Math.round(slider.scrollLeft / slider.offsetWidth);
                    paginationContainer.querySelectorAll('.dot').forEach((dot, i) => {
                        dot.classList.toggle('active', i === index);
                    });
                });
            }

            document.querySelector('.progress-slider').addEventListener('click', (event) => {
                const item = event.target.closest('.slideProgress-progress-circle-item');
                if (!item) return;

                const categoryName = item.querySelector('.category-name').textContent;
                const selectedCategory = categories.find(category => category.name === categoryName);

                if (selectedCategory) {
                    localStorage.setItem('selectedCategory', selectedCategory.key);
                    window.location.href = '../../views/tutorial';
                } else {
                    console.error(`Category not found for name: ${categoryName}`);
                }
            });
        } else {
            // Profile Screen
            progressOverview.innerHTML = `
                <div class="overview-header">
                    <h1>Fahrerassistenzsysteme</h1>
                    <h2>Gesamter Fortschritt</h2>
                        ${totalProgressHTML}
                </div>
                <h2 class="categories-heading">Kategorien</h2>
                <div class="slideProgress-progress-circles">
                            ${categories.map(category => renderCategoryItem(category, category.progress)).join('')}
                </div>
                <hr>
                <div class="test-action-container">
                    <h2 class="assistant-heading">Testen Sie Ihr Wissen: </h2>
                    <button class="test-btn" onclick="window.location.href='?view=test'"';">Testen</button>
                </div>

            `;

            document.querySelectorAll('.slideProgress-progress-circle-item').forEach(item => {
                const categoryName = item.querySelector('.category-name').textContent;
                const category = categories.find(cat => cat.name === categoryName);
                if (category) {
                    updateProgressCircle(item, category.progress);
                }
            });

            const container = document.querySelector('.slideProgress-progress-circles');
            new PerfectScrollbar(container, {
                wheelSpeed: 1,
                wheelPropagation: true,
                suppressScrollX: true,
                minScrollbarLength: 40,
                scrollbarYMargin: 0,
                railYVisible: true
            });

            document.querySelectorAll('.slideProgress-progress-circle-item').forEach(item => {
                const categoryName = item.querySelector('.category-name').textContent;
                const selectedCategory = categories.find(category => category.name === categoryName);

                let touchStartX = 0;
                let touchStartY = 0;
                let isScrolling = false;
                const movementThreshold = 10; // pixels moved to consider it a scroll

                const handleTap = () => {
                    if (!isScrolling && selectedCategory) {
                        localStorage.setItem('selectedCategory', selectedCategory.key);
                        window.location.href = '../../views/tutorial';
                    }
                };

                // Track touch start position
                item.addEventListener('touchstart', (e) => {
                    touchStartX = e.touches[0].clientX;
                    touchStartY = e.touches[0].clientY;
                    isScrolling = false; // Reset scroll flag
                }, { passive: true });

                // Detect if the user is scrolling (not tapping)
                item.addEventListener('touchmove', (e) => {
                    const touch = e.touches[0];
                    const deltaX = Math.abs(touch.clientX - touchStartX);
                    const deltaY = Math.abs(touch.clientY - touchStartY);

                    // If movement exceeds threshold, mark it as scrolling
                    if (deltaX > movementThreshold || deltaY > movementThreshold) {
                        isScrolling = true;
                    }
                }, { passive: true });

                // Fire only if it wasn't a scroll
                item.addEventListener('touchend', (e) => {
                    if (!isScrolling) {
                        handleTap();
                    }
                    // Reset state
                    isScrolling = false;
                });

                // Desktop click handler
                item.addEventListener('click', handleTap);
            });
        }
    } catch (error) {
        console.error('Error fetching progress:', error);
    }
}