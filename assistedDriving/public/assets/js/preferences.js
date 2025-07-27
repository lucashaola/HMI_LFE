const assistanceSystems = [
    'Aktivierung',
    'Verkehrszeichenassistent',
    'Abstandsregeltempomat',
    'Stauassistent',
    'Ampelerkennung',
    'Spurführungsassistent',
    'Spurwechselassistent'
];

const systemIdMap = {
    'Aktivierung': 'aktivierung',
    'Verkehrszeichenassistent': 'verkehrszeichen',
    'Abstandsregeltempomat': 'geschwindigkeit',
    'Stauassistent': 'stau',
    'Ampelerkennung': 'ampelerkennung',
    'Spurführungsassistent': 'spurführung',
    'Spurwechselassistent': 'spurwechsel'
};

/**
 * Builds a rating table for the given assistance systems.
 * @param {HTMLElement} tableEl The table element to populate.
 * @param {string} prefix Prefix for radio input names.
 */
function buildTable(tableEl, prefix) {
    const header = document.createElement('tr');
    header.appendChild(document.createElement('th'));
    const labels = [
        'keins',
        'sehr wenig',
        'wenig',
        'eher wenig',
        'eher viel',
        'viel',
        'sehr viel'
    ];
    for (let i = 0; i <= 6; i++) {
        const th = document.createElement('th');
        th.textContent = labels[i];
        header.appendChild(th);
    }
    tableEl.appendChild(header);

    assistanceSystems.forEach((system, index) => {
        const row = document.createElement('tr');
        const label = document.createElement('td');
        label.textContent = system;
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
    const practicalTable = document.getElementById('practicalTable');
    const theoreticalTable = document.getElementById('theoreticalTable');
    const saveBtn = document.getElementById('savePreferences');

    buildTable(practicalTable, 'prac');
    buildTable(theoreticalTable, 'theo');


    saveBtn.addEventListener('click', async () => {
        const prefs = {};
        const visibility = {};

        assistanceSystems.forEach((system, index) => {
            const pracSel = document.querySelector(`input[name="prac-${index}"]:checked`);
            const theoSel = document.querySelector(`input[name="theo-${index}"]:checked`);
            const pracVal = pracSel ? parseInt(pracSel.value, 10) : 0;
            const theoVal = theoSel ? parseInt(theoSel.value, 10) : 0;
            const mean = (pracVal + theoVal) / 2;

            prefs[system] = { practical: pracVal, theoretical: theoVal, mean };
            const sectionId = systemIdMap[system];
            if (sectionId) visibility[sectionId] = mean <= 3;
        });

        localStorage.setItem('preferences', JSON.stringify(prefs));
        localStorage.setItem('tutorialVisibility', JSON.stringify(visibility));

        const userCode = localStorage.getItem('userCode');
        if (userCode) {
            try {
                await fetch(`/api/users/${userCode}/preferences`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ preferences: prefs })
                });
            } catch (e) {
                console.error('Saving preferences failed', e);
            }
        }

        window.location.href = '/views/welcome';
    });
});