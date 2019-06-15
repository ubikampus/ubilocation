import React, { ComponentClass } from 'react';
import { mount } from 'enzyme';
import UrlPromptContainer from '../src/urlPromptContainer';

const mockPush = jest.fn();

jest.mock('react-router', () => {
  return {
    withRouter: function mockWithRouter<P>(Component: ComponentClass<P>) {
      return (props: P) => (
        <Component {...props} history={{ push: mockPush }} />
      );
    },
  };
});

describe('front page form for configuration', () => {
  it('should display error if invalid url is given', () => {
    const container = mount(<UrlPromptContainer />);

    const input = container.find('input[name="busUrl"]');

    (input.instance() as any).value = 'not an url';
    input.simulate('change');

    container.find('#urlPromptForm').simulate('submit');

    expect(container.find('#inputError').text()).toContain('Invalid URL');
  });

  /**
   * Assert that when user inputs valid url, we navigate to another page after
   * submit.
   */
  it('should navigate if valid url is given', done => {
    mockPush.mockImplementation(() => done());
    const container = mount(<UrlPromptContainer />);

    const input = container.find('input[name="busUrl"]');

    (input.instance() as any).value = 'wss://192.168.0.0:1234';
    input.simulate('change');

    container.find('#urlPromptForm').simulate('submit');
  });
});
