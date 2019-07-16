const supertest = require('supertest');
const app = require('../src/app');

const api = supertest(app);

test('login successful with valid credentials', async () => {
  await api
    .post('/login')
    .send({ username: 'admin', password: 'July1969#Apollo11' })
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
