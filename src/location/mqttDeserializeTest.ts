import Deserializer, {
  mqttMessageToBabylon,
  BabylonBeacon,
  MqttMessageDecoder,
  mqttMessageToGeo,
} from './mqttDeserialize';
import * as t from 'io-ts';
import { unsafeDecode } from '../common/typeUtil';

const exampleMqttMessage = (index: number) => {
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

export const exampleMessages = (): BabylonBeacon[] => {
  return Array.from(Array(10).keys()).map(index => {
    const mqttMessage = exampleMqttMessage(index);
    const location = mqttMessageToBabylon(mqttMessage);

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
      const parser = new Deserializer();
      parser.deserializeMessage('asdfasdf');
    }).toThrow();
  });
});

describe('query string parsing', () => {
  it('should throw if required number is missing', () => {
    const queryDecoder = t.type({
      lat: t.number,
      lon: t.number,
    });

    const parser = new Deserializer();

    expect(() => {
      parser.parseQuery(queryDecoder, '?lon=60.1');
    }).toThrow();
  });

  it('should parse float in the query string', () => {
    const decoder = t.type({
      lat: t.number,
    });

    const parser = new Deserializer();

    expect(parser.parseQuery(decoder, '?lat=50.5').lat).toBeCloseTo(50.5);
    expect(parser.parseQuery(decoder, 'lat=50.1').lat).toBeCloseTo(50.1);
  });
});

describe('geographic coordinate conversion', () => {
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
      lat: 60.2050688,
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
