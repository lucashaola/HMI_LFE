const systemIdMap = {
    'Verkehrszeichenassistent': 'verkehrszeichen',
    'Abstandsregeltempomat': 'geschwindigkeit',
    'Ampelerkennung': 'ampelerkennung',
    'Spurführungsassistent': 'spurführung',
    'Notbremsassistent': 'notbrems'
};

function calculateTutorialVisibility(prefs) {
    const visibility = Object.fromEntries(
        Object.values(systemIdMap).map(id => [id, false])
    );

    Object.keys(prefs).forEach(system => {
        const values = prefs[system] || {};
        const practical = (typeof values.practical === 'number') ? values.practical : null;
        const theoretical = (typeof values.theoretical === 'number') ? values.theoretical : null;

        let mean = null;
        if (typeof practical === 'number' && typeof theoretical === 'number') {
            mean = (practical + theoretical) / 2;
        } else if (typeof practical === 'number') {
            mean = practical;
        } else if (typeof theoretical === 'number') {
            mean = theoretical;
        }

        if (mean !== null) values.mean = mean;
        let id = systemIdMap[system];
        if (id && id.toLowerCase && id.toLowerCase().startsWith('spur')) {
            id = 'spurführung';
        }
        if (id) visibility[id] = mean !== null && mean <= 3;
    });

    // Always-visible mandatory categories
    ['aktivierung', 'deaktivierung', 'risiken'].forEach(key => {
        visibility[key] = true;
    });

    return visibility;
}

function checkForExistingProfile(isButtonClick = false) {
    const hasCheckedProfile = localStorage.getItem('hasCheckedProfile');
    const userName = localStorage.getItem('userName');

    if (hasCheckedProfile && userName && !isButtonClick) {
        document.querySelector('.welcome h1').innerHTML = `<img src="../../assets/icons/welcome/Profile.svg" class="welcome-icon" alt=""> Willkommen ${userName}!`;
        const code = localStorage.getItem('userCode');
        if (code) {
            fetchAndRedirectPreferences(code);
        }
        return;
    }

    Swal.fire({
        title: 'Haben Sie bereits ein Profil in diesem teilautomatisierten Fahrzeug?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Ja',
        cancelButtonText: 'Nein',
        confirmButtonColor: '#e4e4e7',
        cancelButtonColor: '#e4e4e7',
        background: 'whitesmoke',
        color: '#000000',
        allowOutsideClick: false,
        allowEscapeKey: false,
        scrollbarPadding: false,
        heightAuto: false,
        customClass: {
            container: 'swal-container-custom'
        }
    }).then((result) => {
        localStorage.setItem('hasCheckedProfile', 'true');
        if (result.isConfirmed) {
            showExistingProfiles();
        } else {
            createNewProfile();
        }
    });
}


async function createNewProfile() {
    try {
        const result = await Swal.fire({
            title: 'Neues Profil erstellen',
            input: 'text',
            inputLabel: 'Bitte geben Sie Ihren Namen ein',
            inputPlaceholder: 'Name',
            background: 'whitesmoke',
            color: '#000000',
            confirmButtonColor: '#e4e4e7',
            cancelButtonColor: '#e4e4e7',
            showCancelButton: true,
            allowOutsideClick: false,
            allowEscapeKey: false,
            scrollbarPadding: false,
            heightAuto: false,
            customClass: {
                container: 'swal-container-custom'
            },
            inputValidator: (value) => {
                if (!value) {
                    return 'Bitte geben Sie einen Namen ein!';
                }
            }
        });

        if (result.isConfirmed) {
            const name = result.value;
            const identificationCode = generateIdentificationCode();

            const response = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    identificationCode
                }),
            });

            if (!response.ok) throw new Error('Failed to create profile');

            const userData = await response.json();
            localStorage.setItem('userName', name);
            localStorage.setItem('userCode', userData.identification_code);
            // Initialize empty preferences locally; do not redirect yet
            localStorage.setItem('preferences', JSON.stringify({}));

            document.querySelector('.welcome h1').innerHTML =
                `<img src="../../assets/icons/welcome/Profile.svg" class="welcome-icon" alt=""> Willkommen ${name}!`;

            await sendEvent(userData.identification_code, 'welcome');

            await Swal.fire({
                title: 'Profil erstellt!',
                html: `Name: ${name}<br>Identifikationscode: ${identificationCode}`,
                icon: 'success',
                background: 'whitesmoke',
                color: '#000000',
                confirmButtonColor: '#e4e4e7',
                allowOutsideClick: false,
                allowEscapeKey: false,
                scrollbarPadding: false,
                heightAuto: false,
                customClass: {
                    container: 'swal-container-custom'
                }
            });
            // After creating a new profile, show the Landing page once
            try { localStorage.setItem('landingAllowed', '1'); } catch (e) {}
            window.location.href = '/views/landing';
            // Do not immediately fetch+redirect; Landing should be shown first
        }
    } catch (error) {
        console.error('Error creating profile:', error);
        Swal.fire({
            title: 'Error',
            text: 'Failed to create profile',
            icon: 'error',
            background: '#whitesmoke',
            color: '#000000',
            confirmButtonColor: '#e4e4e7',
            allowOutsideClick: false,
            allowEscapeKey: false,
            scrollbarPadding: false,
            heightAuto: false,
            customClass: {
                container: 'swal-container-custom'
            }
        });
    }
}

function generateIdentificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}


async function fetchAndRedirectPreferences(code) {
    try {
        const res = await fetch(`/api/users/${code}/preferences`);
        const data = await res.json();
        const prefs = data.preferences ? JSON.parse(data.preferences) : {};
        const visibility = calculateTutorialVisibility(prefs);
        
        localStorage.setItem('preferences', JSON.stringify(prefs));
        localStorage.setItem('tutorialVisibility', JSON.stringify(visibility));
        // Do not auto-redirect to preferences here; keep user on Welcome.
        // Users can access preferences via explicit navigation (Landing button or menu).
    } catch (e) {
        console.error('Error fetching preferences:', e);
    }
}
/**
 * This file handles user profile management for the application, including:
 * - Checking if a user already has a profile.
 * - Creating a new profile with a unique identification code.
 * - Displaying and selecting existing profiles.
 * - Storing and retrieving user information (e.g., name, identification code) in `localStorage`.
*/
async function showExistingProfiles() {
    try {
        const response = await fetch('/api/users');
        const profiles = await response.json();

        if (profiles.length === 0) {
            await Swal.fire({
                title: 'Keine Profile gefunden',
                text: 'Es wurden noch keine Profile erstellt.',
                icon: 'info',
                background: 'whitesmoke',
                color: '#000000',
                confirmButtonColor: '#e4e4e7',
                allowOutsideClick: false,
                allowEscapeKey: false,
                scrollbarPadding: false,
                heightAuto: false,
                customClass: {
                    container: 'swal-container-custom'
                }
            });
            createNewProfile();
            return;
        }

        const profileOptions = profiles.map(profile => ({
            text: `${profile.name} (${profile.identification_code})`,
            value: profile.identification_code
        }));

        const result = await Swal.fire({
            title: 'Wählen Sie Ihr Profil',
            input: 'select',
            inputOptions: Object.fromEntries(
                profileOptions.map(profile => [profile.value, profile.text])
            ),
            background: 'whitesmoke',
            color: '#000000',
            confirmButtonColor: '#e4e4e7',
            cancelButtonColor: '#e4e4e7',
            showCancelButton: true,
            allowOutsideClick: false,
            allowEscapeKey: false,
            scrollbarPadding: false,
            heightAuto: false,
            customClass: {
                container: 'swal-container-custom'
            },
            inputValidator: (value) => {
                if (!value) {
                    return 'Bitte wählen Sie ein Profil aus!';
                }
            }
        });

        if (result.isConfirmed) {
            const response = await fetch(`/api/users/${result.value}`);
            const selectedProfile = await response.json();

            localStorage.setItem('userCode', result.value);
            localStorage.setItem('userName', selectedProfile.name);
            handlePreferencesRedirect(JSON.stringify(selectedProfile.preferences || []));

            document.querySelector('.welcome h1').innerHTML =
                `<img src="../../assets/icons/welcome/Profile.svg" class="welcome-icon" alt=""> Willkommen ${selectedProfile.name}!`;

            await Swal.fire({
                title: 'Willkommen zurück!',
                text: `Angemeldet als ${selectedProfile.name}`,
                icon: 'success',
                background: 'whitesmoke',
                color: '#000000',
                confirmButtonColor: '#e4e4e7',
                allowOutsideClick: false,
                allowEscapeKey: false,
                scrollbarPadding: false,
                heightAuto: false,
                customClass: {
                    container: 'swal-container-custom'
                }
            });
            showProgressOverview();
            await fetchAndRedirectPreferences(result.value);
        }
    } catch (error) {
        console.error('Error loading profiles:', error);
        Swal.fire({
            title: 'Error',
            text: 'Failed to load profiles',
            icon: 'error',
            background: 'whitesmoke',
            color: '#000000',
            confirmButtonColor: '#e4e4e7',
            allowOutsideClick: false,
            allowEscapeKey: false,
            scrollbarPadding: false,
            heightAuto: false,
            customClass: {
                container: 'swal-container-custom'
            }
        });
    }
}

function handlePreferencesRedirect(prefsString) {
    let prefs;
    try {
    prefs = JSON.parse(prefsString || '{}');
    } catch (e) {
        prefs = {};
    }
    localStorage.setItem('preferences', JSON.stringify(prefs));
    // Do not redirect automatically; Welcome should remain the landing page for existing profiles.
}

if (typeof module !== 'undefined') {
    module.exports = { calculateTutorialVisibility };
}
