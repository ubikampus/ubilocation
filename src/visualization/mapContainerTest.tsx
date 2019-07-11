import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router';
import MapContainer, { divideMarkers, refreshBeacons } from './mapContainer';
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

describe('<MapContainer />', () => {
  it('connects to ubimqtt on mount', done => {
    mockConnect.mockImplementation(() => {
      done();
    });

    mount(
      <MemoryRouter initialEntries={['/map?lat=1&lon=2&host=abc&topic=aihe']}>
        <MapContainer />
      </MemoryRouter>
    );
  });
});
