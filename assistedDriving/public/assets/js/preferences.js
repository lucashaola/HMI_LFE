document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('preferencesForm');
    const saveBtn = document.getElementById('savePreferences');

    const questions = [
        {
            text: 'Quão familiarizado você está com sistemas de assistência ao motorista?',
            name: 'familiaridade'
        },
        {
            text: 'Qual é seu nível de experiência com tecnologia em veículos?',
            name: 'experiencia'
        },
        {
            text: 'Com que frequência você utiliza funções de automação?',
            name: 'frequencia'
        }
    ];

    questions.forEach(q => {
        const fieldset = document.createElement('fieldset');
        const legend = document.createElement('legend');
        legend.textContent = q.text;
        fieldset.appendChild(legend);

        for (let i = 1; i <= 5; i++) {
            const label = document.createElement('label');
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = q.name;
            radio.value = i;
            label.appendChild(radio);
            label.appendChild(document.createTextNode(' ' + i));
            fieldset.appendChild(label);
        }

        form.appendChild(fieldset);
    });


    saveBtn.addEventListener('click', async () => {
        let score = 0;
        questions.forEach(q => {
            const selected = form.querySelector(`input[name="${q.name}"]:checked`);
            if (selected) score += parseInt(selected.value, 10);
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
});