import React from 'react';
import { MemoryRouter, Route } from 'react-router';
import { mount } from 'enzyme';
import { MockBusContainer, GenuineBusContainer } from '../src/screenContainer';

const mockDispose = jest.fn();

jest.mock('../src/mqttConnection');
jest.mock('../src/screen3d', () => {
  return jest.fn().mockImplementation(() => {
    return {
      dispose: mockDispose,
      addBeacon: jest.fn(),
    };
  });
});

describe('3d screen container components', () => {
  it('should stop mock interval timer after unmount', done => {
    global.clearInterval = () => {
      // verify clearinterval is called after unmount
      done();
    };

    const rendered = mount(
      <MemoryRouter initialEntries={['/mockviz']}>
        <Route exact path={'/mockviz'} component={MockBusContainer} />
      </MemoryRouter>
    );
    rendered.unmount();
  });

  it('should dispose BabylonJS engine after unmounting', () => {
    const rendered = mount(
      <MemoryRouter initialEntries={['/viz?host=abc&topic']}>
        <Route exact path={'/viz'} component={GenuineBusContainer} />
      </MemoryRouter>
    );

    rendered.unmount();
    expect(mockDispose).toHaveBeenCalled();
  });

  it('should panic when topic is missing from query string', () => {
    const component = (
      <MemoryRouter initialEntries={['/viz?host=abc']}>
        <Route exact path={'/viz'} component={GenuineBusContainer} />
      </MemoryRouter>
    );

    expect(() => mount(component)).toThrow();
  });
});
