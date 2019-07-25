import { exampleMqttMessage } from '../location/mqttDeserializeTest';
import { mqttMessageToGeo } from '../location/mqttDeserialize';
import { divideMarkers } from './marker';

describe('map markers', () => {
  it('should return two user markers if there are multiple with same name', () => {
    const input = [
      mqttMessageToGeo(exampleMqttMessage(1)),
      mqttMessageToGeo(exampleMqttMessage(1)),
      mqttMessageToGeo(exampleMqttMessage(2)),
    ];

    const res = divideMarkers(input, 'undefined-1', null);
    expect(res.allUserMarkers.length).toBe(2);
    expect(res.nonUserMarkers.length).toBe(1);
  });

  it('should return all markers if name is null', () => {
    const input = [
      mqttMessageToGeo(exampleMqttMessage(1)),
      mqttMessageToGeo(exampleMqttMessage(1)),
    ];

    const res = divideMarkers(input, null, null);
    expect(res.allUserMarkers.length).toBe(0);
    expect(res.nonUserMarkers.length).toBe(2);
  });

  it('should use previous state if device is missing', () => {
    const input = [
      mqttMessageToGeo(exampleMqttMessage(1)),
      mqttMessageToGeo(exampleMqttMessage(2)),
      mqttMessageToGeo(exampleMqttMessage(3)),
    ];
    const lastPos = mqttMessageToGeo(exampleMqttMessage(4));
    lastPos.lon = 1;
    lastPos.lat = 2;

    const res = divideMarkers(input, 'huawei-123', lastPos);

    expect(res.allUserMarkers[0].lon).toBe(1);
    expect(res.allUserMarkers[0].lat).toBe(2);
    expect(res.isOnline).toBe(false);
  });
});
