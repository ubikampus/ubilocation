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

  test('successful register operation returns specified properties', async () => {
    const response = await api
      .post('/register')
      .send({ beaconId: 'My-Unique-BeaconId' })
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body.token).toBeDefined();
    expect(response.body.beaconId).toBeDefined();
    expect(response.body.nickname).toBeDefined();
  });
});
