import * as t from 'io-ts';
import queryStringParser from 'query-string';
import { unsafeDecode } from '../common/typeUtil';
import destination from '@turf/destination';

const LIBRARY_BEARING = 42.5;
const LIBRARY_ORIGO = {
  lat: 60.205325,
  lon: 24.962115,
};

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

/**
 * We want to have the coordinates in meters, because babylon uses meters
 * everywhere.
 */
export type BabylonBeacon = t.TypeOf<typeof MessageLocationShared> & {
  xMeters: number;
  yMeters: number;
  zMeters: number;
};

export type MqttMessage = t.TypeOf<typeof MqttMessageDecoder>;

/**
 * Convert untouched mqtt message into babylon-friendly format. Babylon uses
 * meters as coordinate units.
 */
export const mqttMessageToBabylon = (message: MqttMessage): BabylonBeacon => {
  return {
    ...message,
    xMeters: message.x / 1000,
    yMeters: message.z / 1000,
    zMeters: -message.y / 1000,
  };
};

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
    [LIBRARY_ORIGO.lon, LIBRARY_ORIGO.lat],
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

type UrlParse =
  | { kind: 'success'; url: URL }
  | { kind: 'fail'; message: string };

/**
 * The purpose of Deserializer is to provide strict conversion from strings into
 * static types, so that errors in types are immediately caught.
 */
export default class Deserializer {
  /**
   * Convert raw mqtt message into static type, crash on unexpected input.
   */
  deserializeMessage(rawMessage: string): BabylonBeacon[] {
    return JSON.parse(rawMessage).map((obj: unknown) => {
      const message = unsafeDecode(MqttMessageDecoder, obj);
      return mqttMessageToBabylon(message);
    });
  }

  parseMqttUrl(rawUrl: string): UrlParse {
    try {
      return { kind: 'success', url: new URL(rawUrl) };
    } catch (e) {
      console.log('failed to parse mqtt url', e.toString());

      const message = `unexpected input: "${rawUrl}": ${e}`;
      return { kind: 'fail', message };
    }
  }

  /**
   * Parse query string into regular javascript object.
   *
   * @param type Decoder for the deserialized object
   * @param queryString see https://en.wikipedia.org/wiki/Query_string
   */
  parseQuery<A>(type: t.Decoder<unknown, A>, queryString: string) {
    const parsed = queryStringParser.parse(queryString, {
      parseNumbers: true,
    });

    return unsafeDecode<A>(type, parsed);
  }
}

export const MapLocationQueryDecoder = t.type({
  lat: t.number,
  lon: t.number,
});

export const VizQueryDecoder = t.type({ host: t.string, topic: t.string });

export type VizQuery = t.TypeOf<typeof VizQueryDecoder>;
