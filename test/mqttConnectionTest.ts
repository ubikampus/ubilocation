import { startMessageMocker } from '../src/mqttConnection';


describe('mqtt message generator', () => {
  it('should call onMessage with a deserialized message', done => {
    const id = startMessageMocker(
      'abc',
      message => {
        expect(message.beaconId).toBe('abc');
        clearInterval(id);
        done();
      },
      0
    );
  });
});
