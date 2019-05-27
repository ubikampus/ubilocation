import { currentEnv } from './environment';
import process from 'process';

describe('environment functions', () => {
  it('should panic if NODE_ENV is empty', () => {
    process.env.NODE_ENV = 'asd';

    expect(() => {
      currentEnv();
    }).toThrow();
  });

  it('should return "production" if NODE_ENV is "production"', () => {
    process.env.NODE_ENV = 'production';

    expect(currentEnv()).toBe('production');
  });
});
