/**
 * This file defines a set of event types and their associated data score and message
 * Each event type represents a specific scenario and includes:
 * - score: A numerical value representing the points awarded or deducted for the event.
 * - message: A descriptive message that explains the event and its impact on the user's bonus points.
 *
 * The eventTypes object is structured as follows:
 * - Each key represents an event type (e.g., "welcome")
 * - Each event type contains:
 *   - score: The points associated with the event (positive or negative).
 *   - message: A message describing the event, which can include HTML for formatting.
 */

(function (root) {
    const eventTypes = {
        welcome: {
            score: 80,
            message: "Willkommen zum Bonusprogramm! <br> Sie haben Punkte für das Erstellen eines neuen Profils erhalten."
        },
        assist_engaged_10km: {
            score: 2,
            message: "Perfektes Fahren mit Assistenzfunktion: kumulierte 10km"
        },
        assist_disengaged_unsafe: {
            score: -5,
            message: "Häufig die Hände vom Lenkrad nehmen bei Fahrassistenz"
        }
    };

    // Node.js environment
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = eventTypes;
    }
    // Browser environment
    else {
        root.eventTypes = eventTypes;
    }
})(typeof self !== 'undefined' ? self : this);