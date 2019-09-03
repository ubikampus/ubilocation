import { Router } from 'express';
import fs from 'fs';

import sign from '../services/signer';
import { asyncMiddleware } from '../middleware/asyncMiddleware';

const KEY_PATH = process.env.PRIVATE_KEY_PATH || 'pkey.pem';
const PKEY = fs.readFileSync(KEY_PATH);

const signRouter = Router();

signRouter.post(
  '/',
  asyncMiddleware(async (request, response) => {
    const message = request.body.message;
    const signed = await sign(PKEY, message);
    response.json(signed);
  })
);

export default signRouter;
