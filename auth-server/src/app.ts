import express from 'express';
import signRouter from './controllers/sign';
import reservationRouter from './controllers/reservation';
import cors from 'cors';
import {
  requireAdminToken,
  requireBeaconToken,
} from './middleware/requireLogin';
import loginRouter from './controllers/login';
import config from './controllers/config';
import registerRouter from './controllers/register';
import publicRouter from './controllers/public';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/login', loginRouter);
app.use('/reservations', reservationRouter);
app.use('/sign', requireAdminToken);
app.use('/sign', signRouter);
app.use('/register', registerRouter);

app.post('/public', requireBeaconToken);
app.delete('/public/:beaconId', requireBeaconToken);
app.use('/public', publicRouter);


app.get('/config', config);

export default app;
