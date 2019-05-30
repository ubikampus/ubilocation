import * as t from 'io-ts';
import { unsafeDecode } from './typeUtil';

const MqttMessageDecoder = t.type({
  /**
   * TODO: document what is beaconHash and how to use it.
   */
  beaconHash: t.string,

  x: t.number,
  y: t.number,
});

export type MqttMessage = t.TypeOf<typeof MqttMessageDecoder>;

/**
 * Convert raw mqtt message into static type, crash on unexpected input.
 */
export const deserializeMessage = (rawMessage: string): MqttMessage => {
  return unsafeDecode(MqttMessageDecoder, JSON.parse(rawMessage));
};
