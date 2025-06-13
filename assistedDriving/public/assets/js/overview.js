let contentPS;
const totalPages = Object.keys(tutorialContent).length;
let currentPage = 1;

/** Generates pagination dots and connecting lines to visually represent the tutorial's progress.*/
function createDots() {
    const dotsContainer = document.getElementById('paginationDots');

    for (let i = 1; i <= totalPages; i++) {
        const dotContainer = document.createElement('div');
        dotContainer.className = 'dot-container';

        const dot = document.createElement('div');
        dot.className = 'dot';
        const span = document.createElement('span');
        span.textContent = i;
        dot.appendChild(span);
        dotContainer.appendChild(dot);

        dot.addEventListener('click', () => {
            // Prevent navigation if clicking the current page or a future page
            if (i === currentPage || i > currentPage) return;
            currentPage = i;
            updateDots();
            updatePages();
        });
        dotContainer.appendChild(dot);

        if (i < totalPages) {
            const line = document.createElement('div');
            line.className = 'connecting-line';
            dotContainer.appendChild(line);
        }

        if (i === totalPages) {
            dotContainer.innerHTML += `
                <button class="bookmark-btn" id="overviewBookmarkBtn">
                   <svg class="bookmark-icon" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="-5.0 -10.0 110.0 135.0">
                        <path class="outline" d="m75 9.375h-50c-4.0195 0.023438-7.2695 3.2734-7.293 7.293v66.664c-0.027343 2.6914 1.4102 5.1797 3.75 6.5 2.2227 1.3164 4.9883 1.3164 7.2109 0l20.832-12.5c0.28516-0.16406 0.63281-0.16406 0.91797 0l20.832 12.5c2.293 1.3477 5.1367 1.3438 7.4297-0.003906 2.293-1.3516 3.6758-3.8359 3.6133-6.4961v-66.664c-0.023438-4.0195-3.2734-7.2695-7.293-7.293zm1.043 73.957c0.015625 0.44141-0.20703 0.85547-0.58594 1.0859-0.28125 0.16406-0.63281 0.16406-0.91406 0l-20.832-12.5h-0.003907c-2.2461-1.3945-5.0859-1.3945-7.332 0l-20.832 12.5c-0.28516 0.16406-0.63281 0.16406-0.91797 0-0.41016-0.20703-0.66797-0.625-0.66797-1.0859v-66.664c0-0.57812 0.46875-1.043 1.043-1.043h50c0.27734 0 0.54297 0.10938 0.73828 0.30469 0.19531 0.19531 0.30469 0.46094 0.30469 0.73828z" fill="currentColor"/>
                        <path class="filled" d="m75 9.375h-50c-4.0195 0.023438-7.2695 3.2734-7.293 7.293v66.664c-0.027343 2.6914 1.4102 5.1797 3.75 6.5 2.2227 1.3164 4.9883 1.3164 7.2109 0l20.832-12.5c0.28516-0.16406 0.63281-0.16406 0.91797 0l20.832 12.5c2.293 1.3477 5.1367 1.3438 7.4297-0.003906 2.293-1.3516 3.6758-3.8359 3.6133-6.4961v-66.664c-0.023438-4.0195-3.2734-7.2695-7.293-7.293z" fill="currentColor"/>
                    </svg>
                </button>
            `;
        }

        dotsContainer.appendChild(dotContainer);
    }
    updateDots();
}

/** Updates the appearance of dots and lines based on the current page. */
function updateDots() {
    const dots = document.querySelectorAll('.dot');
    const lines = document.querySelectorAll('.connecting-line');

    dots.forEach((dot, index) => {
        dot.className = 'dot';
        if (index + 1 === currentPage) {
            dot.classList.add('active');
        } else if (index + 1 < currentPage) {
            dot.classList.add('completed');
        }
    });

    // Update connecting lines
    lines.forEach((line, index) => {
        line.className = 'connecting-line';
        if (index + 1 < currentPage) {
            line.classList.add('completed');
        }
    });
}

/** Displays the active page and hides others, ensuring the correct content is shown. */
function updatePages() {
    const pages = document.querySelectorAll('.content-container .page');
    pages.forEach((page, index) => {
        if (index + 1 === currentPage) {
            page.classList.add('page-active');
            activeCategory = page.id;
        } else {
            page.classList.remove('page-active');
        }
    });

    scrollToTop();
    initializeBookmark();
    setupScrollListener();
}

/** Listens for scroll events to unlock the next page when the user reaches the bottom.*/
function setupScrollListener() {
    const contentContainer = document.querySelector('.content-container');
    if (!contentContainer) return;

    const scrollElement = contentPS?.container || contentContainer;

    // Cleanup previous listener
    if (scrollElement._scrollHandler) {
        scrollElement.removeEventListener('scroll', scrollElement._scrollHandler);
        delete scrollElement._scrollHandler;
    }

    const handleScroll = () => {
        const activePage = document.querySelector('.page-active');
        if (!activePage) return;

        const scrollTop = scrollElement.scrollTop;
        const scrollHeight = scrollElement.scrollHeight;
        const clientHeight = scrollElement.clientHeight;
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 100;

        if (isAtBottom) {
            unlockCategory(activeCategory);

            // Cleanup listener
            scrollElement.removeEventListener('scroll', handleScroll);
            delete scrollElement._scrollHandler;
        }
    };

    // Add listener to correct element
    scrollElement._scrollHandler = handleScroll;
    scrollElement.addEventListener('scroll', handleScroll);
}

/** Handles navigation between pages (forward and backward) and includes logic for transitioning to other views (e.g., welcome screen or knowledge test) after completing the tutorial. */
async function navigatePage(direction) {
    if (currentPage === 1 && direction === -1) {
        window.location.href = '../../views/welcome';
        return;
    }
    if (currentPage === totalPages) {
        if (direction === 1) {
            const result = await Swal.fire({
                title: 'Sie haben alle Inhalte des Tutorials gesehen.',
                text: 'Testen Sie nun das teilautomatisierte Fahren für mehr Sicherheit und Komfort! Gerne können Sie Ihr Wissen zuvor nochmal testen. Viel Spaß!',
                icon: 'info',
                showCancelButton: true,
                cancelButtonText: 'Wissen testen',
                confirmButtonText: 'Weiter',
                confirmButtonColor: '#e4e4e7',
                cancelButtonColor: '#e4e4e7',
                reverseButtons: true,
            });

            if (result.isConfirmed) {
                window.location.href = '../../views/welcome';
            } else {
                window.location.href = '../../views/profile?view=test';
            }

            return;
        }

    }
    const newPage = currentPage + direction;
    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        updateDots();
        updatePages();
    }
}

/** Ensures the content container scrolls to the top when switching pages. */
function scrollToTop() {
    const contentContainer = document.querySelector('.content-container');
    if (contentContainer) {
        contentContainer.scrollTop = 0;
        contentPS?.update();
    }
}

/** Initializes the tutorial content, pagination dots, and PerfectScrollbar when the page loads. It also positions the bookmark button dynamically based on the active page's width. */
document.addEventListener('DOMContentLoaded', () => {
    const contentContainer = document.querySelector('.content-container');

    if (window.location.pathname.includes('/views/overview')) {
        Object.keys(tutorialContent).forEach((sectionId, index) => {
            const pageDiv = document.createElement('div');
            pageDiv.className = 'page';
            if (index === 0) pageDiv.classList.add('page-active');
            pageDiv.id = sectionId;
            pageDiv.innerHTML = renderContent(sectionId, true);
            contentContainer.appendChild(pageDiv);
        });

        createDots();
        updatePages();

        // Initialize bookmark positioning
        const bookmarkBtn = document.querySelector('.bookmark-btn');
        const bookmarkIcon = document.querySelector('.bookmark-icon');
        const activePage = document.querySelector('.page-active');

        if (bookmarkBtn && activePage && bookmarkIcon) {
            function updatePositions() {
                const pageRect = activePage.getBoundingClientRect();
                const contentWidth = Math.min(pageRect.width, 50 * 16); // 50em in pixels
                const leftPosition = pageRect.left + contentWidth;

                // Update bookmark position
                bookmarkBtn.style.left = `${leftPosition}px`;

                // Update scrollbar position
                requestAnimationFrame(() => {
                    const bookmarkRect = bookmarkIcon.getBoundingClientRect();
                    const margin = window.innerWidth - bookmarkRect.right - 70;
                    document.documentElement.style.setProperty('--scrollbar-margin', margin + 'px');
                });
            }

            updatePositions();
            window.addEventListener('resize', updatePositions);
        }
    }

    // Initialize PerfectScrollbar
    if (contentContainer) {
        if (contentPS) {
            contentPS.destroy();
            contentPS = null;
        }

        contentPS = new PerfectScrollbar(contentContainer, {
            wheelSpeed: 1,
            swipeEasing: true,
            suppressScrollX: true
        });

        contentPS.update();
    }
});