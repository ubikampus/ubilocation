const MQTT_BUS_URL = 'mqtt://localhost:1883';

import { connectUbiTopic } from './mqttConnection';

const onMessage = (msg: string) => {
  console.log('received message', msg);
};

const main = () => {
  connectUbiTopic(MQTT_BUS_URL, 'ohtu/test', onMessage);
};

main();
