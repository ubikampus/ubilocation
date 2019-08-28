import ReservationListener from '../src/services/reservationListener';

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
    listener.addReservation('test', {
      startTime: new Date('2019-08-15T00:00Z'),
      endTime: new Date('2019-08-16T00:00Z'),
    });
    expect(listener.getReservations('test').length).toBe(1);
    listener.update();
    expect(listener.getReservations('test').length).toBe(0);
  });

  test('Adds a correctly formatted starting reservation', () => {
    const reservation = {
      currentId: '321',
      currentStartTime: +startTime,
      currentEndTime: +endTime,
    };

    const topic = 'rooms/test/reservations/starting';

    listener.listener(topic, JSON.stringify(reservation));
    expect(listener.getReservations('test').length).toBe(1);
    expect(listener.getReservations('test')[0]).toEqual({ startTime, endTime });
  });

  test('Adds correctly formatted ending reservation', () => {
    const endingReservation = {
      currentId: '321',
      currentStartTime: +new Date() - 1000,
      currentEndTime: +new Date(),
      nextId: '321',
      nextStartTime: +startTime,
      nextEndTime: +endTime,
    };

    const topic = 'rooms/test/reservations/ending';
    listener.listener(topic, JSON.stringify(endingReservation));
    expect(listener.getReservations('test').length).toBe(1);
    expect(listener.getReservations('test')[0]).toEqual({
      startTime,
      endTime,
    });
  });

  test('Marks room correctly as reserved', () => {
    listener.addReservation('test', {
      startTime,
      endTime,
    });

    listener.update();
    expect(listener.rooms.test.free).toBe(false);
  });

  test('Marks room correctly as free', () => {
    listener.addReservation('test', {
      startTime: new Date(+startTime + 3000),
      endTime,
    });

    listener.update();
    expect(listener.rooms.test.free).toBe(true);
  });

  test('Room with no reservations is free', () => {
    listener.addReservation('test', {
      startTime: new Date(+startTime - 3000),
      endTime: new Date(+startTime - 1000),
    });

    listener.update();
    expect(listener.getReservations('test').length).toBe(0);
    expect(listener.rooms.test.free).toBe(true);
  });
});
