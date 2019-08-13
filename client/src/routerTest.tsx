import React from 'react';
import { mount } from 'enzyme';

import Router, { isTrackingPromptOpen } from './router';

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

    mount(<Router />);
  });

  /**
   * If user's current location isn't known (bluetooth name is null), and user
   * clicks "Location sharing", verify that tracking prompt is opened.
   */
  it('shows tracking prompt if sharing location without known name', () => {
    const bluetoothName = null;
    const isShareLocationModalOpen = true;
    const isPublicShareOpen = false;
    const isCentralizationButtonActive = false;

    expect(
      isTrackingPromptOpen(
        bluetoothName,
        isShareLocationModalOpen,
        isPublicShareOpen,
        isCentralizationButtonActive
      )
    ).toBe(true);
  });

  it('shows tracking prompt if publishing location without known name', () => {
    const bluetoothName = null;
    const isShareLocationModalOpen = false;
    const isPublicShareOpen = true;
    const isCentralizationButtonActive = false;

    expect(
      isTrackingPromptOpen(
        bluetoothName,
        isShareLocationModalOpen,
        isPublicShareOpen,
        isCentralizationButtonActive
      )
    ).toBe(true);
  });
});
