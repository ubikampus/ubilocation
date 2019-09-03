import jwt from 'jsonwebtoken';
import express, { Request, Response } from 'express';
import { appConfig } from '../validation';
import { asyncMiddleware } from '../middleware/asyncMiddleware';
const registerRouter = express.Router();

export interface Beacon {
  token: string;
  beaconId: string;
}

registerRouter.post(
  '/',
  asyncMiddleware(async (request: Request, response: Response) => {
    const body = request.body;
    const beaconId = body.beaconId;

    if (!beaconId || beaconId.length === 0) {
      return response.status(400).json({ error: 'beacon ID is missing' });
    }

    const tokenContents = { beaconId };
    const token = jwt.sign(tokenContents, appConfig.JWT_SECRET);

    response.status(200).send({ token, beaconId } as Beacon);
  })
);

export default registerRouter;
