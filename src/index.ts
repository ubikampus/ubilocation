import { drawScreen } from './screen';

const MQTT_BUS_URL = 'mqtt://localhost:1883';

const onMessage = (msg: string) => {
  console.log('received message', msg);
};

const main = () => {
  drawScreen();
};

main();
