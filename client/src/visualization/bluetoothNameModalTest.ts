import { sortBeacons } from './bluetoothNameModal';
import { exampleMqttMessage } from '../location/mqttDeserializeTest';
import { mqttMessageToGeo } from '../location/mqttDeserialize';

describe('bluetooth name modal behavior', () => {
  /**
   * Why we leave duplicates out? Because we have no way to distinguish them,
   * so just show the user multiple locations then.
   */
  it('should leave out duplicate names', () => {
    const messages = [
      mqttMessageToGeo(exampleMqttMessage(1)),
      mqttMessageToGeo(exampleMqttMessage(1)),
      mqttMessageToGeo(exampleMqttMessage(2)),
    ];

    const res = sortBeacons(messages);

    expect(res.length).toBe(2);
    expect(res[1].beaconId).toBe('undefined-2');
  });

  it('should sort huawei-2 before huawei-10', () => {
    const msg1 = mqttMessageToGeo(exampleMqttMessage(1));
    const msg2 = mqttMessageToGeo(exampleMqttMessage(1));

    msg1.beaconId = 'huawei-10';
    msg2.beaconId = 'huawei-2';

    const res = sortBeacons([msg1, msg2]);
    expect(res[0].beaconId).toBe('huawei-2');
  });
});
