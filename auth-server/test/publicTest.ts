import supertest from 'supertest';
import app from '../src/app';
import { Beacon } from '../src/controllers/register';

const api = supertest(app);

/**
 * NOTE: The state of auth-server is not cleared in-between tests.
 * Hence, different tests may share some state on auth-server.
 * For instance, if test A makes beacons 1 and 2 public, then
 * test B may see two public beacons, even if B has not made any
 * beacons public itself. The tests have been structured so that
 * this shouldn't be too much of a problem.
 */

describe('tests for the public router', () => {
  test('initially all beacons are private', async () => {
    const response = await api
      .get('/public')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body.length).toBe(0);
  });

  test('can make a beacon public', async () => {
    const beacon = await register('beacon-1');

    const response = await api
      .post('/public')
      .set('Authorization', 'Bearer ' + beacon.token)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body.beaconId).toBe('beacon-1');
  });

  test('returns a list of public beacons', async () => {
    const beacon1 = await register('beacon-1');
    const beacon2 = await register('beacon-2');

    // Make beacon-1 public
    await api
      .post('/public')
      .set('Authorization', 'Bearer ' + beacon1.token)
      .expect('Content-Type', /json/)
      .expect(200);

    // Make beacon-2 public
    await api
      .post('/public')
      .set('Authorization', 'Bearer ' + beacon2.token)
      .expect('Content-Type', /json/)
      .expect(200);

    // Fetch a list of public beacons
    const response = await api
      .get('/public')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body.length).toBe(2);
    expect(response.body[0].beaconId).toBe('beacon-1');
    expect(response.body[1].beaconId).toBe('beacon-2');
  });

  test('can unpublish (make a beacon private)', async () => {
    const beacon1 = await register('beacon-1');
    const beacon2 = await register('beacon-2');

    // Make beacon-1 public
    await api
      .post('/public')
      .set('Authorization', 'Bearer ' + beacon1.token)
      .expect('Content-Type', /json/)
      .expect(200);

    // Make beacon-2 public
    await api
      .post('/public')
      .set('Authorization', 'Bearer ' + beacon2.token)
      .expect('Content-Type', /json/)
      .expect(200);

    // Make beacon-1 private again
    await api
      .delete('/public/beacon-1')
      .set('Authorization', 'Bearer ' + beacon1.token)
      .expect('Content-Type', /json/)
      .expect(200);

    // Fetch a list of public beacons
    const response = await api
      .get('/public')
      .expect('Content-Type', /json/)
      .expect(200);

    // At this point, only beacon-2 should be public
    expect(response.body.length).toBe(1);
    expect(response.body[0].beaconId).toBe('beacon-2');
  });

  test('cannot unpublish without proper authorization', async () => {
    const beacon1 = await register('beacon-1');
    const beacon2 = await register('beacon-2');

    // Make beacon-1 public
    await api
      .post('/public')
      .set('Authorization', 'Bearer ' + beacon1.token)
      .expect('Content-Type', /json/)
      .expect(200);

    // Try to make beacon-1 private again, but use the token from beacon-2
    // This should fail
    await api
      .delete('/public/beacon-1')
      .set('Authorization', 'Bearer ' + beacon2.token)
      .expect('Content-Type', /json/)
      .expect(403);
  });
});

const register = async (beaconId: string): Promise<Beacon> => {
  const response = await api
    .post('/register')
    .send({ beaconId })
    .expect('Content-Type', /json/)
    .expect(200);

  return response.body;
};
