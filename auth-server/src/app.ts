import process from 'process';
import express, { Request, Response } from 'express';
import sign from './signer';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

if (process.env.TYPECHECK) {
  console.log('exiting early for type checking purposes...');
  process.exit(0);
}

const app = express();
const KEY_PATH = process.env.KEY_PATH || 'pkey.pem';
const PKEY = fs.readFileSync(KEY_PATH);

app.use(express.json());

app.post('/sign', async (req, res) => {
  const message = req.body.message;
  const signed = await sign(PKEY, message);
  res.json(signed);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log('Listening at', PORT);
});
