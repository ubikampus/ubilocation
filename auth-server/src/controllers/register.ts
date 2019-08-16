import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import express from 'express';
const registerRouter = express.Router();

export interface Beacon {
  token: string;
}

if (!process.env.SECRET) {
  throw new Error('SECRET env variable cannot be empty');
}

const { SECRET } = process.env;

registerRouter.post('/', (request: Request, response: Response) => {
  const body = request.body;

  if (!body.beaconId) {
    return response.status(400).json({ error: 'beacon ID is missing' });
  }

  const tokenContents = {
    beaconId: body.beaconId,
  };

  const token = jwt.sign(tokenContents, SECRET);

  response.status(200).send({ token } as Beacon);
});

export default registerRouter;
