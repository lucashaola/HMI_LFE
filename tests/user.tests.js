const request = require('supertest');
const app = require('../assistedDriving/server');

describe('POST /api/users', () => {
  it('creates a user and returns profile data', async () => {
    const code = Date.now().toString();
    const response = await request(app)
      .post('/api/users')
      .send({ name: 'Test User', identificationCode: code });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        identification_code: code,
        name: 'Test User',
        total_bonusPoints_score: 0,
        assistance_kilometer: 0
      })
    );
  });
});
// Test storing and retrieving user preferences
describe('Preferences API', () => {
  it('stores and retrieves preferences for a user', async () => {
    const code = Date.now().toString();
    // create user
    await request(app)
      .post('/api/users')
      .send({ name: 'Pref Test User', identificationCode: code });

    const prefs = { theme: 'dark', layout: { sidebar: true } };
    const postRes = await request(app)
      .post(`/api/users/${code}/preferences`)
      .send({ preferences: prefs });

    expect(postRes.status).toBe(200);
    expect(postRes.body).toEqual({ success: true });

    const getRes = await request(app).get(`/api/users/${code}/preferences`);

    expect(getRes.status).toBe(200);
    expect(getRes.body).toEqual({ preferences: JSON.stringify(prefs) });
  });
});
