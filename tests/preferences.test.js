const path = require('path');

// Reset environment before each test
beforeEach(() => {
  localStorage.clear();
  document.body.innerHTML = '';
  jest.resetModules();
});

test('mandatory preferences are checked and disabled', () => {
  // Set up DOM expected by preferences script
  document.body.innerHTML = '<form id="preferencesForm"></form><button id="savePreferences"></button>';

  // Load dependencies
  require(path.join('..', 'assistedDriving/public/assets/js/categoryQuestions.js'));
  require(path.join('..', 'assistedDriving/public/assets/js/preferences.js'));

  // Trigger DOMContentLoaded
  document.dispatchEvent(new Event('DOMContentLoaded'));

  const mandatory = ['aktivierung', 'deaktivierung', 'risiken'];
  mandatory.forEach(key => {
    const checkbox = document.querySelector(`input[type="checkbox"][value="${key}"]`);
    expect(checkbox).not.toBeNull();
    expect(checkbox.checked).toBe(true);
    expect(checkbox.disabled).toBe(true);
  });
});
