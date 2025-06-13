function initializeWarningSystem() {
    const warningOverlay = document.getElementById('warning-overlay');
    const warningMessage = document.getElementById('warning-message');
    const warningImage = document.getElementById('warning-image');

    const warnings = {
        none: {
            message: '',
            display: false
        },
        first: {
            message: 'First Warning Message with image',
            display: true,
            image: '/assets/pictures/warnings/warning.svg',
            position: 'left'
        },
        second: {
            message: 'Second Warning Message',
            display: true,
            position: 'middle'
        },
        test: {
            message: 'Second Warning Message',
            display: true,
            image: '/assets/pictures/warnings/warning.svg',

            position: 'middle'
        },
        third: {
            message: 'Third Warning Message',
            display: true,
            position: 'left'
        }
    };

    const setActiveWarning = (warningType) => {
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set('warning', warningType);
        history.replaceState({}, '', newUrl.toString());

        const warning = warnings[warningType] || warnings.none;

        warningMessage.textContent = warning.message;

        if (warning.image) {
            warningImage.src = warning.image;
            warningImage.style.display = 'block';
        } else {
            warningImage.style.display = 'none';
        }

        // Reset positioning classes
        warningOverlay.classList.remove('position-left', 'position-middle');

        // Apply position if specified
        if (warning.position) {
            warningOverlay.classList.add(`position-${warning.position}`);
        }

        warningOverlay.style.display = warning.display ? 'block' : 'none';
    };

    const urlParams = new URLSearchParams(window.location.search);
    const warningParam = urlParams.get('warning');

    setActiveWarning(warningParam || 'none');
}

window.addEventListener('load', initializeWarningSystem);