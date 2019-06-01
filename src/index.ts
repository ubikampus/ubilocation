import { deserializeMessage, MqttMessage } from './mqttDeserialize';
import Screen3D from './screen3d';

const MQTT_BUS_URL = 'mqtt://localhost:9001';

const generateMockMessage = (beaconHash: string): string => {
  const x = Math.floor((Math.random() * 2083) / 2);
  const y = Math.floor((Math.random() * 1562) / 2);
  return JSON.stringify({ beaconHash, x, y });
};

const main = () => {
  const screen = new Screen3D(document.createElement('canvas'));

  const beacon = screen.addBeacon('beacon-1');
  setInterval(() => {
    try {
      const messageStr = generateMockMessage('beacon-1');
      const message = deserializeMessage(messageStr);
      console.log('received:', messageStr);

      screen.setPosition(beacon, message.x, message.y);
    } catch (error) {
      console.error('Error:', error);
    }
  }, 2000);
};

main();
