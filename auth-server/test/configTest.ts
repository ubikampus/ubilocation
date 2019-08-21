import app from '../src/app';
import supertest = require('supertest');

const api = supertest(app);

describe('/config', () => {
  it('returns min zoom level as 9 by default', async () => {
    const res = await api
      .get('/config')
      .expect(200)
      .expect('Content-Type', /json/);

    expect(res.body.MINIMUM_ZOOM).toBe(9);
  });

  it('has MQTT_URL in client config response', async () => {
    const res = await api.get('/config');

    expect(res.body.MQTT_URL.length).toBeGreaterThan(3);
  });
});
