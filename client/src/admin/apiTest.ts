import { AndroidLocation } from './adminPanel';
import { formatAndroidLocations } from './api';

const exampleLocation = (): AndroidLocation => {
  return {
    name: 'android-1',
    lat: 1.1,
    lon: 2.2,
    height: 1000,
  };
};

describe('server api', () => {
  it('should format z axis as third coordinate', () => {
    const location = exampleLocation();
    location.height = 100;

    const formatted = JSON.parse(formatAndroidLocations([location]));

    expect(formatted[0].position[2]).toBe(100);
  });

  it('should pass the name as observerId', () => {
    const location = exampleLocation();

    location.name = 'android-2';

    const formatted = JSON.parse(formatAndroidLocations([location]));
    expect(formatted[0].observerId).toBe('android-2');
  });
});
