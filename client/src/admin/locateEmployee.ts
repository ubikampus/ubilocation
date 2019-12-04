import { BeaconGeoLocation } from '../location/mqttDeserialize';

const calculateEuclidian = (x1: number, y1: number, x2: number, y2: number) => {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
};

export const locateEmployees = (employees: BeaconGeoLocation[]) => {
  return (lat: number, lon: number) => {
    return employees.sort(
      (a, b) =>
        calculateEuclidian(a.lat, a.lon, lat, lon) -
        calculateEuclidian(b.lat, b.lon, lat, lon)
    );
  };
};
