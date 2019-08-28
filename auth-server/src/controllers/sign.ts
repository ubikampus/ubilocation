import { Router } from 'express';
import sign from '../services/signer';
import fs from 'fs';

const KEY_PATH = process.env.PRIVATE_KEY_PATH || 'pkey.pem';
const PKEY = fs.readFileSync(KEY_PATH);

const signRouter = Router();

signRouter.get('/', async (request, response) => {
  const message = request.body.message;
  const signed = await sign(PKEY, message);
  response.json(signed);
});

export default signRouter;
