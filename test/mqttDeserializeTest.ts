import { deserializeMessage } from '../src/mqttDeserialize';

const exampleMessage = () => {
  return `{
    "beaconId": "undefined",
    "x": 86.200010304358,
    "y": 33.79480855847156,
    "z": 0.0,
    "xr": 0.3450343712509113,
    "yr": 0.48663315791883244,
    "zr": 0.0,
    "alignment": 0.4801854848714045
  }`;
};

describe('MQTT parsing', () => {
  it('should parse x and y coords from the MQTT message', () => {
    const parsed = deserializeMessage(exampleMessage());

    expect(parsed.x).toBeTruthy();
    expect(parsed.y).toBeTruthy();
  });

  it('should panic for odd input', () => {
    expect(() => {
      deserializeMessage('asdfasdf');
    }).toThrow();
  });
});
