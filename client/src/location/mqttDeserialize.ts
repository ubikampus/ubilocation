import * as t from 'io-ts';
import destination from '@turf/destination';
import distance from '@turf/distance';
import nearestPointOnLine from '@turf/nearest-point-on-line';
import { lineString } from '@turf/helpers';

import { unsafeDecode, Location } from '../common/typeUtil';

const LIBRARY_NORTH = [24.962112, 60.205323];
const LIBRARY_WEST = [24.961545, 60.205045];
const LIBRARY_EAST = [24.962691, 60.20503];

const LIBRARY_BEARING = 42.5;

/**
 * Represents shared properties between received MQTT location message, and
 * parsed beacon location in our preferred format.
 */
const MessageLocationShared = t.type({
  /**
   * TODO: document what is beaconId and how to use it.
   */
  beaconId: t.string,

  /**
   * Range is from 0.0 to 1.0
   */
  xr: t.number,
  yr: t.number,
  zr: t.number,

  /**
   * Should be from -1.0 to 1.0;
   */
  alignment: t.union([t.undefined, t.number]),
});

/**
 * Raw MQTT message from the location topic. Used for type safe decoding of the
 * json value.
 */
export const MqttMessageDecoder = t.intersection([
  MessageLocationShared,
  t.type({
    x: t.number,
    y: t.number,
    z: t.number,
  }),
]);

export type MqttMessage = t.TypeOf<typeof MqttMessageDecoder>;

export type BeaconGeoLocation = t.TypeOf<typeof MessageLocationShared> & {
  lat: number;
  lon: number;
  height: number;
};

/**
 * Convert the location server message into geographic coordinates so that
 * mapbox can use them.
 */
export const mqttMessageToGeo = (message: MqttMessage): BeaconGeoLocation => {
  const firstAxis = destination(
    LIBRARY_NORTH,
    message.y / 1000,
    -90 - LIBRARY_BEARING,
    { units: 'metres' }
  );

  if (firstAxis.geometry === null) {
    throw new Error('invalid coords: ' + message);
  }

  const finalCoords = destination(
    [firstAxis.geometry.coordinates[0], firstAxis.geometry.coordinates[1]],
    message.x / 1000,
    180 - LIBRARY_BEARING,
    { units: 'metres' }
  );

  if (finalCoords.geometry === null) {
    throw new Error('invalid coords: ' + message);
  }

  return {
    ...message,
    lat: finalCoords.geometry.coordinates[1],
    lon: finalCoords.geometry.coordinates[0],
    height: message.z,
  };
};

export const geoCoordsToPlaneCoords = (
  coords: Location,
  heightMillis: number
) => {
  const turfCoord = [coords.lon, coords.lat];

  const northWestWall = lineString([LIBRARY_NORTH, LIBRARY_WEST]);
  const northEastWall = lineString([LIBRARY_NORTH, LIBRARY_EAST]);
  const northWestPoint = nearestPointOnLine(northWestWall, turfCoord);

  const northEastPoint = nearestPointOnLine(northEastWall, turfCoord);

  const y = distance(northEastPoint, turfCoord, { units: 'meters' }) * 1000;
  const x = distance(northWestPoint, turfCoord, { units: 'meters' }) * 1000;

  return { x, y, z: heightMillis };
};

/**
 * The purpose of Deserializer is to provide strict conversion from strings into
 * static types, so that errors in types are immediately caught.
 */
export default class Deserializer {
  /**
   * Convert raw mqtt message into static type, crash on unexpected input.
   *
   * Sometimes server returns invalid JSON with "NaN" values, null is returned
   * then.
   */
  deserializeMessage(rawMessage: string): MqttMessage[] | null {
    let parsed;
    try {
      parsed = JSON.parse(rawMessage);
    } catch (err) {
      console.log('received invalid JSON from location server');
      return null;
    }

    return unsafeDecode(t.array(MqttMessageDecoder), parsed);
  }
}
