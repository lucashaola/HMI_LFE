/** Determines whether the current page is a tutorial or overview page. */
function getCurrentPageType() {
    return window.location.href.includes('tutorial') ? 'tutorial' : 'overview';
}

/** updates bookmarks button state */
async function initializeBookmark() {
    const bookmarkBtn = document.querySelector('.bookmark-btn');
    const identificationCode = localStorage.getItem('userCode');
    const currentPage = getCurrentPage();
    const pageType = getCurrentPageType();

    if (!currentPage) return;

    try {
        const response = await fetch(`/api/users/${identificationCode}/saved-pages?pageType=${pageType}`);
        const data = await response.json();

        if (data.success &&
            data.savedPages[currentPage.page] &&
            data.savedPages[currentPage.page].includes(currentPage.slideIndex)) {
            bookmarkBtn.classList.add('saved');
        } else {
            bookmarkBtn.classList.remove('saved');
        }
    } catch (error) {
        console.error('Error checking saved status:', error);
    }
}

/** Toggles the bookmark state for the current page by making API calls to save or delete it */
async function toggleBookmark() {
    const bookmarkBtn = document.querySelector('.bookmark-btn');
    const identificationCode = localStorage.getItem('userCode');
    const currentPage = getCurrentPage();
    const pageType = getCurrentPageType();

    if (!currentPage) return;

    try {
        if (bookmarkBtn.classList.contains('saved')) {
            const response = await fetch(`/api/users/${identificationCode}/delete-slide`, {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    page: currentPage.page,
                    slideIndex: currentPage.slideIndex,
                    pageType: pageType
                })
            });

            if (response.ok) {
                bookmarkBtn.classList.remove('saved');
            }
        } else {
            const response = await fetch(`/api/users/${identificationCode}/save-page`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    page: currentPage.page,
                    slideIndex: currentPage.slideIndex,
                    pageType: pageType
                })
            });

            if (response.ok) {
                bookmarkBtn.classList.add('saved');
            }
        }
    } catch (error) {
        console.error('Error toggling bookmark:', error);
    }
}

function getCurrentPage() {
    const pageType = getCurrentPageType();

    if (pageType === 'tutorial') {
        const activeContent = document.querySelector('.content.active');
        if (!activeContent) return null;

        return {
            page: activeContent.id,
            displayName: 'Tutorial: ' + tutorialContent[activeContent.id].title,
            slideIndex: 0  // We no longer have slides, so always 0
        };
    } else {
        const pages = document.querySelectorAll('.content-container .page');
        const currentPage = Array.from(pages).find(page => page.classList.contains('page-active'));
        if (!currentPage) return null;

        return {
            page: 'overview',
            displayName: 'Schnellüberblick',
            slideIndex: Array.from(pages).indexOf(currentPage)
        };
    }
}

/** Fetches and displays all saved pages for the logged-in user */
async function showSavedPages() {
    const savedPagesContainer = document.querySelector('.saved-pages');
    const identificationCode = localStorage.getItem('userCode');

    if (!identificationCode) {
        savedPagesContainer.innerHTML = `
            <div class="no-content">
                <p>Melden Sie sich an, um Ihre gespeicherten Seiten zu sehen.</p>
            </div>
        `;
        return;
    }

    try {
        const tutorialResponse = await fetch(`/api/users/${identificationCode}/saved-pages?pageType=tutorial`);
        const overviewResponse = await fetch(`/api/users/${identificationCode}/saved-pages?pageType=overview`);

        const tutorialData = await tutorialResponse.json();
        const overviewData = await overviewResponse.json();

        if (!tutorialData.success || !overviewData.success) {
            console.error('Failed to fetch saved pages');
            return;
        }

        const savedPagesHTML = [];

        // Handle tutorial pages
        for (const [category, slideIndices] of Object.entries(tutorialData.savedPages)) {
            if (tutorialContent[category]) {
                const content = tutorialContent[category];
                savedPagesHTML.push(createSavedPageHTML(
                    category,
                    0,
                    'tutorial',
                    content.title,
                    content.title,
                    content.content[0].text || '',
                    'Tutorial: ' + content.title
                ));
            }
        }

        // Handle overview pages - note the changes here
        if (overviewData.savedPages.overview) {
            overviewData.savedPages.overview.forEach(index => {
                // Find the corresponding content based on index
                const categoryKeys = Object.keys(tutorialContent);
                if (index < categoryKeys.length) {
                    const category = categoryKeys[index];
                    const content = tutorialContent[category];
                    savedPagesHTML.push(createSavedPageHTML(
                        'overview',
                        index,
                        'overview',
                        content.title,
                        content.title,
                        content.content[0].text || '',
                        'Schnellüberblick: ' + content.title
                    ));
                }
            });
        }

        if (savedPagesHTML.length === 0) {
            savedPagesContainer.innerHTML = `
                <div class="no-content">
                    <p>Sie haben noch keine Seiten gespeichert.</p>
                </div>
            `;
        } else {
            savedPagesContainer.innerHTML = savedPagesHTML.join('');
        }

        const container = document.querySelector('.saved-pages');
        new PerfectScrollbar(container, {
            wheelSpeed: 1,
            wheelPropagation: true,
            suppressScrollX: true,
            minScrollbarLength: 40,
            scrollbarYMargin: 0,
            railYVisible: true
        });
    } catch (error) {
        console.error('Error loading saved pages:', error);
    }
}

/** Generates HTML for the saved page of the ptofile view */
function createSavedPageHTML(category, index, pageType, categoryTitle, heading, text, displayName) {
    // Get content from tutorialContent without creating actual slides
    const content = tutorialContent[category];
    const title = content ? content.title : categoryTitle;
    const firstContent = content ? content.content[0] : null;
    const truncatedText = firstContent ?
        (firstContent.text || '').substring(0, 100) + ((firstContent.text || '').length > 100 ? '...' : '') :
        text;

    return `
        <div class="saved-page-item" onclick="navigateToSlide('${category}', ${index}, '${pageType}')">
            <div class="saved-page-content">
                <div class="saved-page-header">
                    <span class="saved-page-category">${displayName || title}</span>
                    <button class="delete-btn" 
                        onclick="event.stopPropagation(); deleteSavedPage('${category}', ${index}, '${pageType}')">
                        <img src="../../assets/icons/profile/Trash.svg" alt="Delete" class="delete-icon">
                    </button>
                </div>
                <p class="saved-page-preview">${truncatedText}</p>
            </div>
        </div>
    `;
}

/** Navigates to a bookmarked page when clicked */
function navigateToSlide(category, index, pageType) {
    localStorage.setItem('selectedCategory', category);

    if (pageType === 'tutorial') {
        window.location.href = '../../views/tutorial';
    } else {
        localStorage.setItem('selectedOverviewPage', index + 1);
        window.location.href = '../../views/overview';
    }
}

async function deleteSavedPage(category, slideIndex, pageType = 'tutorial') {
    const identificationCode = localStorage.getItem('userCode');

    try {
        const response = await fetch(`/api/users/${identificationCode}/delete-slide`, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                page: category,
                slideIndex: slideIndex,
                pageType: pageType
            })
        });

        const data = await response.json();

        if (data.success) {
            await showSavedPages();
        } else {
            console.error(`Failed to delete page: ${data.error}`);
        }
    } catch (error) {
        console.error('Error deleting saved page:', error);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const bookmarkBtn = document.querySelector('.bookmark-btn');
    if (bookmarkBtn) {
        bookmarkBtn.addEventListener('click', toggleBookmark);
        initializeBookmark();
    }

    const selectedPage = localStorage.getItem('selectedOverviewPage');
    if (selectedPage) {
        currentPage = parseInt(selectedPage);
        updateDots();
        updatePages();
        initializeBookmark();
        localStorage.removeItem('selectedOverviewPage');
    } else {
        if (window.location.pathname.includes('/views/overview')) {
            currentPage = 1;
            updateDots();
            updatePages();
        }
    }
});