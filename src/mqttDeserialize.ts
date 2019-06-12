import * as t from 'io-ts';
import { unsafeDecode } from './typeUtil';

const MqttMessageDecoder = t.type({
  /**
   * TODO: document what is beaconId and how to use it.
   */
  beaconId: t.string,

  x: t.number,
  y: t.number,
  z: t.number,

  xr: t.number,
  yr: t.number,
  zr: t.number,

  /**
   * Should be from -1 to 0;
   */
  alignment: t.number,
});

export type MqttMessage = t.TypeOf<typeof MqttMessageDecoder>;

type UrlParse =
  | { kind: 'success'; url: URL }
  | { kind: 'fail'; message: string };

export default class MqttParser {
  /**
   * Convert raw mqtt message into static type, crash on unexpected input.
   */
  deserializeMessage(rawMessage: string): MqttMessage {
    return unsafeDecode(MqttMessageDecoder, JSON.parse(rawMessage));
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
