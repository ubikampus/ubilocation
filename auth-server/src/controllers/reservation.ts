import { Router } from 'express';
import ReservationListener from '../services/reservationListener';

const listener = new ReservationListener();

const reservationRouter = Router();

reservationRouter.get('/', (_, response) => {
  listener.filter();
  response.json(listener.reservations);
});

export default reservationRouter;
