import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import express from 'express';
import { appConfig } from '../validation';
const registerRouter = express.Router();

export interface Beacon {
  token: string;
  beaconId: string;
}

registerRouter.post('/', (request: Request, response: Response) => {
  const body = request.body;

  if (!body.beaconId) {
    return response.status(400).json({ error: 'beacon ID is missing' });
  }

  const tokenContents = {
    beaconId: body.beaconId,
  };

  const token = jwt.sign(tokenContents, appConfig.JWT_SECRET);

  response.status(200).send({ token, beaconId: body.beaconId } as Beacon);
});

export default registerRouter;
