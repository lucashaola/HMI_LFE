/**
 * File defines the content structure for the tutorial.
 * It organizes the tutorial into categories, each containing multiple content items with text, media and optional subtext or horizontal rules for visual separation.
 *
 * Each category containts:
 *   - title: The title of the category.
 *   - content: An array of content items, each containing:
 *     - text: The main text content.
 *     - media: The primary media (image or GIF) to display.
 *     - additionalMedia: Optional secondary media to display alongside the primary media.
 *     - additionalSmalllMedia: Optional smaller secondary media for specific layouts.
 *     - subtext: Additional text or HTML content (e.g., bullet points) to display below the main content.
 *     - addHr: A boolean flag to add a horizontal rule (`<hr>`) after the content item.
*/
const tutorialContent = {
    aktivierung: {
        title: "Aktivierung DRIVING ASSIST",
        content: [
            {
                text: "Wenn „DRIVING ASSIST READY\" weiß im Display aufleuchtet, ist das teilautomatisierte Fahren verfügbar.",
                media: "../../assets/pictures/overview/1-1.gif",
                subtext: "Bei Bedingungen, wie zum Beispiel schlechtem Wetter, kann es unter Umständen nicht verfügbar sein.",
                addHr: true
            },
            {
                text: "Drücken Sie die <span class='blue-text'>Aktivierungstaste</span>, um den DRIVING ASSIST zu aktivieren.",
                media: "../../assets/pictures/overview/1-2.gif",
                addHr: true
            },
            {
                text: "Bei erfolgreicher Aktivierung leuchtet „DRIVING ASSIST“ <span class='green-text'>grün</span> im Display auf.",
                media: "../../assets/pictures/overview/1-3.gif",
                addHr: true
            },
            {
                text: "Zudem leuchten die Lenkradlichter <span class='green-text'>grün</span>.",
                media: "../../assets/pictures/overview/1-4.gif",
                addHr: true
            },
            {
                text: "Es sind nun <b>alle</b> Fahrerassistenzsysteme aktiv und das Fahrzeug fährt teilautomatisiert. Ihre Hände müssen während der automatisierten Fahrt am Lenkrad bleiben, ohne zu lenken. Ihre Füße müssen Sie von den Pedalen nehmen.",
                media: "../../assets/pictures/overview/1-5.jpg",
                additionalMedia: "../../assets/pictures/overview/1-6.gif",
            }
        ]
    },
    verkehrszeichen: {
        title: "Verkehrszeichenassistent",
        content: [
            {
                text: "Das Fahrzeug erkennt Verkehrszeichen und Tempolimits.",
                media: "../../assets/pictures/overview/2-1.gif",
                addHr: true
            },
            {
                text: "Das erkannte Verkehrszeichen wird im Display angezeigt.",
                media: "../../assets/pictures/overview/2-2.gif",
                addHr: true
            },
            {
                text: "Drücken Sie die <span class='blue-text'>Set-Taste</span>, um die erkannte Geschwindigkeit zu übernehmen. Das Fahrzeug passt sich dann der Geschwindigkeit an.",
                media: "../../assets/pictures/overview/2-3.gif",
                addHr: true
            },
            {
                text: "Drücken Sie den <span class='blue-text'>Hebel</span> nach oben oder unten, um die Geschwindigkeit individuell zu erhöhen (oben) oder zu verringern (unten).",
                media: "../../assets/pictures/overview/2-4.gif",
            }
        ]
    },
    geschwindigkeit: {
        title: "Abstandsassistent/Adaptiver Geschwindigkeitsassistent (ACC)",
        content: [
            {
                text: "Wenn das <span class='green-text'>ACC-Symbol</span> im Display <span class='green-text'>grün</span> aufleuchtet, ist der Abstandsassistent aktiviert.",
                media: "../../assets/pictures/overview/3-1.gif",
                addHr: true
            },
            {
                text: "Das Fahrzeug hält dann den Abstand zum Vorderfahrzeug automatisch. Es bremst oder beschleunigt, falls nötig.",
                media: "../../assets/pictures/overview/3-2.gif",
                addHr: true
            },
            {
                text: "Drücken Sie die <span class='blue-text'>Abstandstasten</span>, um den Abstand zum Vorderfahrzeug individuell zu erhöhen (rechts) oder zu verringern (links).",
                media: "../../assets/pictures/overview/3-3.gif",
            }
        ]
    },
    stau: {
        title: "Stauassistent",
        content: [
            {
                text: "Erkennt das Fahrzeug eine Stausituation (bei weniger als 60 km/h), wird der Stauassistent automatisch aktiviert. Im Display leuchtet das Symbol TRAFFIC ASSIST <span class='green-text'>ACC-Symbol</span> auf.",
                media: "../../assets/pictures/overview/4-1.gif",
                addHr: true
            },
            {
                text: "Das Fahrzeug beschleunigt, bremst und lenkt dann selbstständig und hält den Abstand zum Vorderfahrzeug automatisch.",
                media: "../../assets/pictures/overview/4-2.gif",
                addHr: true
            },
            {
                text: "Wenn der Stauassistent aktiviert ist, können Sie die Hände vom Lenkrad nehmen. Ihr Blick muss aber weiterhin auf die Straße gerichtet sein. Bremst das Fahrzeug bis zum Stillstand ab, müssen Sie übernehmen und manuell anfahren. Das teilautomatisierte Fahren kann wieder aktiviert werden, sobald „DRIVING ASSIST READY“ weiß im Display aufleuchtet.",
                media: "../../assets/pictures/overview/4-3.jpg",
            }
        ]
    },
    ampelerkennung: {
        title: "Ampelerkennung",
        content: [
            {
                text: "Das Fahrzeug erkennt Ampeln und zeigt diese im Display an. Damit das Fahrzeug an roten Ampeln anhält, müssen Sie diese durch Drücken der <span class='blue-text'>Set-Taste</span> bestätigen.",
                media: "../../assets/pictures/overview/5-1.gif",
                addHr: true
            },
            {
                text: "Nach der Bestätigung erscheint im Display ein <span class='green-text'>grüner Haken (✓)</span>...",
                media: "../../assets/pictures/overview/5-2.gif",
                addHr: true
            },
            {
                text: "… und das Fahrzeug bremst automatisch bis zum Stillstand ab.",
                media: "../../assets/pictures/overview/5-3.gif",
                addHr: true
            },
            {
                text: "Im Stillstand müssen Sie übernehmen und manuell anfahren. Das teilautomatisierte Fahren kann wieder aktiviert werden, sobald „DRIVING ASSIST READY“ weiß im Display aufleuchtet.",
                media: "../../assets/pictures/overview/5-4.gif",
            }
        ]
    },
    spurführung: {
        title: "Lenk- und Spurführungsassistent (LKA)",
        content: [
            {
                text: "Wenn das <span class='green-text'>LKA-Symbol</span> im Display <span class='green-text'>grün</span> aufleuchtet, ist der Spurhalteassistent aktiviert.",
                media: "../../assets/pictures/overview/6-1.gif",
                addHr: true
            },
            {
                text: "Das Fahrzeug hält dann automatisch die Spur.",
                media: "../../assets/pictures/overview/6-2.gif",
            }
        ]
    },
    spurwechsel: {
        title: "Spurwechselassistent",
        content: [
            {
                text: "Das Fahrzeug wechselt auf mehrspurigen Straßen automatisch die Spur, wenn Sie den Blinker antippen und es der Verkehr zulässt. Es beobachtet dabei selbstständig die Umgebung.",
                media: "../../assets/pictures/overview/7-1.gif",
                addHr: true
            },
            {
                text: "Das Spurwechsel-Symbol zeigt die Richtung des geplanten Spurwechsels an.",
                media: "../../assets/pictures/overview/7-2-1.png",
                additionalSmalllMedia: "../../assets/pictures/overview/7-2-2.png",
                addHr: true
            },
            {
                text: "Das Fahrzeug macht eigenständig Vorschläge für einen Spurwechsel, wenn der Verkehr dies zulässt. Wenn Sie den Spurwechsel ausführen möchten, drücken Sie die <span class='blue-text'>Set-Taste</span>, um den Vorschlag zu bestätigen.",
                media: "../../assets/pictures/overview/7-3.gif",
                addHr: true
            },
            {
                text: "Nach der Bestätigung erscheint im Display ein <span class='green-text'>grüner Haken (✓)</span> und der Spurwechsel wird ausgeführt.",
                media: "../../assets/pictures/overview/7-4.gif",
            }
        ]
    },
    notbrems: {
        title: "Notbremsassistent",
        content: [
            {
                text: "Das Fahrzeug erkennt Hindernisse und warnt bei Kollisionsgefahr.",
                media: "../../assets/pictures/overview/8-1.gif",
                addHr: true
            },
            {
                text: "Im Stillstand müssen Sie übernehmen und manuell anfahren. Das teilautomatisierte Fahren kann wieder aktiviert werden, sobald „DRIVING ASSIST READY“ weiß im Display aufleuchtet.",
                text: "Bevor es zum Zusammenstoß mit einem Hindernis, einer Person oder einem weiteren Fahrzeug kommt, bremst das Fahrzeug bis zum Stillstand ab.",
                media: "../../assets/pictures/overview/8-2.gif",
                addHr: true
            },
            {
                text: "Im Stillstand müssen Sie übernehmen und manuell anfahren. Das teilautomatisierte Fahren kann wieder aktiviert werden, sobald „DRIVING ASSIST READY“ weiß im Display aufleuchtet.",
                media: "../../assets/pictures/overview/1-1.gif",
            }
        ]
    },
    deaktivierung: {
        title: "Deaktivierung DRIVING ASSIST",
        content: [
            {
                text: "Drücken Sie die <span class='blue-text'>Aktivierungstaste</span> erneut, um das teilautomatisierte Fahren zu beenden.",
                media: "../../assets/pictures/overview/1-2.gif",
                addHr: true
            },
            {
                text: "Es wird auch beendet, wenn Sie manuell Lenken oder das Bremspedal drücken.",
                additionalMedia: "../../assets/pictures/overview/9-2.gif",
                media: "../../assets/pictures/overview/9-2.gif",
                additionalMedia: "../../assets/pictures/overview/9-3.gif",
                addHr: true
            },
            {
                text: "Bei erfolgreicher Deaktivierung, erlöschen die Lenkradlichter und das Symbol „DRIVING ASSIST“ im Display.",
                media: "../../assets/pictures/overview/9-4.gif",
            }
        ]
    },
    risiken: {
        title: "Risiken und Verantwortung",
        content: [
            {
                text: "Das teilautomatisierte Fahren entbindet Sie nicht von der Verantwortung als Fahrer*in. <br>" +
                    "Es funktioniert in den meisten Fällen sehr gut, kann jedoch nicht alle Fahrsituationen abdecken." +
                    "Kommt das System an seine Grenzen, warnt es Sie und fordert zur Übernahme auf.",
                media: "../../assets/pictures/overview/10-1.png",
                addHr: true
            },

            {
                text: "Es kann jedoch vorkommen, dass das Fahrzeug Fehler macht, ohne vorher zu warnen. Achten Sie " +
                    "deshalb immer auf den Verkehr und die Umgebung. Sie müssen jederzeit sofort eingreifen können. <br>" +
                    "Wir zeigen Ihnen hier einige Beispiele möglicher Fehler:",
                subtext: "<ul class='bullet-points'>"+
                    "<li>Das Fahrzeug erkennt einen Kreisverkehr nicht und lenkt falsch.<img class='media' src='../../assets/pictures/overview/10-1.gif' alt=''></li>"+
                    "<li>Das Fahrzeug erkennt die Fahrspur nicht wegen einer Baustelle.<img class='media' src='../../assets/pictures/overview/10-2.gif' alt=''></li>"+
                    "<li>Das Fahrzeug bremst bei einer roten Ampel trotz Betätigung der SET-Taste nicht ab.<img class='media' src='../../assets/pictures/overview/10-3.gif' alt=''></li>"+
                    "<li>Das Fahrzeug erkennt beim Spurwechsel umliegende Fahrzeuge nicht.<img class='media' src='../../assets/pictures/overview/10-4.gif' alt=''></li>"+
                    "</ul>"
            }
        ]
    }
};


function renderContent(contentId) {
    const section = tutorialContent[contentId];
    let html = `<h1>${section.title}</h1>`;

    section.content.forEach(item => {
        if (item.text) {
            html += `<p>${item.text}</p>`;
        }

        if (item.media && item.additionalMedia) {
            html += `<div class="media-row">
                <img class="media" src="${item.media}" alt="">
                <img class="media" src="${item.additionalMedia}" alt="">
            </div>`;
        } else if (item.media && item.additionalSmalllMedia) {
            html += `<div class="media-row small-media-row">
                <img class="small-media" src="${item.media}" alt="">
                <img class="small-media" src="${item.additionalSmalllMedia}" alt="">
            </div>`;
        } else if (item.media) {
            html += `<img class="media" src="${item.media}" alt="">`;
        }

        if (item.subtext) {
            html += `<p>${item.subtext}</p>`;
        }

        if (item.addHr) {
            html += '<hr>';
        }
    });

    return html;
}