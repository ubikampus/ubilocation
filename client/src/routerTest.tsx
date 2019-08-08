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

    mount(<Router />);
  });
});
