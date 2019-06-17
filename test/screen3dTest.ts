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
  it('rotates beacons according to the alignment property', () => {
    const screen = createScreen();

    // -1 is max alignment, so we expect to rotate the beacon by full rotation.
    expect(screen.sphereRotation(-1.0).y).toBeCloseTo(6.283);
    expect(screen.sphereRotation(-0.5).y).toBeCloseTo(Math.PI);
  });

  it('gives default beacon diameter for messages with no errors', () => {
    const screen = createScreen();
    const msg = exampleParsedMsg();
    msg.xr = 0;
    msg.yr = 0;
    msg.zr = 0;

    const res = screen.createSphere(5, msg);
    const boundingBox = res.getBoundingInfo().boundingBox.extendSize;

    // TODO: document why sphere with diameter of 5 has bounding box with width
    // 2.5
    expect(boundingBox.x).toBeCloseTo(2.5);
    expect(boundingBox.y).toBeCloseTo(2.5);
  });

  it('scales beacon width if the x axis error is significant', () => {
    const screen = createScreen();
    const msg = exampleParsedMsg();
    msg.xr = 1.0;
    msg.yr = 0.0;
    msg.zr = 0.0;

    const res = screen.createSphere(10, msg);

    const boundingBox = res.getBoundingInfo().boundingBox.extendSize;

    expect(boundingBox.x).toBeCloseTo(5.5);
  });

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
