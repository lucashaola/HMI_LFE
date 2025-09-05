const test = require('node:test');
const assert = require('node:assert');
const { calculateTutorialVisibility } = require('../assistedDriving/public/assets/js/userProfile');

test('calculateTutorialVisibility filters categories by mean', () => {
  const prefs = {
    'Verkehrszeichenassistent': { practical: 2, theoretical: 2 },
    'Abstandsregeltempomat': { practical: 4, theoretical: 4 }
  };
  const visibility = calculateTutorialVisibility(prefs);
  assert.strictEqual(visibility.verkehrszeichen, true);
  assert.strictEqual(visibility.geschwindigkeit, false);
});