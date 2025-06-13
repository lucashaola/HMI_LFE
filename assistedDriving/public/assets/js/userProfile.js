function checkForExistingProfile(isButtonClick = false) {
    const hasCheckedProfile = localStorage.getItem('hasCheckedProfile');
    const userName = localStorage.getItem('userName');

    if (hasCheckedProfile && userName && !isButtonClick) {
        document.querySelector('.welcome h1').innerHTML = `<img src="../../assets/icons/welcome/Profile.svg" class="welcome-icon" alt=""> Willkommen ${userName}!`;
        return;
    }

    Swal.fire({
        title: 'Haben Sie bereits ein Profil in diesem teilautomatisierten Auto?',
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

            document.querySelector('.welcome h1').innerHTML =
                `<img src="../../assets/icons/welcome/Profile.svg" class="welcome-icon" alt=""> Willkommen ${name}!`;
            showProgressOverview();

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