const assistanceSystems = [
    {
        name: 'Verkehrszeichenassistent',
        description: 'Das System erkennt Verkehrszeichen, zeigt die entsprechenden Informationen im Fahrzeug an und passt die Fahrzeuggeschwindigkeit automatisch an.'
    },
    {
        name: 'Abstandsregeltempomat',
        description: 'Das System hält einen festgelegten Abstand zum Vorderfahrzeug, indem es automatisch bremst/beschleunigt und so die Geschwindigkeit an den Verkehrsfluss anpasst.'
    },
    {
        name: 'Ampelerkennung',
        description: 'Das System erkennt Ampelsignale, zeigt die entsprechenden Informationen im Fahrzeug an und reagiert selbst oder gibt dem Fahrer Fahranweisungen.'
    },
    {
        name: 'Spurführungsassistent',
        description: 'Das System hält das Fahrzeug in der Mitte der Fahrspur und lenkt das Fahrzeug unentwegt.'
    },
    {
        name: 'Notbremsassistent',
        description: 'Das System erkennt, ob eine Kollisionsgefahr mit anderen Fahrzeugen besteht, warnt vor einer drohenden Kollision oder unterstützt den Fahrer aktiv durch Erhöhung des Bremsmoments.'
    }
];

function buildTable(tableEl, prefix) {
    const header = document.createElement('tr');
    header.appendChild(document.createElement('th'));
    const labels = ['keins', 'sehr wenig', 'wenig', 'eher wenig', 'eher viel', 'viel', 'sehr viel'];
    for (let i = 0; i <= 6; i++) {
        const th = document.createElement('th');
        th.textContent = labels[i];
        header.appendChild(th);
    }
    tableEl.appendChild(header);

    assistanceSystems.forEach((system, index) => {
        const row = document.createElement('tr');
        const label = document.createElement('td');
        label.innerHTML = `<strong>${system.name}</strong><br><span class="system-desc">${system.description}</span>`;
        row.appendChild(label);

        for (let i = 0; i <= 6; i++) {
            const td = document.createElement('td');
            const input = document.createElement('input');
            input.type = 'radio';
            input.name = `${prefix}-${index}`;
            input.value = i;
            td.appendChild(input);
            row.appendChild(td);
        }

        tableEl.appendChild(row);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const theoreticalTable = document.getElementById('theoreticalTable');
    buildTable(theoreticalTable, 'theo');

    const storedPrefs = JSON.parse(localStorage.getItem('preferences') || '{}');
    assistanceSystems.forEach((system, index) => {
        const val = storedPrefs[system.name]?.theoretical;
        if (typeof val === 'number') {
            const selector = `input[name="theo-${index}"][value="${val}"]`;
            const input = document.querySelector(selector);
            if (input) input.checked = true;
        }
    });

    document.getElementById('nextPreferences').addEventListener('click', () => {
        const prefs = JSON.parse(localStorage.getItem('preferences') || '{}');
        assistanceSystems.forEach((system, index) => {
            const sel = document.querySelector(`input[name="theo-${index}"]:checked`);
            const val = sel ? parseInt(sel.value, 10) : 0;
            if (!prefs[system.name]) prefs[system.name] = {};
            prefs[system.name].theoretical = val;
        });
        localStorage.setItem('preferences', JSON.stringify(prefs));
        window.location.href = '/views/preferencesPractical';
    });
});