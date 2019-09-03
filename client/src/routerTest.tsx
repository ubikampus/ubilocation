import React from 'react';
import { mount } from 'enzyme';

import Router from './router';

const mockConnect = jest.fn();

jest.mock('ubimqtt', () => {
  return jest.fn().mockImplementation(() => {
    return {
      connect: mockConnect,
    };
  });
});

describe('<Router />', () => {
  it('connects to ubimqtt on mount', done => {
    mockConnect.mockImplementation(() => {
      done();
    });

    const config = {
      INITIAL_LATITUDE: 1.1,
      INITIAL_LONGITUDE: 2.2,
      INITIAL_ZOOM: 10,
      MINIMUM_ZOOM: 5,
      WEB_MQTT_URL: 'ws://example.com',
    };

    mount(<Router appConfig={config} />);
  });
});
