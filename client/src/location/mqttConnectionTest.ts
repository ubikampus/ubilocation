import { FakeMqttGenerator, refreshBeacons } from './mqttConnection';
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
  /**
   * TODO: fetch actual bluetooth name from web bluetooth
   */
  it('should infer new bt name if its missing', () => {
    const messages = [exampleMqttMessage(1), exampleMqttMessage(1)];

    const res = refreshBeacons(messages, 'undefined-1', null);

    expect((res.lastKnownPosition as any).lat).toBeTruthy();
  });

  it('should display old position if user device is not found', () => {
    const messages = [exampleMqttMessage(1), exampleMqttMessage(1)];

    const lastPos = mqttMessageToGeo(exampleMqttMessage(2));
    lastPos.lat = 1;
    lastPos.lon = 2;

    const nextState = refreshBeacons(messages, 'huawei-153', lastPos);
    expect((nextState.lastKnownPosition as any).lat).toBe(1);
    expect((nextState.lastKnownPosition as any).lon).toBe(2);
  });
});
