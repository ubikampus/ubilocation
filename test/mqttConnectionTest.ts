import { FakeMqttGenerator } from '../src/mqttConnection';
import MqttParser from '../src/mqttDeserialize';

describe('mqtt message generator', () => {
  it('should call onMessage with a deserialized message', done => {
    const generator = new FakeMqttGenerator(
      'id',
      new MqttParser(),
      msg => {
        expect(msg.beaconId).toBe('id');
        generator.stop();
        done();
      },
      0
    );
  });
});
