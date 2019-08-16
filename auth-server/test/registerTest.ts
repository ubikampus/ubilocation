import supertest from 'supertest';
import app from '../src/app';

const api = supertest(app);

describe('tests for the register router', () => {
  test('registering successful if beacon ID provided', async () => {
    await api
      .post('/register')
      .send({ beaconId: 'My-Unique-BeaconId' })
      .expect('Content-Type', /json/)
      .expect(200);
  });

  test('registerings fails if no beacon ID provided', async () => {
    await api
      .post('/register')
      .send({})
      .expect('Content-Type', /json/)
      .expect(400);
  });
});
