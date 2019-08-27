import supertest from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../src/app';
import { appConfig } from '../src/validation';

const api = supertest(app);

describe('tests for the login router', () => {
  test('login successful with valid credentials', async () => {
    await api
      .post('/login')
      .send({ username: 'admin', password: '#Apollo11' })
      .expect('Content-Type', /json/)
      .expect(200);
  });

  test('login fails with invalid credentials', async () => {
    await api
      .post('/login')
      .send({ username: 'admin', password: 'InvalidPassword' })
      .expect(401)
      .expect('Content-Type', /json/);
  });

  test('login fails with same length password', async () => {
    await api
      .post('/login')
      .send({ username: 'admin', password: 'atmin' })
      .expect(401);
  });
});

describe('tests for the requireLogin middleware', () => {
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
