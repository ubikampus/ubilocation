import { Router } from 'express';
import MqttService from '../services/mqtt';

const reservations: Reservation[] = [];
const url = process.env.MQTT_URL || 'mqtt://localhost';
const topic = process.env.RESERVATION_TOPIC || 'temp';

interface Reservation {
  room: string;
  time: string;
}

const listener = (_: string, message: string) => {
  try {
    const parsed: Reservation = JSON.parse(message);
    reservations.push(parsed)
    console.log(reservations);
  } catch (err) {
    console.error(err);
  }
};

new MqttService().connect(url).then(s => s.subscribe(topic, listener));

const reservationRouter = Router();

reservationRouter.get('/', (request, response) => {
  console.log(reservations);
  response.json(reservations);
});

export default reservationRouter;
