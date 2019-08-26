import express, { Request, Response } from 'express';
import { DecodedToken } from '../middleware/requireLogin';
const publicRouter = express.Router();

interface PublicBeacon {
  beaconId: string;
  nickname: string;
}

let publicBeacons: PublicBeacon[] = [];

publicRouter.get('/', (request: Request, response: Response) => {
  response.status(200).send(publicBeacons);
});

publicRouter.get('/:beaconId', (request: Request, response: Response) => {
  // TODO: Do we need to URL decode the beacon ID?
  const beacon = find(request.params.beaconId);

  if (!beacon) {
    return response.status(404).json({ error: 'unknown beacon ID' });
  }

  return response.status(200).send(beacon);
});

publicRouter.post(
  '/',
  (request: Request & DecodedToken, response: Response) => {
    // All the information we need is stored in the token
    // The body of the POST request should be empty
    const beaconId = request.decodedToken.beaconId;
    const nickname = request.decodedToken.nickname;

    remove(beaconId);
    add(beaconId, nickname);

    response.status(200).send({});
  }
);

publicRouter.delete(
  '/:beaconId',
  (request: Request & DecodedToken, response: Response) => {
    const beaconId = request.decodedToken.beaconId;
    // TODO: Do we need to URL decode the beacon ID?
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

const add = (beaconId: string, nickname: string) => {
  publicBeacons.push({ beaconId, nickname });
};

const remove = (beaconId: string) => {
  publicBeacons = publicBeacons.filter(b => b.beaconId !== beaconId);
};

export default publicRouter;
