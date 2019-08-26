import express from 'express';
import signRouter from './controllers/sign';
import reservationRouter from './controllers/reservation';
import cors from 'cors';
import loginRouter from './controllers/login';
import config from './controllers/config';
import requireLogin from './middleware/requireLogin';
import registerRouter from './controllers/register';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/login', loginRouter);
app.use('/reservations', reservationRouter);
app.use('/sign', signRouter);
app.use('/register', registerRouter);

app.use('/sign', requireLogin);
app.get('/config', config);

export default app;
