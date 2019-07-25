import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router';
import MapContainer, { divideMarkers, urlForLocation } from './mapContainer';
import { exampleMqttMessage } from '../location/mqttDeserializeTest';
import { mqttMessageToGeo } from '../location/mqttDeserialize';

const mockConnect = jest.fn();

jest.mock('ubimqtt', () => {
  return jest.fn().mockImplementation(() => {
    return {
      connect: mockConnect,
    };
  });
});

describe('<MapContainer />', () => {
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

  it('connects to ubimqtt on mount', done => {
    mockConnect.mockImplementation(() => {
      done();
    });

    mount(
      <MemoryRouter initialEntries={['/map?lat=1&lon=2&host=abc&topic=aihe']}>
        <MapContainer
          isAdminPanelOpen={false}
          getDeviceLocation={null}
          setDeviceLocation={() => {}}
          devices={[]}
        />
      </MemoryRouter>
    );
  });

  it('preserves query params when generating QR code link', () => {
    const oldParams = { old: 'val' };
    const url = urlForLocation(oldParams, 24.0, 60.0);

    expect(url).toContain('old=val');
  });
});
