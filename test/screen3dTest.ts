import * as BABYLON from 'babylonjs';
import Screen3D from '../src/screen3d';

const createScreen = () => {
  const canvas = document.createElement('canvas');
  const screen = new Screen3D(canvas, new BABYLON.NullEngine());
  return screen;
};

describe('Babylon.JS 3D graphics', () => {
  it('raises sphere above ground level', () => {
    const screen = createScreen();

    const sphere = screen.createSphere(0.5);
    expect(sphere.position.y).toBeCloseTo(0.25);
  });

  it('assigns label for created beacons', () => {
    const screen = createScreen();

    screen.addBeacon('moi');
    const controls = screen.labelTexture.getChildren() as any;

    expect(controls.length).toBe(1);
    expect(controls[0].children[0]._text).toBe('moi');
  });

  /**
   * NOTE: verifying that the beacon is moved into some *exact* position does
   * not really make sense, as we can't know the accurate correct coordinates
   * without looking at the map.
   */
  it('repositions beacon to a new location', () => {
    const screen = createScreen();

    const beacon = screen.addBeacon('moi');
    expect(beacon.position.x).toBeCloseTo(0);

    screen.setPosition(beacon, 2000, 3000);

    expect(beacon.position.x).not.toBeCloseTo(0);
    expect(beacon.position.y).not.toBeCloseTo(0);
  });
});
