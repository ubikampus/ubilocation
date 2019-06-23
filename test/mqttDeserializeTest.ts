import MqttParser, {
  mqttMessageToLocation,
  BeaconLocation,
  MqttMessageDecoder,
} from '../src/mqttDeserialize';
import { unsafeDecode } from '../src/typeUtil';

export const exampleMessages = (): BeaconLocation[] => {
  return Array.from(Array(10).keys()).map(index => {
    const rawMessage = `{
      "beaconId": "undefined-${index}",
      "x": 86.200010304358,
      "y": 33.79480855847156,
      "z": 22.23232,
      "xr": 0.3450343712509113,
      "yr": 0.48663315791883244,
      "zr": 0.8,
      "alignment": -0.4801854848714045
    }`;

    const parsed = unsafeDecode(MqttMessageDecoder, JSON.parse(rawMessage));
    const location = mqttMessageToLocation(parsed);

    return location;
  });
};

describe('MQTT parsing', () => {
  it('should parse x and y coords from the MQTT message', () => {
    const parsed = exampleMessages();

    expect(parsed[0].xMeters).toBeTruthy();
    expect(parsed[0].yMeters).toBeTruthy();
  });

  it('should panic for odd input', () => {
    expect(() => {
      const parser = new MqttParser();
      parser.deserializeMessage('asdfasdf');
    }).toThrow();
  });

  it('should parse valid mqtt bus url', () => {
    const parser = new MqttParser();
    const res = parser.parseMqttUrl('wss://localhost:9001');

    expect(res.kind).toBe('success');
  });

  it('should give informative error message for invalid mqtt url', () => {
    const parser = new MqttParser();
    const res = parser.parseMqttUrl('ws://localhost::123');

    if (res.kind === 'fail') {
      expect(res.message).toMatch(/invalid url/i);
    } else {
      throw new Error('unexpected parse result');
    }
  });
});
