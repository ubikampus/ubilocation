import { Router } from 'express';
import MqttService from '../services/mqtt';

const url = process.env.MQTT_URL || 'mqtt://localhost';
const topic = process.env.RESERVATION_TOPIC || 'temp';

interface Reservation {
  startTime: Date;
  endTime: Date;
}

interface Reservations {
  [room: string]: Reservation[];
}

let reservations: Reservations = {};

const listener = (_: string, message: string) => {
  const newReservations: Reservations = {};
  const now = new Date();
  for (const item of Object.entries(reservations)) {
    const filtered = item[1].filter(i => i.endTime > now);
    newReservations[item[0]] = filtered;
  }

  reservations = newReservations;
  try {
    const parsed = JSON.parse(message);

    if (!reservations[parsed.nextId]) {
      reservations[parsed.nextId] = [];
    }

    reservations[parsed.nextId].push({
      startTime: parsed.nextStartTime,
      endTime: parsed.nextEndTime,
    });
  } catch (err) {
    console.error(err);
  }
};

new MqttService().connect(url).then(s => s.subscribe(topic, listener));

const reservationRouter = Router();

reservationRouter.get('/', (_, response) => {
  response.json(reservations);
});

export default reservationRouter;
