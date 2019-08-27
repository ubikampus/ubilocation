import express, { Request, Response } from 'express';
import { DecodedToken } from '../middleware/requireLogin';
const hri = require('human-readable-ids').hri;
const publicRouter = express.Router();

interface PublicBeacon {
  beaconId: string;
  nickname: string;
}

let publicBeacons: PublicBeacon[] = [];

const generateNickname = () => {
  return hri.random();
};

publicRouter.get('/', (request: Request, response: Response) => {
  response.status(200).send(publicBeacons);
});

publicRouter.post(
  '/',
  (request: Request & DecodedToken, response: Response) => {
    // Beacon ID is stored in the token
    // The body of the POST request should be empty
    const beaconId = request.decodedToken.beaconId;

    const nickname = generateNickname();
    const pubBeacon = { beaconId, nickname };

    remove(beaconId);
    add(pubBeacon);

    response.status(200).send(pubBeacon);
  }
);

publicRouter.delete(
  '/:beaconId',
  (request: Request & DecodedToken, response: Response) => {
    // Note: Express seems to decode URL encoded request.params automatically
    const beaconId = request.decodedToken.beaconId;
    const beacon = find(request.params.beaconId);

    if (!beacon) {
      return response.status(404).json({ error: 'unknown beacon ID' });
    }

    if (!beacon.beaconId === beaconId) {
      return response.status(403).json({ error: 'access forbidden' });
    }

    remove(beaconId);
    response.status(200).send({});
  }
);

const find = (beaconId: string) => {
  return publicBeacons.find(b => b.beaconId === beaconId);
};

const add = (pubBeacon: PublicBeacon) => {
  publicBeacons.push(pubBeacon);
};

const remove = (beaconId: string) => {
  publicBeacons = publicBeacons.filter(b => b.beaconId !== beaconId);
};

export default publicRouter;
