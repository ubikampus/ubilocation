import React, { ComponentClass } from 'react';
import { mount } from 'enzyme';
import UrlPromptContainer from './urlPromptContainer';

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
  it('should navigate when form is submitted', done => {
    mockPush.mockImplementation(() => done());
    const container = mount(<UrlPromptContainer />);

    container.find('#urlPromptForm').simulate('submit');
  });
});
