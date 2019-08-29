import Deserializer, {
  MqttMessageDecoder,
  mqttMessageToGeo,
  geoCoordsToPlaneCoords,
} from './mqttDeserialize';
import { unsafeDecode } from '../common/typeUtil';

export const exampleMqttMessage = (index: number) => {
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

  return unsafeDecode(MqttMessageDecoder, JSON.parse(rawMessage));
};

describe('MQTT parsing', () => {
  it('should return empty list for odd input', () => {
    const parser = new Deserializer();
    const res = parser.deserializeMessage('asdfasdf');
    expect(res).toBe(null);
  });
});

describe('coordinate conversion into geographic format', () => {
  it('should convert zero coordinates nearby to the origo', () => {
    const input = exampleMqttMessage(1);
    input.x = 0.0;
    input.y = 0.0;

    const geoCoords = mqttMessageToGeo(input);

    const kumpulaOrigo = {
      lat: 60.205325,
      lon: 24.962115,
    };

    expect(geoCoords.lat).toBeCloseTo(kumpulaOrigo.lat);
    expect(geoCoords.lon).toBeCloseTo(kumpulaOrigo.lon);
  });

  it('should give the western corner when y is large', () => {
    const input = exampleMqttMessage(1);
    input.x = 0.0;
    input.y = 41000.0; // length of library wall

    const westCorner = {
      lat: 60.2050738,
      lon: 24.9615679,
    };

    const geoCoords = mqttMessageToGeo(input);

    expect(geoCoords.lat).toBeCloseTo(westCorner.lat, 5);
    expect(geoCoords.lon).toBeCloseTo(westCorner.lon, 5);
  });

  it('should give the southern corner if both x and y are large', () => {
    const input = exampleMqttMessage(1);
    input.x = 30000.0;
    input.y = 41000.0;

    const southCorner = { lat: 60.2048748, lon: 24.961934255 };

    const geoCoords = mqttMessageToGeo(input);

    expect(geoCoords.lat).toBeCloseTo(southCorner.lat, 5);
    expect(geoCoords.lon).toBeCloseTo(southCorner.lon, 5);
  });
});

describe('coordinate conversion into plane format', () => {
  it('should return origo for northern corner', () => {
    const input = { lat: 60.205323, lon: 24.962112 };

    const result = geoCoordsToPlaneCoords(input, 10);

    expect(result.x).toBeCloseTo(0.0);
  });

  it('should return right coords for java room corner', () => {
    const input = { lat: 60.205092, lon: 24.96174 };

    const result = geoCoordsToPlaneCoords(input, 10);

    expect(result.y).toBeCloseTo(32662.0972328);
    expect(result.x).toBeCloseTo(3847.381576);
  });
});
