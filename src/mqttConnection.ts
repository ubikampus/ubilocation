import { default as UbiMqtt } from 'ubimqtt';
import { MqttMessage, deserializeMessage } from './mqttDeserialize';

const MOCK_MESSAGE_INTERVAL = 2000;

export const startMessageMocker = (
  beaconId: string,
  onMessage: (a: MqttMessage) => void,
  interval = MOCK_MESSAGE_INTERVAL
): NodeJS.Timeout => {
  return setInterval(() => {
    // Pick a random position in the 2nd floor Ubikampus space
    const x = 42 * Math.random();
    const y = 7.25 + 20 * Math.random();

    const messageStr = JSON.stringify({
      beaconId,
      x,
      y,
      z: 0,

      // TODO: generate error values in with Math.random
      xr: 0.5,
      yr: 0.9,
      zr: 0.2,
      alignment: 123,
    });
    const message = deserializeMessage(messageStr);
    onMessage(message);
  }, interval);
};
