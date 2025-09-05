const test = require('node:test');
const assert = require('node:assert');
const app = require('../assistedDriving/server');

function startServer() {
  return new Promise(resolve => {
    const server = app.listen(0, '127.0.0.1', () => resolve(server));
  });
}

test('POST /api/users creates a user and returns profile data', async () => {
  const server = await startServer();
  const port = server.address().port;
  try {
    const code = Date.now().toString();
    const res = await fetch(`http://127.0.0.1:${port}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test User', identificationCode: code })
    });
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.deepStrictEqual(body, {
      identification_code: code,
      name: 'Test User',
      preferences: [],
      total_bonusPoints_score: 0,
      assistance_kilometer: 0
    });
  } finally {
    server.close();
  }
});

test('stores and retrieves preferences for a user', async () => {
  const server = await startServer();
  const port = server.address().port;
  try {
    const code = Date.now().toString();
    await fetch(`http://127.0.0.1:${port}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Pref Test User', identificationCode: code })
    });

    const prefs = { theme: 'dark', layout: { sidebar: true } };
    const postRes = await fetch(`http://127.0.0.1:${port}/api/users/${code}/preferences`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ preferences: prefs })
    });
    assert.strictEqual(postRes.status, 200);
    const postBody = await postRes.json();
    assert.deepStrictEqual(postBody, { success: true });

    const getRes = await fetch(`http://127.0.0.1:${port}/api/users/${code}/preferences`);
    assert.strictEqual(getRes.status, 200);
    const getBody = await getRes.json();
    assert.deepStrictEqual(getBody, { preferences: JSON.stringify(prefs) });
  } finally {
    server.close();
  }
});