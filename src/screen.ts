import * as PIXI from 'pixi.js';
import bluetoothIcon from '../asset/blue_bt.png';
import backgroundMap from '../asset/kumpula_kerroskartat_2015_1.png';

export const drawScreen = () => {
  const app = new PIXI.Application({ backgroundColor: 0xffffff });
  const loader = PIXI.Loader.shared;

  loader.add('bluetoothIcon', bluetoothIcon);
  loader.add('backgroundMap', backgroundMap);

  console.log('loading sprites...');
  loader.load((_: any, resources: any) => {
    console.log('drawing base graphics...');
    const map = new PIXI.Sprite(resources.backgroundMap.texture);
    map.scale.x = 0.75;
    map.scale.y = 0.75;

    const btIcon = new PIXI.Sprite(resources.bluetoothIcon.texture);
    btIcon.zOrder += 1;
    btIcon.scale.x = 0.1;
    btIcon.scale.y = 0.1;

    btIcon.position.x = 475;
    btIcon.position.y = 250;

    app.stage.addChild(map);
    app.stage.addChild(btIcon);
    document.body.appendChild(app.view);
  });
};
