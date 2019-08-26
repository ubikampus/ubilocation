import { PublicBeacon } from './shareLocationApi';

class PublicBeaconList {
  publicBeacons: PublicBeacon[];

  constructor(publicBeacons: PublicBeacon[]) {
    this.publicBeacons = publicBeacons;
  }

  find(beaconId: string) {
    const publicBeacon = this.publicBeacons.find(b => b.beaconId === beaconId);
    return publicBeacon ? publicBeacon : null;
  }

  update(publicBeacon: PublicBeacon) {
    this.remove(publicBeacon.beaconId);
    this.publicBeacons.push(publicBeacon);
  }

  remove(beaconId: string) {
    this.publicBeacons = this.publicBeacons.filter(
      b => b.beaconId !== beaconId
    );
  }

  asList() {
    return this.publicBeacons;
  }
}

export default PublicBeaconList;
