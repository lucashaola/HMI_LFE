const request = require('supertest');
const app = require('../server');

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