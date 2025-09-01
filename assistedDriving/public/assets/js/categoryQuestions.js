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
                question: "Wie können Sie als Fahrer*in das teilautomatisierte Fahren aktivieren?",
                options: [
                    {text: "Durch das Drücken des Bremspedals", correct: false},
                    {text: "Durch das Drücken der Aktivierungstaste", correct: true},
                    {text: "Durch das Loslassen des Lenkrads", correct: false},
                    {text: "Durch einen Doppelklick auf die Set-Taste", correct: false}
                ]
            },
            {
                question: "Leuchtet das Automationssymbol in weiß, ist das teilautomatisierte Fahren verfügbar.",
                options: [
                    {text: "Richtig", correct: true},
                    {text: "Falsch", correct: false}
                ]
            },
            {
                question: "In welcher Farbe leuchtet das Symbol Automationssymbol bei erfolgreicher Aktivierung des teilautomatisierten Fahrens?",
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
                question: "Bei einem neuen Tempolimit wird die erkannte Geschwindigkeit automatisch übernommen.",
                options: [
                    {text: "Richtig", correct: true},
                    {text: "Falsch", correct: false},
                ]
            },
            {
                question: "Wo wird Ihnen als Fahrer*in das erkannte Tempolimit angezeigt?",
                options: [
                    {text: "Im Seitenspiegel", correct: false},
                    {text: "Im Display ", correct: true},
                    {text: "Auf dem Lenkrad", correct: false},
                    {text: "Auf der Aktivierungstaste", correct: false}
                ]
            },
            {
                question: "Können Sie als Fahrer*in während der teilautomatisierten Fahrt die Geschwindigkeit im teilautomatisierten Fahren manuell anpassen?",
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
                question: "Wie wird der eingestellte Abstand zum Vorderfahrzeug im Display symbolisch dargestellt?",
                options: [
                    {text: "Durch ein rotes Lenkrad", correct: false},
                    {text: "Durch Blinken des Automationssymbols", correct: false},
                    {text: "Durch Striche vor dem Fahrzeug", correct: true},
                    {text: "Durch ein weißes Dreieck", correct: false}
                ]
            }
        ],
        ampelerkennung: [
            {
                question: "Erkennt das Fahrzeug Ampeln, wenn das teilautomatisierte Fahren aktiv ist?",
                options: [
                    {text: "Richtig", correct: true},
                    {text: "Falsch", correct: false},
                ]
            },
            {
                question: "Das Fahrzeug bremst automatisch, wenn es eine rote Ampel erkannt hat.",
                options: [
                    {text: "Richtig", correct: true},
                    {text: "Falsch", correct: false},
                ]
            },
            {
                question: "Im Stillstand erkennt das Fahrzeug grüne Ampeln und fährt automatisch wieder los.",
                options: [
                    {text: "Richtig", correct: false},
                    {text: "Falsch", correct: true},
                ]
            }
        ],
        spurführung: [
            {
                question: "Ist das teilautomatisierte Fahren aktiv, hält das Fahrzeug die Spur selbstständig?",
                options: [
                    {text: "Richtig", correct: true},
                    {text: "Falsch", correct: false},
                ]
            },
            {
                question: "Können Sie als Fahrer*in das Lenkrad loslassen, wenn das teilautomatisierten Fahren aktiv ist?",
                options: [
                    {text: "Ja", correct: true},
                    {text: "Nein", correct: false},
                ]
            },
            {
                question: "Das Fahrzeug schlägt eigenständig Spurwechsel vor, auch wenn es die Verkehrssituation nicht zulässt.",
                options: [
                    {text: "Richtig", correct: false},
                    {text: "Falsch", correct: true},
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
                    {text: "Das Fahrzeug reagiert gar nicht", correct: false},
                    {text: "Der Fahrer erhält nur eine visuelle Warnung", correct: false}
                ]
            }
        ],
        deaktivierung: [
            {
                question: "Wie kann das teilautomatisierte Fahren deaktiviert werden?",
                options: [
                    {text: "Durch langes Drücken der Set-Taste", correct: false},
                    {text: "Durch kurzes Antippen des Blinkers", correct: false},
                    {text: "Durch erneutes Drücken der Aktivierungstaste", correct: true},
                    {text: "Durch manuellen Einstellen des Abstands über die Abstandstasten", correct: false}
                ]
            },
            {
                question: "Kann das teilautomatisierte Fahren durch manuelles Eingreifen (z.B. Lenken oder Bremsen) durch Sie als Fahrer*in deaktiviert werden?",
                options: [
                    {text: "Ja", correct: true},
                    {text: "Nein", correct: false},
                ]
            },
            {
                question: "Wie wird angezeigt, dass das teilautomatisierte Fahren deaktiviert wurde?",
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
                question: "Das teilautomatisierte Fahren entbindet Sie als Fahrer*in von der Verantwortung, sodass Sie nicht mehr aufmerksam sein müssen.",
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
                question: "Warum dürfen Sie sich als Fahrer*in nicht vollständig auf die Assistenzsysteme verlassen?",
                options: [
                    {text: "Weil die Systeme zu langsam reagieren", correct: false},
                    {text: "Weil das teilautomatisierte Fahrzeug immer 10 km/h schneller fährt als erlaubt", correct: false},
                    {text: "Weil die Systeme Fehler machen können, ohne Sie als Fahrer*in zu warnen", correct: true},
                    {text: "Weil das teilautomatisierte nur auf Autobahnen nutzbar ist", correct: false}
                ]
            }
        ]
    };

    categories = Object.keys(categoryQuestions).map(key => {
        const nameMap = {
            aktivierung: 'Aktivierung',
            verkehrszeichen: 'Verkehrszeichenassistent',
            geschwindigkeit: 'Abstandsregeltempomat',
            ampelerkennung: 'Ampelerkennung',
            spurführung: 'Spurführungsassistent',
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