import { flyToUserlocation } from './ubikampusMap';
import { ViewState } from 'react-map-gl';
import { exampleMqttMessage } from '../location/mqttDeserializeTest';
import { mqttMessageToGeo } from '../location/mqttDeserialize';

it('should change position when flying to user location', () => {
  const oldViewport = {};

  const userLocation = mqttMessageToGeo(exampleMqttMessage(1));

  userLocation.lat = 1.1;
  userLocation.lon = 2.2;

  const nextViewport = flyToUserlocation(
    oldViewport as ViewState,
    userLocation
  );

  expect(nextViewport.latitude).toBeCloseTo(1.1);
  expect(nextViewport.longitude).toBeCloseTo(2.2);
});
