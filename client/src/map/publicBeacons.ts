import { PublicBeacon } from './shareLocationApi';

const find = (list: PublicBeacon[], beaconId: string): PublicBeacon | null => {
  const beacon = list.find(b => b.beaconId === beaconId);
  return beacon ? beacon : null;
};

const update = (list: PublicBeacon[], beacon: PublicBeacon): PublicBeacon[] => {
  const newList = remove(list, beacon.beaconId);
  newList.push(beacon);
  return newList;
};

const remove = (list: PublicBeacon[], beaconId: string): PublicBeacon[] => {
  return list.filter(b => b.beaconId !== beaconId);
};

export default { find, update, remove };
