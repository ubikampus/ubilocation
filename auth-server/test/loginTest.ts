import supertest from 'supertest';
import app from '../src/app';

const api = supertest(app);

test('login successful with valid credentials', async () => {
  await api
    .post('/login')
    .send({ username: 'admin', password: '#Apollo11-July1969' })
    .expect('Content-Type', /json/)
    .expect(200);
});

test('login fails with invalid credentials', async () => {
  await api
    .post('/login')
    .send({ username: 'admin', password: 'InvalidPassword' })
    .expect('Content-Type', /json/)
    .expect(401);
});
