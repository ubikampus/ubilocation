import {
  FakeMqttGenerator,
  urlForLocation,
  lastKnownPosCache,
} from './mqttConnection';
import Deserializer, { mqttMessageToGeo } from './mqttDeserialize';
import { exampleMqttMessage } from './mqttDeserializeTest';

describe('mqtt message generator', () => {
  it('should call onMessage with a deserialized message', done => {
    const generator = new FakeMqttGenerator(
      new Deserializer(),
      msg => {
        expect(msg[0].beaconId).toMatch(/beacon-\d+/);
        generator.stop();
        done();
      },
      0
    );
  });
});

describe('map beacon lifecycle', () => {
  it('deduces the last position with same beacon id', () => {
    const inferLastPosition = lastKnownPosCache();

    const message = exampleMqttMessage(1);
    const lastKnownPosition = inferLastPosition(
      [mqttMessageToGeo(message)],
      'undefined-1'
    );

    expect(lastKnownPosition).toBeTruthy();
  });

  it('deduces the correct coordinates from multiple messages', () => {
    const inferLastPosition = lastKnownPosCache();

    const message1 = mqttMessageToGeo(exampleMqttMessage(1));
    const message2 = mqttMessageToGeo(exampleMqttMessage(2));
    message2.lat = 2.2;
    const message3 = mqttMessageToGeo(exampleMqttMessage(3));

    const lastKnownPosition = inferLastPosition(
      [message1, message2, message3],
      'undefined-2'
    );

    expect((lastKnownPosition as any).lat).toBeCloseTo(2.2);
  });
});

describe('location query generation', () => {
  it('preserves query params when generating QR code link', () => {
    const oldParams = { old: 'val' };
    const url = urlForLocation(oldParams, 24.0, 60.0);

    expect(url).toContain('old=val');
  });
});
