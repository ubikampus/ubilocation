import * as t from 'io-ts';
import { unsafeDecode } from './typeUtil';

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
  alignment: t.number,
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
export type BeaconLocation = t.TypeOf<typeof MessageLocationShared> & {
  xMeters: number;
  yMeters: number;
  zMeters: number;
};

export type MqttMessage = t.TypeOf<typeof MqttMessageDecoder>;

/**
 * Lets separate MQTT message in the API format, and our preferred format
 * clearly. This avoids confusion between units.
 */
export const mqttMessageToLocation = (message: MqttMessage): BeaconLocation => {
  return {
    ...message,
    xMeters: message.x / 1000,
    yMeters: message.z / 1000,
    zMeters: -message.y / 1000,
  };
};

type UrlParse =
  | { kind: 'success'; url: URL }
  | { kind: 'fail'; message: string };

export default class MqttParser {
  /**
   * Convert raw mqtt message into static type, crash on unexpected input.
   */
  deserializeMessage(rawMessage: string): BeaconLocation {
    return JSON.parse(rawMessage).map((obj: unknown) => {
      const message = unsafeDecode(MqttMessageDecoder, obj);
      return mqttMessageToLocation(message);
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
}

export const VizQueryDecoder = t.type({ host: t.string, topic: t.string });

export type VizQuery = t.TypeOf<typeof VizQueryDecoder>;
