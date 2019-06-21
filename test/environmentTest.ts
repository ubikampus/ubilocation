import { apiRoot } from '../src/environment';

describe('environment functions', () => {
  it('should return / as root for test environment', () => {
    expect(apiRoot()).toBe('/');
  });
});
