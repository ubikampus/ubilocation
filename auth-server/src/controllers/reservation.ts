import { Router } from 'express';
import ReservationListener from '../services/reservationListener';

const listener = new ReservationListener();

const reservationRouter = Router();

reservationRouter.get('/', (_, response) => {
  listener.update();
  response.json(listener.rooms);
});

export default reservationRouter;
