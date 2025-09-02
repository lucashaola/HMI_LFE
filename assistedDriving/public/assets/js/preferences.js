document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('preferencesForm');
    const saveBtn = document.getElementById('savePreferences');

     // categories that are always selected and cannot be changed by the user
    const mandatory = ['aktivierung', 'deaktivierung', 'risiken'];

    // build checkbox list from categories
    const prefs = JSON.parse(localStorage.getItem('preferences') || '[]');
    categories.forEach(cat => {
        if (mandatory.includes(cat.key)) return; // do not render mandatory categories

        const label = document.createElement('label');
        label.style.display = 'block';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = cat.key;
        checkbox.checked = prefs.includes(cat.key);

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(' ' + cat.name));
        form.appendChild(label);
    });

    saveBtn.addEventListener('click', async () => {
        const selected = Array.from(form.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);
        const merged = [...new Set([...selected, ...mandatory])];
        localStorage.setItem('preferences', JSON.stringify(merged));
        const userCode = localStorage.getItem('userCode');
        if (userCode) {
            try {
                await fetch(`/api/users/${userCode}/preferences`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ preferences: merged })
                });
            } catch (e) { console.error('Saving preferences failed', e); }
        }
        window.location.href = '/views/overview';
    });
});