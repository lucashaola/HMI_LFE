(function (root) {
    /** categoryQuestions object is structured as follows:
     * - Each key represents a category (e.g., "aktivierung", "verkehrszeichen").
     * - Each category contains an array of question objects.
     * - Each question object includes:
     *   - `question`: The question text.
     *   - `options`: An array of answer options, each with a `text` and a `correct` boolean indicating whether the option is correct.
     */
    const categoryQuestions = {
        aktivierung: [
            {
                question: "Wie können Sie als Fahrer*in das teilautomatisierte Fahren (DRIVING ASSIST) aktivieren?",
                options: [
                    {text: "Durch das Drücken des Bremspedals", correct: false},
                    {text: "Durch das Drücken der Aktivierungstaste", correct: true},
                    {text: "Durch das Loslassen des Lenkrads", correct: false},
                    {text: "Durch einen Doppelklick auf die Set-Taste", correct: false}
                ]
            },
            {
                question: "Leuchtet „DRIVING ASSIST READY“ in weiß, ist das teilautomatisierte Fahren verfügbar.",
                options: [
                    {text: "Richtig", correct: true},
                    {text: "Falsch", correct: false}
                ]
            },
            {
                question: "In welcher Farbe leuchtet das Symbol „DRIVING ASSIST“ bei erfolgreicher Aktivierung des teilautomatisierten Fahrens?",
                options: [
                    {text: "Blau", correct: false},
                    {text: "Rot", correct: false},
                    {text: "Gelb", correct: false},
                    {text: "Grün", correct: true}
                ]
            }
        ],
        verkehrszeichen: [
            {
                question: "Das Fahrzeug erkennt Tempolimits und andere Verkehrszeichen.",
                options: [
                    {text: "Richtig", correct: true},
                    {text: "Falsch", correct: false},
                ]
            },
            {
                question: "Welche Taste nutzen Sie als Fahrer*in, um eine erkannte Geschwindigkeit zu übernehmen?",
                options: [
                    {text: "Abstandstaste", correct: false},
                    {text: "Blinkerhebel", correct: false},
                    {text: "Set-Taste", correct: true},
                    {text: "Aktivierungstaste 3", correct: false}
                ]
            },
            {
                question: "Können Sie als Fahrer*in die Geschwindigkeit nach der Übernahme manuell anpassen?\n",
                options: [
                    {text: "Ja", correct: true},
                    {text: "Nein", correct: false},
                ]
            }
        ],
        geschwindigkeit: [
            {
                question: "Ist das teilautomatisierte Fahren aktiviert, hält das Fahrzeug automatisch den Abstand zum Vorderfahrzeug.",
                options: [
                    {text: "Richtig", correct: true},
                    {text: "Falsch", correct: false},
                ]
            },
            {
                question: "Für Sie als Fahrer*in ist es nicht möglich, den Abstand zum Vorderfahrzeug individuell anzupassen.\n",
                options: [
                    {text: "Richtig", correct: false},
                    {text: "Falsch", correct: true},
                ]
            },
            {
                question: "Woran erkennen Sie als Fahrer*in, dass der ACC aktiviert ist?",
                options: [
                    {text: "Am roten Symbol im Rückspiegel", correct: false},
                    {text: "Am Blinken des Lenkradlichts", correct: false},
                    {text: "Am grünen ACC-Symbol im Display", correct: true},
                    {text: "Am weißen ACC-Symbol im Display", correct: false}
                ]
            }
        ],
        stau: [
            {
                question: "Der Stauassistent wird automatisch bei Geschwindigkeiten unter 60 km/h aktiviert.",
                options: [
                    {text: "Richtig", correct: true},
                    {text: "Falsch", correct: false},
                ]
            },
            {
                question: "Wie fährt das Fahrzeug aus dem Stillstand wieder an?",
                options: [
                    {text: "Manuelles Anfahren durch den Fahrer", correct: true},
                    {text: "Automatisch oder durch Drücken der Set-Taste", correct: false},
                    {text: "Nur mit eingeschaltetem Blinker", correct: false},
                    {text: "Durch leichtes Antippen des Bremspedals", correct: false}
                ]
            },
            {
                question: "Wenn der Stauassistent aktiv ist, können Sie als Fahrer*in den Blick von der Straße abwenden?",
                options: [
                    {text: "Richtig", correct: false},
                    {text: "Falsch", correct: true}
                ]
            }
        ],
        ampelerkennung: [
            {
                question: "Bremst das Fahrzeug automatisch, wenn es eine rote Ampel erkannt hat und diese von Ihnen als Fahrer*in bestätigt wurde?",
                options: [
                    {text: "Richtig", correct: true},
                    {text: "Falsch", correct: false},
                ]
            },
            {
                question: "Bremst das Fahrzeug automatisch, wenn es eine rote Ampel erkennt?",
                options: [
                    {text: "Ja", correct: false},
                    {text: "Nein", correct: true},
                ]
            },
            {
                question: "Wie signalisiert das System, dass eine rote Ampel von Ihnen als Fahrer*in bestätigt wurde?",
                options: [
                    {text: "Durch ein akustisches Signal", correct: false},
                    {text: "Durch ein rotes Warnlicht", correct: false},
                    {text: "Durch einen grünen Haken im Display", correct: true},
                    {text: "Durch Vibrieren des Lenkrads\n", correct: false}
                ]
            }
        ],
        spurführung: [
            {
                question: "Welche Anzeige im Display bestätigt die Aktivierung des Spurhalteassistenten (LKA) im DRIVING ASSIST?",
                options: [
                    {text: "Ein rotes Lenkradsymbol", correct: false},
                    {text: "Das grüne LKA-Symbol", correct: true},
                    {text: "Die Geschwindigkeitsangabe", correct: false},
                    {text: "Ein weißes Ausrufezeichen", correct: false}
                ]
            },
            {
                question: "Ist der Spurhalteassistent aktiv, hält das Fahrzeug die Spur selbstständig.",
                options: [
                    {text: "Richtig", correct: true},
                    {text: "Falsch", correct: false},
                ]
            },
            {
                question: "Können Sie als Fahrer*in das Lenkrad loslassen, wenn der Spurhalteassistent aktiv ist?",
                options: [
                    {text: "Ja", correct: false},
                    {text: "Nein", correct: true},
                ]
            }
        ],
        spurwechsel: [
            {
                question: "Wie wird ein automatischer Spurwechsel durch Sie als Fahrer*in eingeleitet?",
                options: [
                    {text: "Durch das Betätigen des Bremspedals", correct: false},
                    {text: "Durch eine Sprachanweisung", correct: false},
                    {text: "Durch Antippen des Blinkers", correct: true},
                    {text: "Durch Erkennen von Fahrbahnmarkierungen", correct: false}
                ]
            },
            {
                question: "Das Fahrzeug schlägt eigenständig einen Spurwechsel vor, auch wenn es die Verkehrssituation nicht zulässt.",
                options: [
                    {text: "Richtig", correct: false},
                    {text: "Falsch", correct: true},
                ]
            },
            {
                question: "Müssen Sie als Fahrer*in einen vorgeschlagenen Spurwechsel durch das Fahrzeug immer bestätigen, bevor dieser ausgeführt wird?",
                options: [
                    {text: "Ja", correct: true},
                    {text: "Nein", correct: false}
                ]
            }
        ],
        notbrems: [
            {
                question: "Funktioniert der Notbremsassistent nur bei statischen Hindernissen?",
                options: [
                    {text: "Ja", correct: false},
                    {text: "Nein", correct: true},
                ]
            },
            {
                question: "In welcher Situation greift der Notbremsassistent ein?",
                options: [
                    {text: "Wenn der Fahrer eine Warnung durch die Set-Taste bestätigt", correct: false},
                    {text: "Nur in bestimmten Verkehrssituationen", correct: false},
                    {text: "Wenn eine Kollision mit einem Hindernis, einer Person oder einem Fahrzeug droht", correct: true},
                    {text: "Nur bei niedrigen Geschwindigkeiten unter 30 km/h", correct: false}
                ]
            },
            {
                question: "Was passiert, wenn der Notbremsassistent eine Kollisionsgefahr registriert?",
                options: [
                    {text: "Der Fahrer wird dazu aufgefordert, selbst zu bremsen", correct: false},
                    {text: "Das Fahrzeug bremst automatisch bis zum Stillstand", correct: true},
                    {text: "Der DRIVING ASSIST deaktiviert sich automatisch", correct: false},
                    {text: "Der Fahrer erhält nur eine visuelle Warnung", correct: false}
                ]
            }
        ],
        deaktivierung: [
            {
                question: "Wie kann der DRIVING ASSIST deaktiviert werden?",
                options: [
                    {text: "Durch langes Drücken der Set-Taste", correct: false},
                    {text: "Durch kurzes Antippen des Blinkers", correct: false},
                    {text: "Durch erneutes Drücken der Aktivierungstaste", correct: true},
                    {text: "Durch manuellen Einstellen des Abstands über die Abstandstasten", correct: false}
                ]
            },
            {
                question: "Kann der DRIVING ASSIST durch manuelles Eingreifen (z.B. Lenken oder Bremsen) durch Sie als Fahrer*in deaktiviert werden?",
                options: [
                    {text: "Ja", correct: true},
                    {text: "Nein", correct: false},
                ]
            },
            {
                question: "Wie wird angezeigt, dass der DRIVING ASSIST deaktiviert wurde?",
                options: [
                    {text: "Durch ein rotes Ausrufezeichen im Display", correct: false},
                    {text: "Durch ein akustisches Signal", correct: false},
                    {text: "Durch das Erlöschen der Lenkradlichter und des Symbols im Display", correct: true},
                    {text: "Durch eine Warnmeldung im Head-Up-Display", correct: false}
                ]
            }
        ],
        risiken: [
            {
                question: "Das teilautomatisierte Fahren durch den DRIVING ASSIST entbindet Sie als Fahrer*in von der Verantwortung, sodass Sie nicht mehr aufmerksam sein müssen.",
                options: [
                    {text: "Richtig", correct: false},
                    {text: "Falsch", correct: true},
                ]
            },
            {
                question: "Müssen Sie als Fahrer*in jederzeit auf unvorhersehbare Situationen vorbereitet sein?",
                options: [
                    {text: "Ja", correct: true},
                    {text: "Nein", correct: false},
                ]
            },
            {
                question: "Warum dürfen Sie sich als Fahrer*in nicht vollständig auf die Assistenzsysteme im DRIVING ASSIST verlassen?",
                options: [
                    {text: "Weil die Systeme zu langsam reagieren", correct: false},
                    {text: "Weil das teilautomatisierte Fahrzeug immer 10 km/h schneller fährt als erlaubt", correct: false},
                    {text: "Weil die Systeme Fehler machen können, ohne Sie als Fahrer*in zu warnen", correct: true},
                    {text: "Weil der DRIVING ASSIST nur auf Autobahnen nutzbar ist", correct: false}
                ]
            }
        ]
    };

    /** categories array maps each category key to a name and an icon path, if you want to add a new category, the icon must be the same as the mapped name - e.g. Aktivierung*/
    categories = Object.keys(categoryQuestions).map(key => {
        const nameMap = {
            aktivierung: 'Aktivierung',
            verkehrszeichen: 'Verkehrszeichenassistent',
            geschwindigkeit: 'Abstandsregeltempomat',
            ampelerkennung: 'Ampelerkennung',
            stau: 'Stauassistent',
            spurführung: 'Spurführungsassistent',
            spurwechsel: 'Spurwechselassistent',
            notbrems: 'Notbremsassistent',
            deaktivierung: 'Deaktivierung',
            risiken: 'Risiken und Verantwortung',
        };

        return {
            key: key,
            name: nameMap[key],
            icon: `../../assets/icons/tutorial/${nameMap[key]}.svg`
        };
    });

    // Node.js environment
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = categoryQuestions;
    }
    // Browser environment
    else {
        root.categoryQuestions = categoryQuestions;
    }
})(typeof self !== 'undefined' ? self : this);