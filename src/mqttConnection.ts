import { default as UbiMqtt } from 'ubimqtt';
import { MqttMessage, deserializeMessage } from './mqttDeserialize';

const MOCK_MESSAGE_INTERVAL = 2000;

export const startMessageMocker = (
  beaconId: string,
  onMessage: (a: MqttMessage) => void,
  interval = MOCK_MESSAGE_INTERVAL
): NodeJS.Timeout => {
  return setInterval(() => {
    // TODO: set 3d model maximum length as possible upper limit
    const x = Math.floor((Math.random() * 1024) / 2);
    const y = Math.floor((Math.random() * 768) / 2);

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
