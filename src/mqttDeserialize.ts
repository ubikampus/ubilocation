export interface MqttMessage {
  /**
   * TODO: document what is beaconHash and how to use it.
   */
  beaconHash: string;
  x: number;
  y: number;
}

/**
 * TODO: validate input?
 */
export const deserializeMessage = (rawMessage: string) => {
  return JSON.parse(rawMessage) as MqttMessage;
};
