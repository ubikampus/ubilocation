import supertest from 'supertest';
import ReservationListener from '../src/services/reservationListener';
import app from '../src/app';

const api = supertest(app);

let listener: ReservationListener;
let startTime: Date;
let endTime: Date;

describe('ReservationListener', () => {
  beforeEach(() => {
    startTime = new Date();
    endTime = new Date(+new Date() + 10_000);
    listener = new ReservationListener();
  });

  test('Filters correctly by date', () => {
    listener.reservations.test = [];
    listener.reservations.test.push({
      startTime: new Date('2019-08-15T00:00Z'),
      endTime: new Date('2019-08-16T00:00Z'),
    });
    expect(listener.reservations.test.length).toBe(1);
    listener.filter();
    expect(listener.reservations.test.length).toBe(0);
  });

  test('Adds a correctly formatted starting reservation', () => {
    const reservation = {
      currentId: '321',
      currentStartTime: +startTime,
      currentEndTime: +endTime,
    };
    const startingReservation = {
      payload: JSON.stringify(reservation),
    };
    const topic = 'rooms/test/reservations/starting';

    listener.listener(topic, JSON.stringify(startingReservation));
    expect(listener.reservations.test.length).toBe(1);
    expect(listener.reservations.test[0]).toEqual({ startTime, endTime });
  });

  test('Adds correctly formatted ending reservation', () => {
    const endingReservation = {
      payload: JSON.stringify({
        currentId: '321',
        currentStartTime: +new Date() - 1000,
        currentEndTime: +new Date(),
        nextId: '321',
        nextStartTime: +startTime,
        nextEndTime: +endTime,
      }),
    };

    const topic = 'rooms/test/reservations/ending';
    listener.listener(topic, JSON.stringify(endingReservation));
    expect(listener.reservations.test.length).toBe(1);
    expect(listener.reservations.test[0]).toEqual({
      startTime,
      endTime,
    });
  });
});
