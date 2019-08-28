import supertest from 'supertest';
import app from '../src/app';

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
