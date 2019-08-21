import jwt from 'jsonwebtoken';
import express, { Request, Response } from 'express';
const hri = require('human-readable-ids').hri;
const registerRouter = express.Router();

export interface Beacon {
  token: string;
  beaconId: string;
  nickname: string;
}

if (!process.env.SECRET) {
  throw new Error('SECRET env variable cannot be empty');
}

const { SECRET } = process.env;

const generateNickname = () => {
  return hri.random();
};

registerRouter.post('/', (request: Request, response: Response) => {
  const body = request.body;
  const beaconId = body.beaconId;

  if (!beaconId) {
    return response.status(400).json({ error: 'beacon ID is missing' });
  }

  const nickname = generateNickname();

  const tokenContents = { beaconId, nickname };
  const token = jwt.sign(tokenContents, SECRET);

  response.status(200).send({ token, beaconId, nickname } as Beacon);
});

export default registerRouter;
