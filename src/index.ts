import { deserializeMessage, MqttMessage } from './mqttDeserialize';
import { drawScreen } from './screen';
import { addBeacon, drawScreen3d, setPosition } from './screen3d';

const MQTT_BUS_URL = 'mqtt://localhost:9001';

const generateMockMessage = (beaconHash: string): string => {
  const x = Math.floor((Math.random() * 1024) / 2);
  const y = Math.floor((Math.random() * 768) / 2);
  return JSON.stringify({ beaconHash, x, y });
};

const main = () => {
  const scene = drawScreen3d();
  const beacon = addBeacon(scene, 'beacon-1');
  setInterval(() => {
    try {
      const messageStr = generateMockMessage('beacon-1');
      const message = deserializeMessage(messageStr);
      console.log('received:', messageStr);

      setPosition(beacon, message.x, message.y);
    } catch (error) {
      console.error('Error:', error);
    }
  }, 2000);
};

main();
