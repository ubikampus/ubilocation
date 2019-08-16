import process from 'process';
import express from 'express';
import cors from 'cors';
import loginRouter from './controllers/login';
import reservationRouter from './controllers/reservation';
import signRouter from './controllers/sign';

if (process.env.TYPECHECK) {
  console.log('type check success!');
  process.exit(0);
}

const app = express();

app.use(cors());
app.use(express.json());
app.use('/login', loginRouter);
app.use('/reservations', reservationRouter);
app.use('/sign', signRouter);

const PORT = 3001;
app.listen(PORT, () => {
  console.log('Listening at', PORT);
});

export default app;
