import { FakeMqttGenerator } from '../src/mqttConnection';
import MqttParser from '../src/mqttDeserialize';

describe('mqtt message generator', () => {
  it('should call onMessage with a deserialized message', done => {
    const generator = new FakeMqttGenerator(
      new MqttParser(),
      msg => {
        expect(msg[0].beaconId).toMatch(/beacon-\d+/);
        generator.stop();
        done();
      },
      0
    );
  });
});
