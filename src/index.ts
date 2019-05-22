const MQTT_BUS_URL = 'mqtt://localhost:1883';

import { drawScreen } from './screen';

const onMessage = (msg: string) => {
  console.log('received message', msg);
};

const main = () => {
  drawScreen();
};

main();
