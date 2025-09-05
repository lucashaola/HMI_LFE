const assistanceSystems = [
    {
        name: 'Verkehrszeichenassistent',
        description: 'Erkennt Verkehrszeichen und zeigt die Informationen im Fahrzeug an. Kann die Geschwindigkeit entsprechend automatisch anpassen.'
    },
    {
        name: 'Abstandsregeltempomat',
        description: 'Hält automatisch einen voreingestellten Abstand zum vorausfahrenden Fahrzeug durch Beschleunigen und Abbremsen.'
    },
    {
        name: 'Ampelerkennung',
        description: 'Erkennt Ampeln und zeigt den Status im Fahrzeug an. Kann auf das Ampelsignal reagieren oder die Fahrperson entsprechend informieren.'
    },
    {
        name: 'Spurführungsassistent',
        description: 'Erkennt die Fahrspurmarkierungen und hält das Fahrzeg aktiv in der Spur, ohne die Fahrspur zu verlassen.'
    },
    {
        name: 'Notbremsassistent',
        description: 'Erkennt Kollisionsgefahren und warnt davor. Bremst bei drohender Kollision automatisch zur Reduktion der Aufprallgeschwindigkeit.'
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