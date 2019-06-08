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
  alignment: t.number,
});

export type MqttMessage = t.TypeOf<typeof MqttMessageDecoder>;

/**
 * Convert raw mqtt message into static type, crash on unexpected input.
 */
export const deserializeMessage = (rawMessage: string): MqttMessage => {
  return unsafeDecode(MqttMessageDecoder, JSON.parse(rawMessage));
};

type UrlParse =
  | { kind: 'success'; url: URL }
  | { kind: 'fail'; message: string };

export const parseMqttUrl = (rawUrl: string): UrlParse => {
  try {
    return { kind: 'success', url: new URL(rawUrl) };
  } catch (e) {
    console.log('failed to parse mqtt url', e.toString());

    const message = `unexpected input: "${rawUrl}": ${e}`;
    return { kind: 'fail', message };
  }
};

export const VizQueryDecoder = t.type({ host: t.string, topic: t.string });

export type VizQuery = t.TypeOf<typeof VizQueryDecoder>;
