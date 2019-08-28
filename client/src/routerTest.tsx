import React from 'react';
import { mount } from 'enzyme';

import Router, { isBeaconIdPromptOpen } from './router';

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

  /**
   * If user's current location isn't known (beacon ID is null), and user
   * clicks "Location sharing", verify that tracking prompt is opened.
   */
  it('shows beacon ID prompt if sharing location without known ID', () => {
    const beaconId = null;
    const isShareLocationModalOpen = true;
    const isPublicShareOpen = false;
    const isCentralizationButtonActive = false;

    expect(
      isBeaconIdPromptOpen(
        beaconId,
        isShareLocationModalOpen,
        isPublicShareOpen,
        isCentralizationButtonActive
      )
    ).toBe(true);
  });

  it('shows beacon ID prompt if publishing location without known ID', () => {
    const beaconId = null;
    const isShareLocationModalOpen = false;
    const isPublicShareOpen = true;
    const isCentralizationButtonActive = false;

    expect(
      isBeaconIdPromptOpen(
        beaconId,
        isShareLocationModalOpen,
        isPublicShareOpen,
        isCentralizationButtonActive
      )
    ).toBe(true);
  });
});
