import { deserializeMessage } from '../src/mqttDeserialize';

const exampleMessage = () => {
  return `{
    "beaconHash": "hash123",
    "x": 13.12313223,
    "y": 11.12131121
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
