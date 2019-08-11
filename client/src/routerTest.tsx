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

  it('shows tracking prompt if sharing location without known name', () => {
    const bluetoothName = null;
    const shareLocationModalOpen = true;
    const publicShareOpen = false;
    const centralizeActive = false;

    expect(
      isTrackingPromptOpen(
        bluetoothName,
        shareLocationModalOpen,
        publicShareOpen,
        centralizeActive
      )
    ).toBe(true);
  });

  it('shows tracking prompt if publishing location without known name', () => {
    const bluetoothName = null;
    const shareLocationModalOpen = false;
    const publicShareOpen = true;
    const centralizeActive = false;

    expect(
      isTrackingPromptOpen(
        bluetoothName,
        shareLocationModalOpen,
        publicShareOpen,
        centralizeActive
      )
    ).toBe(true);
  });
});
