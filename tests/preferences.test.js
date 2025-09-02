const path = require('path');

// Reset environment before each test
beforeEach(() => {
  localStorage.clear();
  document.body.innerHTML = '';
  jest.resetModules();
});

test('mandatory preferences are hidden but saved automatically', () => {
  // Set up DOM expected by preferences script
  document.body.innerHTML = '<form id="preferencesForm"></form><button id="savePreferences"></button>';

  // Prevent navigation in tests
  Object.defineProperty(window, 'location', {
    writable: true,
    value: { href: '' }
  });


  // Load dependencies
  require(path.join('..', 'assistedDriving/public/assets/js/categoryQuestions.js'));
  require(path.join('..', 'assistedDriving/public/assets/js/preferences.js'));

  // Trigger DOMContentLoaded
  document.dispatchEvent(new Event('DOMContentLoaded'));

  const mandatory = ['aktivierung', 'deaktivierung', 'risiken'];
  mandatory.forEach(key => {
    const checkbox = document.querySelector(`input[type="checkbox"][value="${key}"]`);
    expect(checkbox).toBeNull();
  });
  document.getElementById('savePreferences').click();

  const saved = JSON.parse(localStorage.getItem('preferences'));
  expect(saved).toEqual(mandatory);
});
