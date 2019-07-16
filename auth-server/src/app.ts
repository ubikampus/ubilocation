import express, { Request, Response } from 'express';
import sign from './signer';
import dotenv from 'dotenv';
import fs from 'fs';
const loginRouter = require('./controllers/login');

dotenv.config();

const app = express();
const KEY_PATH = process.env.KEY_PATH || 'pkey.pem';
const PKEY = fs.readFileSync(KEY_PATH);

app.use(express.json());
app.use('/login', loginRouter);

app.post('/sign', async (req, res) => {
  const message = req.body.message;
  const signed = await sign(PKEY, message);
  res.json(signed);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log('Listening at', PORT);
});
