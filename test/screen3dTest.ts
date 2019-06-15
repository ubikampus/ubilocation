import Screen3D from '../src/screen3d';
import { exampleMessage } from './mqttDeserializeTest';
import MqttParser from '../src/mqttDeserialize';

const exampleParsedMsg = () => {
  return new MqttParser().deserializeMessage(exampleMessage());
};

const createScreen = () => {
  const canvas = document.createElement('canvas');
  const screen = new Screen3D(canvas);
  return screen;
};

describe('Babylon.JS 3D graphics', () => {
  it('assigns label for created beacons', () => {
    const screen = createScreen();
    screen.updateBeacons([exampleParsedMsg()]);
    const controls = screen.labelTexture.getChildren();
    const labelControl = controls[0].children[0];

    expect(controls.length).toBe(1);

    // the actual label name is "undefined"...
    expect((labelControl as any)._text).toBe('undefined');
  });

  /**
   * NOTE: verifying that the beacon is moved into some *exact* position does
   * not really make sense, as we can't know the accurate correct coordinates
   * without looking at the map.
   */
  it('repositions beacon to a new location', () => {
    const screen = createScreen();

    screen.updateBeacons([exampleParsedMsg()]);

    const beacon = screen.scene.meshes[0];

    expect(beacon.position.x).not.toBeCloseTo(0);
    expect(beacon.position.y).not.toBeCloseTo(0);
  });
});
