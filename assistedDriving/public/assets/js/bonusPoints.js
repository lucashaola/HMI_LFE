/** This file contains functions for recording, sending, and displaying user events and bonus points. */

/**
Records event by sending a POST request to the server.
It validates the event type, sends the event data and handles errors if the request fails.
*/
async function recordEvent(identificationCode, eventType) {
    const event = eventTypes[eventType];
    if (!event) {
        console.error("Invalid event type");
        return;
    }

    try {
        const response = await fetch('/api/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                identificationCode,
                eventType,
                score: event.score,
            }),
        });

        const result = await response.json();
        if (!response.ok) {
            console.error("Error recording event:", result.error);
        }
    } catch (err) {
        console.error("Network error:", err);
    }
}


async function sendEvent(identificationCode, eventType) {
    try {
        const event = eventTypes[eventType];
        if (!event) {
            console.error(`Event type "${eventType}" not found in eventTypes.`);
            return;
        }

        const response = await fetch('/api/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                identificationCode,
                eventType,
                score: event.score,
            }),
        });
    } catch (err) {
        console.error("Error sending event:", err);
    }
}

/**
Displays a user's bonus points and event history. It fetches the user's bonus data
and event history from the server, then renders a visual representation of the bonus points
and a list of events with their scores and timestamps. It also handles cases where the user is not logged in.
 */
function showBonusOverview() {
    const bonusOverviewContainer = document.querySelector('.bonus-overview');

    const identificationCode = localStorage.getItem('userCode');
    if (!identificationCode) {
        bonusOverviewContainer.innerHTML = `
            <div class="no-content">
                <p>Melden Sie sich an, um Ihre Fahrpunkte zu sehen.</p>
            </div>
        `;
        return;
    }

    Promise.all([
        fetch(`/api/bonus/${identificationCode}`),
        fetch(`/api/events/${identificationCode}`)
    ])
        .then(([bonusResponse, eventsResponse]) =>
            Promise.all([bonusResponse.json(), eventsResponse.json()])
        )
        .then(([bonusData, events]) => {
            const points = bonusData.total_bonusPoints_score || 0;
            const assistanceKilometers = bonusData.assistance_kilometer || 0;

            const dashArray = (points / 100) * 113;

            bonusOverviewContainer.innerHTML = `
                <div class="bonus-circle">
                     <svg class="bonus-svg" viewBox="0 0 100 50">
                        <path class="bonus-background" d="M 10 45 A 40 40 0 0 1 90 45" stroke-linecap="round" />
                        <path class="bonus-progress" d="M 10 45 A 40 40 0 0 1 90 45" style="stroke-dasharray: ${dashArray} 113" stroke-linecap="round" />
                    </svg>
                    <div class="bonus-points">
                        ${points}/100
                        <div class="bonus-text">
                            <span class="${points >= 80 ? 'status-good' : points >= 50 ? 'status-ok' : 'status-bad'}">
                                ${points >= 80 ? "GUT" : points >= 50 ? "OK" : "SCHLECHT"}
                            </span>
                            <br> 
                            Assistenzkilometer: ${assistanceKilometers}
                        </div>
                    </div>
                </div>
                <div class="event-messages"></div>
            `;


        const eventContainer = bonusOverviewContainer.querySelector('.event-messages');
        if (eventContainer && events) {
            events.forEach(event => {
                const eventElement = document.createElement('div');
                eventElement.className = 'event-message';
                const date = new Date(event.timestamp).toLocaleDateString('de-DE');
                const score = event.score;
                const scoreClass = score > 0 ? 'positive-score' : 'negative-score';

                eventElement.innerHTML = `
                    <div class="event-message-content">
                        <p>${eventTypes[event.event_type]?.message || 'Keine Beschreibung verfügbar'}</p>
                        <div class="event-score ${scoreClass}">
                            ${score > 0 ? '+' : ''}${score}
                        </div>
                    </div>
                    <div class="event-date">${date}</div>
                `;
                eventContainer.appendChild(eventElement);
            });
        }

        new PerfectScrollbar(eventContainer, {
            wheelSpeed: 1,
            wheelPropagation: true,
            suppressScrollX: true,
            minScrollbarLength: 40,
            scrollbarYMargin: 0,
            railYVisible: true
        });
    })
    .catch(error => {
        console.error('Error fetching or displaying bonus data:', error);
    });
}