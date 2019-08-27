import { BeaconGeoLocation } from '../location/mqttDeserialize';
import { PublicBeacon } from './shareLocationApi';

// TODO: These methods should probably use a hash map (rather than a list) for efficiency
class SharedLocationMarkers {
  private nonUserMarkers: BeaconGeoLocation[];
  private publicBeacons: PublicBeacon[];

  constructor(
    nonUserMarkers: BeaconGeoLocation[],
    publicBeacons: PublicBeacon[]
  ) {
    this.nonUserMarkers = nonUserMarkers;
    this.publicBeacons = publicBeacons;
  }

  filterPrivateMarkers(trackedBeaconId: string | null) {
    return trackedBeaconId
      ? this.nonUserMarkers.filter(b => b.beaconId === trackedBeaconId)
      : [];
  }

  filterPublicMarkers() {
    return this.nonUserMarkers.filter(
      b => this.publicBeacons.find(p => p.beaconId === b.beaconId) !== undefined
    );
  }

  getNicknameForMarker(marker: BeaconGeoLocation) {
    const beacon = this.publicBeacons.find(p => p.beaconId === marker.beaconId);
    if (!beacon) {
      return null;
    }

    return beacon.nickname;
  }
}

export default SharedLocationMarkers;
