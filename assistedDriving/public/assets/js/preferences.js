const assistanceSystems = [
    'Aktivierung',
    'Verkehrszeichenassistent',
    'Abstandsregeltempomat',
    'Stauassistent',
    'Ampelerkennung',
    'Spurführungsassistent',
    'Spurwechselassistent',
    'Notbremsassistent',
    'Deaktivierung',
    'Risiken und Verantwortung'
];

const experienceLevels = [
    'Keine Erfahrung',
    'Etwas Erfahrung',
    'Vertraut',
    'Fortgeschritten',
    'Experte'
];

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('preferencesForm');
    const saveBtn = document.getElementById('savePreferences');

    const table = document.createElement('table');
        table.className = 'preferences-table';

        const headerRow = document.createElement('tr');
        headerRow.appendChild(document.createElement('th'));
        experienceLevels.forEach(level => {
            const th = document.createElement('th');
            th.textContent = level;
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);
    
        assistanceSystems.forEach(system => {
            const row = document.createElement('tr');
            const labelCell = document.createElement('td');
            labelCell.textContent = system;
            row.appendChild(labelCell);

            experienceLevels.forEach(level => {
                const td = document.createElement('td');
                const radio = document.createElement('input');
                    radio.type = 'radio';
                    radio.name = system;
            radio.value = level;
            td.appendChild(radio);
            row.appendChild(td);
        });
        table.appendChild(row);
    });

    form.appendChild(table);


    saveBtn.addEventListener('click', async () => {
        const prefs = {};

        assistanceSystems.forEach(system => {
            const selected = form.querySelector(`input[name="${system}"]:checked`);
            if (selected) {
                prefs[system] = selected.value;
            }
             });
            localStorage.setItem('preferences', JSON.stringify(prefs));
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

/*
        function createTable(sectionId, rows, prefix) {
        const section = document.getElementById(sectionId);
        const table = document.createElement('table');
        const header = document.createElement('tr');
        header.appendChild(document.createElement('th'));
        for (let i = 1; i <= 7; i++) {
            const th = document.createElement('th');
            th.textContent = i;
            header.appendChild(th);
        }
        table.appendChild(header);

        rows.forEach((text, rowIndex) => {
            const tr = document.createElement('tr');
            const labelCell = document.createElement('td');
            labelCell.textContent = text;
            tr.appendChild(labelCell);

            for (let i = 1; i <= 7; i++) {
                const td = document.createElement('td');
                const radio = document.createElement('input');
                radio.type = 'radio';
                radio.name = `${prefix}-${rowIndex}`;
                radio.value = i;
                td.appendChild(radio);
                tr.appendChild(td);
            }
            table.appendChild(tr);
        });
        section.appendChild(table);
    }

    createTable('assistanceSection', assistanceSystems, 'assist');
    createTable('experienceSection', experienceLevels, 'exp');

    saveBtn.addEventListener('click', async () => {
        let score = 0;
        assistanceSystems.forEach((_, idx) => {
            const sel = form.querySelector(`input[name="assist-${idx}"]:checked`);
            if (sel) score += parseInt(sel.value, 10);
        });
        experienceLevels.forEach((_, idx) => {
            const sel = form.querySelector(`input[name="exp-${idx}"]:checked`);
            if (sel) score += parseInt(sel.value, 10);
        });

        const allCategories = categories.map(c => c.key);
        const basicCategories = allCategories.slice(0, 3);
        const selectedCategories = score >= 9 ? allCategories : basicCategories;

        localStorage.setItem('preferences', JSON.stringify(selectedCategories));
        localStorage.setItem('userScore', score);
        const userCode = localStorage.getItem('userCode');
        if (userCode) {
            try {
                await fetch(`/api/users/${userCode}/preferences`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ preferences: selectedCategories })
                });
            } catch (e) { console.error('Saving preferences failed', e); }
        }
        
        window.location.href = '/views/welcome';
    });
});*/