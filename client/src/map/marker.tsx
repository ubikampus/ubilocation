import React, { MouseEvent } from 'react';
import styled from 'styled-components';
import { Marker, Popup } from 'react-map-gl';

import LocationPin from './locationPin';
import { Location } from '../common/typeUtil';
import { BeaconGeoLocation } from '../location/mqttDeserialize';
import partition = require('lodash/partition');

const StaticMarker = styled.div`
  svg {
    height: 40px;
    width: auto;
    fill: #4287f5;
  }
`;

interface StaticUbiMarkerProps {
  latitude: number;
  longitude: number;
}

export const StaticUbiMarker = ({
  latitude,
  longitude,
}: StaticUbiMarkerProps) => (
  <Marker
    offsetLeft={-20}
    offsetTop={-40}
    latitude={latitude}
    longitude={longitude}
  >
    <StaticMarker>
      <LocationPin />
    </StaticMarker>
  </Marker>
);

export const OfflineMarker = styled(Marker)`
  background-color: gray;
  &::before {
    background-color: gray;
  }
`;

export const NonUserMarker = styled(OfflineMarker)`
  width: 10px;
  height: 10px;

  &:before {
    display: none;
  }

  &:after {
    height: 14px;
    width: 14px;
  }
`;

export const SharedLocationMarker = styled(NonUserMarker)`
  background-color: green;
`;

interface PinProps {
  type: 'configure' | 'show' | 'none';
  coords: Location;
  onClick(a: MouseEvent<HTMLButtonElement>): void;
}

export const LocationPinMarker = ({ type, coords, onClick }: PinProps) => {
  switch (type) {
    case 'configure':
      return (
        <Popup anchor="bottom" longitude={coords.lon} latitude={coords.lat}>
          <button onClick={onClick}>qr code</button>
        </Popup>
      );
    case 'show':
      return (
        <NonUserMarker
          latitude={coords.lat}
          longitude={coords.lon}
          className="mapboxgl-user-location-dot"
        />
      );
    case 'none':
      return null;
  }
};

/**
 * Why can there be multiple markers for the user? Because we cannot get unique
 * Id for the device thanks to bluetooth security limits. Instead we can utilize
 * the non-unique bluetooth name.
 */
export const divideMarkers = (
  beacons: BeaconGeoLocation[],
  bluetoothName: string | null,
  lastKnownPosition: BeaconGeoLocation | null
) => {
  const [userMarkers, nonUserMarkers] = partition(
    beacons,
    beacon => beacon.beaconId === bluetoothName
  );

  const allUserMarkers =
    lastKnownPosition && userMarkers.length === 0
      ? [lastKnownPosition]
      : userMarkers;

  return { isOnline: userMarkers.length !== 0, allUserMarkers, nonUserMarkers };
};
