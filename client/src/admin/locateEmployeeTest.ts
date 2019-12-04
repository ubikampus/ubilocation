import { locateEmployees } from './locateEmployee';
import { BeaconGeoLocation } from '../location/mqttDeserialize';

const employees: BeaconGeoLocation[] = [
  {
    beaconId: '1',
    xr: 0,
    yr: 0,
    alignment: 0,
    height: 0,
    lat: 10,
    lon: 10,
    zr: 0,
  },
  {
    beaconId: '2',
    xr: 0,
    yr: 0,
    alignment: 0,
    height: 0,
    lat: 5,
    lon: 5,
    zr: 0,
  },
  {
    beaconId: '3',
    xr: 0,
    yr: 0,
    alignment: 0,
    height: 0,
    lat: 20,
    lon: 20,
    zr: 0,
  },
];

describe('employee location', () => {
  it('should sort locations correctly', () => {
    const sorted = locateEmployees(employees)(0, 0);
    expect(sorted[0].beaconId).toBe('2');
  });
});
