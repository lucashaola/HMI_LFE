let sidebarPS, mainPS;
const hasShownCompletionMessage = () => {
    const userCode = localStorage.getItem('userCode');
    return localStorage.getItem(`completionMessageShown_${userCode}`) === 'true';
};

const setCompletionMessageShown = () => {
    const userCode = localStorage.getItem('userCode');
    localStorage.setItem(`completionMessageShown_${userCode}`, 'true');
};

/** Dynamically generates the sidebar with category items, including icons and click handlers.*/
function createSidebar() {
    const sidebarContent = document.querySelector('.sidebar-content');
    sidebarContent.innerHTML = '';

    categories.forEach(category => {
        const sidebarItem = document.createElement('div');
        sidebarItem.className = 'sidebar-item';

        // Preserve the old onclick attribute format as a string
        sidebarItem.setAttribute('onclick', `showContent('${category.key}')`);

        // Add data-category for future-proofing (optional)
        sidebarItem.dataset.category = category.key;

        // Icon setup
        const icon = document.createElement('img');
        icon.className = 'icon';
        icon.src = category.icon;
        icon.alt = '';

        // Text node
        const text = document.createTextNode(category.name);

        // Append elements
        sidebarItem.appendChild(icon);
        sidebarItem.appendChild(text);
        sidebarContent.appendChild(sidebarItem);
    });
}

/** Displays the content for the selected category and handles scroll events to unlock. */
function showContent(contentId) {
    // Handle sidebar selection
    const previousSelected = document.querySelector('.sidebar-item.selected');
    if (previousSelected) {
        previousSelected.classList.remove('selected');
    }

    const selectedItem = document.querySelector(`.sidebar-item[onclick="showContent('${contentId}')"]`);
    if (selectedItem) {
        selectedItem.classList.add('selected');
    }

    // Show selected content
    const contents = document.querySelectorAll('.content');
    contents.forEach(content => content.classList.remove('active'));

    const targetContent = document.getElementById(contentId);
    if (targetContent) {
        targetContent.classList.add('active');

        // Reset scroll position of main content
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.scrollTop = 0;
            if (mainPS) {
                mainPS.scrollTop = 0;
                mainPS.update();
            }
        }

        // Scroll sidebar to selected item
        const sidebarContent = document.querySelector('.sidebar-content');
        const selectedItem = document.querySelector(`.sidebar-item[onclick="showContent('${contentId}')"]`);

        if (sidebarContent && selectedItem) {
            sidebarContent.scrollTop = selectedItem.offsetTop - 100;
        }

        // Remove previous scroll handler if any
        if (mainContent && mainContent._scrollHandler) {
            // Check if Perfect Scrollbar is properly initialized
            if (mainPS && mainPS.container) {
                mainPS.container.removeEventListener('scroll', mainContent._scrollHandler);
            } else {
                mainContent.removeEventListener('scroll', mainContent._scrollHandler);
            }
            delete mainContent._scrollHandler;
        }

        // Add scroll handler to unlock category when scrolled to bottom
        if (mainContent) {
            const handleScroll = () => {
                let scrollTop, scrollHeight, clientHeight;

                // Check if we're using Perfect Scrollbar
                if (mainPS && mainPS.container) {
                    scrollTop = mainPS.scrollTop;
                    scrollHeight = mainPS.scrollHeight;
                    clientHeight = mainPS.container.clientHeight;
                } else {
                    // Fallback to native scrolling
                    scrollTop = mainContent.scrollTop;
                    scrollHeight = mainContent.scrollHeight;
                    clientHeight = mainContent.clientHeight;
                }

                const isAtBottom = scrollTop + clientHeight >= scrollHeight - 100;
                if (isAtBottom) {
                    unlockCategory(contentId);
                    updateUnlockedCategoryCheckmarks();

                    // Remove the event listener after unlocking
                    if (mainPS && mainPS.container) {
                        mainPS.container.removeEventListener('scroll', handleScroll);
                    } else {
                        mainContent.removeEventListener('scroll', handleScroll);
                    }
                    delete mainContent._scrollHandler;
                }
            };

            // Add new scroll listener
            if (mainPS && mainPS.container) {
                mainPS.container.addEventListener('scroll', handleScroll);
            } else {
                mainContent.addEventListener('scroll', handleScroll);
            }

            // Store handler reference for cleanup
            mainContent._scrollHandler = handleScroll;
        }

        initializeBookmark();
    }
}

/** Navigates to a specific content item based on search */
function showSearchResult(contentId) {
    showContent(contentId);

    // Clean up search
    const resultsDiv = document.getElementById('results');
    const searchTerm = document.querySelector('.search').value.toLowerCase();
    resultsDiv.style.display = 'none';
    document.querySelector('.search').value = '';

    initializeBookmark();
}

/** Updates the sidebar to show checkmarks for unlocked categories. */
async function updateUnlockedCategoryCheckmarks() {
    const identificationCode = localStorage.getItem('userCode');

    if (!identificationCode) {
        console.warn('No user code found.');
        return;
    }

    try {
        const verifyResponse = await fetch(`/api/users/${identificationCode}/verify`);
        const verifyData = await verifyResponse.json();

        if (!verifyData.exists) {
            localStorage.removeItem('userCode');
            return;
        }

        // Get user data
        const response = await fetch(`/api/users/${identificationCode}`);
        const userData = await response.json();
        const unlockedCategories = JSON.parse(userData.unlocked_categories || '[]');

        // Update sidebar items
        document.querySelectorAll('.sidebar-item').forEach(item => {
            const categoryId = item.dataset.category;

            // Check if checkmark already exists, if not create it
            let checkmark = item.querySelector('.category-checkmark');
            if (!checkmark) {
                checkmark = document.createElement('span');
                checkmark.className = 'category-checkmark';
                checkmark.textContent = '✓';
                item.appendChild(checkmark);
            }

            // Show/hide checkmark based on unlocked status
            if (unlockedCategories.includes(categoryId)) {
                checkmark.classList.add('visible');
            } else {
                checkmark.classList.remove('visible');
            }
        });
    } catch (error) {
        console.error('Error updating category checkmarks:', error);
    }
}

async function areAllCategoriesUnlocked() {
    const identificationCode = localStorage.getItem('userCode');
    if (!identificationCode) return false;

    try {
        const response = await fetch(`/api/users/${identificationCode}`);
        const userData = await response.json();
        const unlockedCategories = JSON.parse(userData.unlocked_categories || '[]');

        return categories.every(category => unlockedCategories.includes(category));
    } catch (error) {
        console.error('Error checking categories:', error);
        return false;
    }
}

async function showCompletionPopup() {
    const result = await Swal.fire({
        title: 'Haben Sie die Inhalte de Tutorials gesehen?',
        text: 'Dann Testen Sie Ihr Wissen',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Weiter',
        cancelButtonText: 'Wissen testen',
        confirmButtonColor: '#e4e4e7',
        cancelButtonColor: '#e4e4e7',
        reverseButtons: true
    });

    if (result.isConfirmed) {
        window.location.href = '/views/welcome';
    } else if (result.dismiss === Swal.DismissReason.cancel) {
        window.location.href = '/views/profile?view=test';

    }
}

/** Initializes sidebar, main content, and PerfectScrollbar when the page loads.
Also handles navigation and completion popups when the user attempts to leave the tutorial.*/
document.addEventListener('DOMContentLoaded', function () {
    createSidebar(categories);

    // Generate content for each section
    const mainContent = document.querySelector('.main-content');
    Object.keys(tutorialContent).forEach(sectionId => {
        const contentDiv = document.createElement('div');
        contentDiv.className = 'content';
        contentDiv.id = sectionId;
        contentDiv.innerHTML = renderContent(sectionId);
        mainContent.appendChild(contentDiv);
    });

    const searchInput = document.querySelector('.search');
    if (searchInput) searchInput.value = '';

    // Initialize PerfectScrollbar
    const sidebarContent = document.querySelector('.sidebar-content');
    if (sidebarContent) {
        sidebarPS = new PerfectScrollbar(sidebarContent, {
            wheelSpeed: 1,
            wheelPropagation: true,
            suppressScrollX: true,
            minScrollbarLength: 40,
            scrollbarYMargin: 0,
            railYVisible: true
        });

        closeResultsOnOutsideClick();
    }

    if (mainContent) {
        mainPS = new PerfectScrollbar(mainContent, {
            wheelSpeed: 1,
            suppressScrollX: true,
            wheelPropagation: false,
            swipeEasing: true,
        });
    }

    // Handle selected category from localStorage
    const selectedCategory = localStorage.getItem('selectedCategory');
    if (selectedCategory) {
        showContent(selectedCategory);
        localStorage.removeItem('selectedCategory');
    }

    updateUnlockedCategoryCheckmarks();
});

document.addEventListener('click', async function(event) {
    const target = event.target;
    if (target.matches('.close-btn, .close-icon, .icon-right.arrow') || target.closest('a[href]')) {
        event.preventDefault();

        const userCode = localStorage.getItem('userCode');

        try {
            if (await areAllCategoriesUnlocked() && !hasShownCompletionMessage() && userCode) {
                setCompletionMessageShown();
                showCompletionPopup();
            } else {
                const destination = target.closest('a[href]')?.href || '/views/welcome';
                window.location.href = destination;
            }
        } catch (error) {
            const destination = target.closest('a[href]')?.href || '/views/welcome';
            window.location.href = destination;
        }
    }
});