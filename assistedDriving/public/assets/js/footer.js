document.addEventListener('DOMContentLoaded', function() {
    const footerContainer = document.createElement('div');
    footerContainer.innerHTML = `
        <div class="footer">
            <div class="left-section">
                <img class="icon-left" src="/assets/icons/footer/Seat Heating left.svg" alt="">
                <div class="temperature-control">
                    <svg class="temperature-line left-line" height="30" width="150">
                        <path d="M-20 -15 L20 20 L140 20" fill="none" stroke="url(#gradient-left)" stroke-width="4"/>
                        <defs>
                            <linearGradient id="gradient-left" x1="0%" x2="100%" y1="0%" y2="0%">
                                <stop offset="0%" style="stop-color:#FF2D55"/>
                                <stop offset="50%" style="stop-color:#FFFFFF"/>
                                <stop offset="100%" style="stop-color:#3498db"/>
                            </linearGradient>
                        </defs>
                    </svg>

                    <button class="temp-control-button" data-delta="-1">-</button>
                    <span id="temperature-left"></span>
                    <button class="temp-control-button" data-delta="1">+</button>
                </div>
            </div>

            <div class="icon-center">
                <a href="/views/profile">
                    <img class="footer-icon" id="profileIcon" src="/assets/icons/footer/Profile.svg" alt="Profile">
                </a>
                <a href="/views/welcome">
                    <img class="footer-icon" id="homeIcon" src="/assets/icons/footer/Home.svg" alt="Home">
                </a>
                <!-- <a href="/views/liveSimulation"> -->
                <a href="/views/liveSimulation">
                    <img class="footer-icon" id="navigationIcon" src="/assets/icons/footer/Navigation.svg" alt="Navigation">
                </a>
            </div>

            <div class="right-section">
                <div class="temperature-control">
                    <svg class="temperature-line right-line" height="30" width="110">
                        <path d="M-15 20 L110 20 L160 -15" fill="none" stroke="url(#gradient-right)" stroke-width="4"/>
                        <defs>
                            <linearGradient id="gradient-right" x1="0%" x2="100%" y1="0%" y2="0%">
                                <stop offset="0%" style="stop-color:#3498db"/>
                                <stop offset="50%" style="stop-color:#FFFFFF"/>
                                <stop offset="100%" style="stop-color:#FF2D55"/>
                            </linearGradient>
                        </defs>
                    </svg>

                    <button class="temp-control-button" data-delta="-1">-</button>
                    <span id="temperature-right"></span>
                    <button class="temp-control-button" data-delta="1">+</button>
                </div>
                <img class="icon-right flipped" src="/assets/icons/footer/Seat Heating left.svg" alt="">
            </div>
        </div>
    `;

    // Add footer to the bottom of the page
    document.body.appendChild(footerContainer);

    // Add event listeners for temperature control
    document.querySelectorAll('.temp-control-button').forEach(button => {
        button.addEventListener('click', function() {
            const delta = parseInt(this.dataset.delta);
            changeTemperature(delta);
        });
    });

    // Initialize temperature after footer is injected
    let temperature = localStorage.getItem('temperature')
        ? parseInt(localStorage.getItem('temperature'))
        : 20;

    // Initialize display
    changeTemperature(0);

    // Add event listeners for temperature control
    document.querySelectorAll('.temp-control-button').forEach(button => {
        button.addEventListener('click', function() {
            const delta = parseInt(this.dataset.delta);
            changeTemperature(delta);
        });
    });

    // Temperature control function
    function changeTemperature(change = 0) {
        temperature += change;
        localStorage.setItem('temperature', temperature);
        document.getElementById("temperature-left").textContent = temperature + "°";
        document.getElementById("temperature-right").textContent = temperature + "°";
    }
});
