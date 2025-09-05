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
        title: "Aktivierung",
        content: [
            {
                text: "Der Status der Automation wird durch das Automationssymbol im Display angezeigt. " +
                    "Erscheint das Symbol grau, ist das teilautomatisierte Fahren <b>nicht</b> verfügbar. ",
                media: "../../assets/pictures/overview/1neu1.gif",
                addHr: true
            },
            {
                text: "Wenn das Automationssymbol weiß im Display aufleuchtet, ist das teilautomatisierte Fahren verfügbar.",
                media: "../../assets/pictures/overview/1neu2.gif",
                subtext: "Bei Bedingungen, wie zum Beispiel schlechtem Wetter, kann es unter Umständen nicht verfügbar sein.",
                addHr: true
            },
            {
                text: "Drücken Sie die <span class='blue-text'>„Aktivierungstaste“</span>, um das teilautomatisierte Fahren zu aktivieren.",
                media: "../../assets/pictures/overview/1-2.gif",
                addHr: true
            },
            {
                text: "Bei erfolgreicher Aktivierung, leuchtet das Automationssymbol <span class='green-text'>grün</span> im Display auf.",
                media: "../../assets/pictures/overview/1neu3.gif",
                addHr: true
            },
            {
                text: "Zudem leuchten die Lenkradlichter <span class='green-text'>grün</span>.",
                media: "../../assets/pictures/overview/1-4.gif",
                addHr: true
            },
            {
                text: "Es sind nun <b>alle</b> Fahrerassistenzsysteme aktiv und das Fahrzeug fährt <b>teilautomatisiert</b>. " +
                    "Richten Sie Ihren Blick weiterhin auf die Straße und nehmen Sie die Füße von den Pedalen. " +
                    "Ihre Hände können Sie während der automatisierten Fahrt vom Lenkrad nehmen oder am Lenkrad belassen, ohne zu lenken. ",
                media: "../../assets/pictures/overview/4-3.jpg",
                additionalMedia: "../../assets/pictures/overview/1-6.gif",
            }
        ]
    },
    verkehrszeichen: {
        title: "Verkehrszeichenassistent",
        content: [
            {
                text: "Das Fahrzeug erkennt Tempolimits.",
                media: "../../assets/pictures/overview/2neu1.gif",
                addHr: true
            },
            {
                text: "Das erkannte Tempolimit wird im Display angezeigt. Bei einem neuen Tempolimit wird die erkannte Geschwindigkeit automatisch übernommen.",
                media: "../../assets/pictures/overview/2neu2.gif",
                addHr: true
            },
            {
                text: "Drücken Sie den <span class='blue-text'>Hebel</span> nach oben oder unten, um die Geschwindigkeit individuell zu erhöhen (oben) oder zu verringern (unten).",
                media: "../../assets/pictures/overview/2-4.gif",
                addHr: true
            },
            {
                text: "Ihre individuell eingestellte Geschwindigkeit wird im Display angezeigt.",
                media: "../../assets/pictures/overview/2neu3.gif",
            }
        ]
    },
    geschwindigkeit: {
        title: "Abstandsregeltempomat",
        content: [
            {
                text: "Das Fahrzeug hält dann den Abstand zum Vorderfahrzeug automatisch. Es bremst oder beschleunigt, falls nötig.",
                media: "../../assets/pictures/overview/3-2.gif",
                addHr: true
            },
            {
                text: "Drücken Sie die <span class='blue-text'>Abstandstasten</span>, um den Abstand zum Vorderfahrzeug individuell zu erhöhen (rechts) oder zu verringern (links).",
                media: "../../assets/pictures/overview/3-3.gif",
                addHr: true
            },
            {
                text: "Der individuell eingestellte Abstand wird im Display symbolisch angezeigt. Die Striche vor dem Fahrzeug visualisieren den Abstand – je mehr Striche, desto größer der eingestellte Abstand. ",
                media: "../../assets/pictures/overview/3neu1.gif",
            }
        ]
    },
    ampelerkennung: {
        title: "Ampelerkennung",
        content: [
            {
                text: "Das Fahrzeug erkennt Ampeln und bremst bei roten Ampeln automatisch bis zum Stillstand ab.",
                media: "../../assets/pictures/overview/4neu1.gif",
                addHr: true
            },
            {
                text: "Im Stillstand müssen Sie übernehmen und manuell anfahren. Das teilautomatisierte Fahren kann wieder " +
                    "aktiviert werden, sobald das Symbol weiß im Display aufleuchtet.",
                media: "../../assets/pictures/overview/4neu2.gif",
            },
        ]
    },
    spurführung: {
        title: "Spurführungsassistent",
        content: [
            {
                text: "Das Fahrzeug hält automatisch die Spur, wenn das teilautomatisierte Fahren aktiv ist.",
                media: "../../assets/pictures/overview/6-2.gif",
                addHr: true
            },
            {
                text: "\n" +
                    "Automatische Spurwechsel sind nicht möglich. Deaktivieren Sie das teilautomatisierte Fahren durch Drücken der Aktivierungstaste, um einen Spurwechsel manuell auszuführen.",
                media: "../../assets/pictures/overview/1-2.gif",
                additionalMedia: "../../assets/pictures/overview/9-3.gif",
            }
        ]
    },
    notbrems: {
        title: "Notbremsassistent",
        content: [
            {
                text: "Das Fahrzeug erkennt Hindernisse. Bevor es zum Zusammenstoß mit einem Hindernis, einer Person oder einem weiteren Fahrzeug kommt, bremst das Fahrzeug bis zum Stillstand ab.",
                media: "../../assets/pictures/overview/8-2.gif",
                addHr: true
            },
            {
                text: "Im Stillstand müssen Sie übernehmen und manuell anfahren. Das teilautomatisierte Fahren kann wieder " +
                    "aktiviert werden, sobald das Symbol weiß im Display aufleuchtet. ",
                media: "../../assets/pictures/overview/6neu1.gif",
            }
        ]
    },
    deaktivierung: {
        title: "Deaktivierung",
        content: [
            {
                text: "Drücken Sie die <span class='blue-text'>Aktivierungstaste</span> erneut, um das teilautomatisierte Fahren zu beenden.",
                media: "../../assets/pictures/overview/1-2.gif",
                addHr: true
            },
            {
                text: "Es wird auch beendet, wenn Sie manuell Lenken oder das Bremspedal drücken.",
                media: "../../assets/pictures/overview/9-2.gif",
                additionalMedia: "../../assets/pictures/overview/9-3.gif",
                addHr: true
            },
            {
                text: "Bei erfolgreicher Deaktivierung, erlöschen die Lenkradlichter und das Automationssymbol im " +
                    "Display erscheint wieder weiß.",
                media: "../../assets/pictures/overview/7neu1.gif",
            }
        ]
    },
    risiken: {
        title: "Risiken und Verantwortung",
        content: [
            {
                text: "Das teilautomatisierte Fahren entbindet Sie nicht von der Verantwortung als Fahrer*in. <br>" +
                    "Es funktioniert in den meisten Fällen sehr gut, kann jedoch nicht alle Fahrsituationen abdecken." +
                    " Kommt das System an seine Grenzen, warnt es Sie und fordert zur Übernahme auf.",
                media: "../../assets/pictures/overview/8neu1.gif",
                addHr: true
            },

            {
                text: "Es kann jedoch vorkommen, dass das Fahrzeug Fehler macht, ohne vorher zu warnen. Achten Sie " +
                    "deshalb immer auf den Verkehr und die Umgebung. Sie müssen jederzeit sofort eingreifen können. <br>" +
                    "Wir zeigen Ihnen hier einige Beispiele möglicher Fehler:",
                subtext: "<ul class='bullet-points'>"+
                    "<li>Das Fahrzeug erkennt einen Kreisverkehr nicht und lenkt falsch.<img class='media' src='../../assets/pictures/overview/10-1.gif' alt=''></li>"+
                    "<li>Das Fahrzeug erkennt die Fahrspur nicht wegen einer Baustelle.<img class='media' src='../../assets/pictures/overview/10-2.gif' alt=''></li>"+
                    "<li>Das Fahrzeug bremst bei einer roten Ampel nicht ab.<img class='media' src='../../assets/pictures/overview/10-3.gif' alt=''></li>"+
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