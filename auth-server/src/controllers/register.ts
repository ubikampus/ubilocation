import jwt from 'jsonwebtoken';
import express, { Request, Response } from 'express';
const registerRouter = express.Router();

export interface Beacon {
  token: string;
  beaconId: string;
}

if (!process.env.SECRET) {
  throw new Error('SECRET env variable cannot be empty');
}

const { SECRET } = process.env;

registerRouter.post('/', (request: Request, response: Response) => {
  const body = request.body;
  const beaconId = body.beaconId;

  if (!beaconId || beaconId.length === 0) {
    return response.status(400).json({ error: 'beacon ID is missing' });
  }

  const tokenContents = { beaconId };
  const token = jwt.sign(tokenContents, SECRET);

  response.status(200).send({ token, beaconId } as Beacon);
});

export default registerRouter;
