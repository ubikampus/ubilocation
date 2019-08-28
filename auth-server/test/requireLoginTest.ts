import supertest from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../src/app';
import { appConfig } from '../src/validation';

const api = supertest(app);

describe('tests for the requireAdminToken middleware', () => {
  test('access denied if token missing', async () => {
    await api
      .post('/sign')
      .expect('Content-Type', /json/)
      .expect(401);
  });

  test('access denied if token invalid', async () => {
    await api
      .post('/sign')
      .set('Authorization', 'Bearer invalidToken')
      .expect('Content-Type', /json/)
      .expect(401);
  });

  test('access denied if token contains no username', async () => {
    const payload = {};
    const token = jwt.sign(payload, appConfig.JWT_SECRET);

    await api
      .post('/sign')
      .set('Authorization', 'Bearer ' + token)
      .expect('Content-Type', /json/)
      .expect(401);
  });

  test('access denied if username not admin', async () => {
    const payload = { username: 'notAdmin' };
    const token = jwt.sign(payload, appConfig.JWT_SECRET);

    await api
      .post('/sign')
      .set('Authorization', 'Bearer ' + token)
      .expect('Content-Type', /json/)
      .expect(401);
  });
});

describe('tests for the requireBeaconToken middleware', () => {
  test('access denied if token missing', async () => {
    await api
      .post('/public')
      .expect('Content-Type', /json/)
      .expect(401);
  });

  test('access denied if token invalid', async () => {
    await api
      .post('/public')
      .set('Authorization', 'Bearer invalidToken')
      .expect('Content-Type', /json/)
      .expect(401);
  });

  test('access denied if token contains no beaconId', async () => {
    const payload = {};
    const token = jwt.sign(payload, appConfig.JWT_SECRET);

    await api
      .post('/public')
      .set('Authorization', 'Bearer ' + token)
      .expect('Content-Type', /json/)
      .expect(401);
  });

  test('access denied if token contains an empty beaconId', async () => {
    const payload = { beaconId: '' };
    const token = jwt.sign(payload, appConfig.JWT_SECRET);

    await api
      .post('/public')
      .set('Authorization', 'Bearer ' + token)
      .expect('Content-Type', /json/)
      .expect(401);
  });
});
