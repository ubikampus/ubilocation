import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router';
import MapContainer from './mapContainer';

const mockConnect = jest.fn();

jest.mock('ubimqtt', () => {
  return jest.fn().mockImplementation(() => {
    return {
      connect: mockConnect,
    };
  });
});

describe('<MapContainer />', () => {
  it('connects to ubimqtt on mount', done => {
    mockConnect.mockImplementation(() => {
      done();
    });

    mount(
      <MemoryRouter initialEntries={['/map?lat=1&lon=2&host=abc&topic=aihe']}>
        <MapContainer
          beacons={[]}
          pinType="none"
          lastKnownPosition={null}
          staticLocations={[]}
          setPinType={() => {}}
          isAdminPanelOpen={false}
          bluetoothName="phone-1234"
          setNameModalOpen={() => {}}
          roomReserved={false}
          getDeviceLocation={null}
          setDeviceLocation={() => {}}
          devices={[]}
        />
      </MemoryRouter>
    );
  });
});
