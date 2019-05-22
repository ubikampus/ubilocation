import { drawScreen } from './screen';

const MQTT_BUS_URL = 'mqtt://localhost:1883';

// const onMessage = (msg: string) => {
//   console.log('received message', msg);
// };

const generateMockMessage = () => {
  console.error(Math.floor(Math.random() * 10));
};

const main = () => {
  // drawScreen();
  drawScreen(sprite => {
    setInterval(() => {
      const randX = Math.floor(Math.random() * 1024/2);
      sprite.position.x = randX;
    }, 1000);
  });
};

main();
