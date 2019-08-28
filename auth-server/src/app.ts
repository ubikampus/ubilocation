import process from 'process';
import express from 'express';
import sign from './signer';
import fs from 'fs';
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
const KEY_PATH = process.env.KEY_PATH || 'pkey.pem';
const PKEY = fs.readFileSync(KEY_PATH);

app.use(cors());
app.use(express.json());
app.use('/login', loginRouter);
app.use('/register', registerRouter);

app.post('/public', requireBeaconToken);
app.delete('/public/:beaconId', requireBeaconToken);
app.use('/public', publicRouter);

app.use('/sign', requireAdminToken);

app.post('/sign', async (req, res) => {
  const message = req.body.message;
  const signed = await sign(PKEY, message);
  res.json(signed);
});
app.get('/config', config);

export default app;
