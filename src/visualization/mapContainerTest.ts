import { divideMarkers } from './mapContainer';
import { exampleMqttMessage } from '../location/mqttDeserializeTest';
import { mqttMessageToGeo } from '../location/mqttDeserialize';

describe('<MapContainer />', () => {
  it('should return two user markers if there are multiple with same name', () => {
    const input = [
      mqttMessageToGeo(exampleMqttMessage(1)),
      mqttMessageToGeo(exampleMqttMessage(1)),
      mqttMessageToGeo(exampleMqttMessage(2)),
    ];

    const res = divideMarkers(input, 'undefined-1');
    expect(res.userMarkers.length).toBe(2);
    expect(res.nonUserMarkers.length).toBe(1);
  });
});
