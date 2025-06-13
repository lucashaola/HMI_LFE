document.addEventListener('DOMContentLoaded', function () {
    preventDoubleTapZoom();
    initializeWelcomeScreen();


    if (window.location.pathname.includes('/views/profile')) {
        initializeProfileScreen();
    }
});

function preventDoubleTapZoom() {
    document.addEventListener('touchstart', function (event) {
        if (event.touches.length > 1) {
            event.preventDefault();
        }
    }, {passive: false});

    document.addEventListener('touchend', function (event) {
        const now = (new Date()).getTime();
        if (this.lastTouchEnd && (now - this.lastTouchEnd) < 300) {
            event.preventDefault();
        }
        this.lastTouchEnd = now;
    }, {passive: false});
}

function initializeWelcomeScreen() {
    const welcomeHeading = document.querySelector('.welcome h1');
    if (!welcomeHeading) return;
    if (welcomeHeading) {
        const username = localStorage.getItem('userName');
        if (username) {
            welcomeHeading.innerHTML = `<img src="../../assets/icons/welcome/Profile.svg" class="welcome-icon" alt=""> Willkommen ${username}!`;
        }

        showProgressOverview();
    }

    const userSwitch = document.getElementById("userSwitch");
    if (userSwitch) {
        userSwitch.addEventListener("click", checkForExistingProfile);
    }

    closeResultsOnOutsideClick();
}

/** Closes the search results dropdown when clicking outside the search container */
function closeResultsOnOutsideClick(){
    const searchContainer = document.querySelector('.search-container');
    if (searchContainer) {
        const results = document.querySelector('.results');
        if (results) {
            results.addEventListener('click', function (event) {
                event.stopPropagation();
            });
        }

        document.addEventListener('click', function (event) {
            if (searchContainer && !searchContainer.contains(event.target)) {
                const results = document.getElementById('results');
                if (results) {
                    results.style.display = 'none';
                }
            }
        });
    }
}

/** Manages the profile screen, allowing users to switch between different views */
function initializeProfileScreen() {
    const profileName = document.getElementById('profileName');
    const username = localStorage.getItem('userName');
    if (username) {
        profileName.textContent = username;
    }

    const buttons = {
        overview: {
            button: document.querySelector('.overview-btn'),
            overview: document.querySelector('.progress-overview'),
            callback: typeof showProgressOverview === 'function' ? showProgressOverview : null
        },
        bonus: {
            button: document.querySelector('.bonus-btn'),
            overview: document.querySelector('.bonus-overview'),
            callback: typeof showBonusOverview === 'function' ? showBonusOverview : null
        },
        test: {
            button: document.querySelector('.test-btn'),
            overview: document.querySelector('.test-overview'),
            callback: typeof showTestOverview === 'function' ? showTestOverview : null
        },
        saved: {
            button: document.querySelector('.saved-btn'),
            overview: document.querySelector('.saved-pages'),
            callback: typeof showSavedPages === 'function' ? showSavedPages : null
        }
    };

    const setActiveView = (activeKey) => {
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set('view', activeKey);
        history.replaceState({}, '', newUrl.toString());

        Object.keys(buttons).forEach((key) => {
            const {button, overview, callback} = buttons[key];
            const isActive = key === activeKey;

            button?.classList.toggle('selected', isActive);
            overview.style.display = isActive ? 'flex' : 'none';

            if (isActive && callback) {
                callback();
            }
        });
    };

    Object.keys(buttons).forEach((key) => {
        const {button} = buttons[key];
        button?.addEventListener('click', () => setActiveView(key));
    });

    const urlParams = new URLSearchParams(window.location.search);
    const viewParam = urlParams.get('view');

    setActiveView(viewParam || 'overview');
}

/** Filters and displays search results based on user input */
function filterResults() {
    const searchInput = document.querySelector('.search');
    const resultsDiv = document.getElementById('results');
    if (!searchInput || !resultsDiv) return;

    const searchTerm = searchInput.value.toLowerCase().trim();

    if (searchTerm.length < 2) {
        resultsDiv.style.display = 'none';
        return;
    }

    let searchResults = [];

    Object.entries(tutorialContent).forEach(([contentId, content]) => {
        content.content.forEach((slide, index) => {
            const text = slide.text || '';
            const subtext = slide.subtext || '';

            if (text.toLowerCase().includes(searchTerm) ||
                subtext.toLowerCase().includes(searchTerm) ||
                content.title.toLowerCase().includes(searchTerm)) {
                searchResults.push({
                    title: content.title,
                    text: text,
                    subtext: subtext,
                    contentId: contentId,
                    slideIndex: index
                });
            }
        });
    });

    if (searchResults.length > 0) {
        resultsDiv.style.display = 'block';
        resultsDiv.innerHTML = searchResults.map(result => `
            <div class="result-item" onclick="${window.location.pathname.includes('tutorial') ?
            `showSearchResult('${result.contentId}')` :
            `localStorage.setItem('selectedCategory', '${result.contentId}'); 
                 localStorage.setItem('selectedSlide', '${result.slideIndex}'); 
                 window.location.href='/views/tutorial'`}">
                <strong>${tutorialContent[result.contentId].title}</strong><br>
                <small>${result.text ? result.text.substring(0, 100) + '...' : ''}</small>
                ${result.subtext ? `<br><small>${result.subtext}</small>` : ''}
            </div>
        `).join('');
    } else {
        resultsDiv.style.display = 'block';
        resultsDiv.innerHTML = '<div class="result-item">Keine Ergebnisse gefunden</div>';
    }
}