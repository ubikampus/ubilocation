import React, { MouseEvent, useState } from 'react';
import styled from 'styled-components';
import { Marker, Popup } from 'react-map-gl';

import LocationPin from './locationPin';
import { Location } from '../common/typeUtil';
import { BeaconGeoLocation } from '../location/mqttDeserialize';
import partition = require('lodash/partition');
import { taskCommand } from '../common/contactEyebud';

const StaticMarker = styled.div<{ red?: boolean }>`
  svg {
    height: 40px;
    width: auto;
    fill: ${props => (props.red ? '#ec7272' : '#4287f5')};
  }
`;

interface StaticUbiMarkerProps {
  latitude: number;
  longitude: number;
  red?: boolean;
}

interface EyebudMarkerProps {
  latitude: number;
  longitude: number;
  onClick: any;
  children: any;
}

export const StaticUbiMarker = ({
  latitude,
  longitude,
  red,
}: StaticUbiMarkerProps) => (
  <Marker
    offsetLeft={-20}
    offsetTop={-40}
    latitude={latitude}
    longitude={longitude}
  >
    <StaticMarker red={red}>
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

export const PrivateLocationMarker = styled(NonUserMarker)`
  background-color: green;
`;

export const EyebudLocationMarker = ({
  latitude,
  longitude,
  onClick,
  children,
}: EyebudMarkerProps) => (
  <Marker latitude={latitude} longitude={longitude}>
    <div onClick={onClick} className="mapboxgl-user-location-dot" />
    {children}
  </Marker>
);

export const PublicLocationMarker = styled(NonUserMarker)``;

export type PinKind = 'configure' | 'show' | 'none';

interface PinProps {
  type: PinKind;
  coords: Location;
  onClose(): void;
  onClick(a: MouseEvent<HTMLButtonElement>): void;
  locateEmployees(lat: number, lon: number): BeaconGeoLocation[];
}

export const LocationMarker = ({
  onClose,
  type,
  coords,
  onClick,
  locateEmployees,
}: PinProps) => {
  const [selected, setSelected] = useState('lifting');
  const [details, setDetails] = useState('');
  const [helper, setHelper] = useState<string | null>(null);

  switch (type) {
    case 'configure':
      return (
        <Popup
          onClose={onClose}
          anchor="bottom"
          longitude={coords.lon}
          latitude={coords.lat}
          closeOnClick={false}
        >
          <div>
            <button onClick={onClick}>qr code</button>
          </div>
          select a job
          <div>
            <select
              value={selected}
              onChange={event => setSelected(event.target.value)}
            >
              <option value="lifting">lifting</option>
              <option value="carrying">carrying</option>
              <option value="thinking">thinking</option>
            </select>
          </div>
          <div>
            <input
              type="text"
              value={details}
              onChange={event => setDetails(event.target.value)}
            />
          </div>
          <div>
            <button
              onClick={() => {
                const sorted = locateEmployees(coords.lat, coords.lon);
                const names = sorted.map(s => s.beaconId.substring(7));
                taskCommand(names, selected, details).then(setHelper);
              }}
            >
              Request help
            </button>
            {helper ? <div>{helper} is coming to help </div> : null}
          </div>
        </Popup>
      );
    case 'show':
      return (
        <StaticUbiMarker latitude={coords.lat} longitude={coords.lon} red />
      );
    case 'none':
      return null;
  }
};

/**
 * Why can there be multiple markers for the user? Because may not be able to get
 * an unique ID for the device thanks to Bluetooth security limits. Hence, we don't
 * assume the IDs to be unique.
 */
export const divideMarkers = (
  beacons: BeaconGeoLocation[],
  beaconId: string | null,
  lastKnownPosition: BeaconGeoLocation | null
) => {
  const [userMarkers, nonUserMarkers] = partition(
    beacons,
    beacon => beacon.beaconId === beaconId
  );

  const allUserMarkers =
    lastKnownPosition && userMarkers.length === 0
      ? [lastKnownPosition]
      : userMarkers;

  return { isOnline: userMarkers.length !== 0, allUserMarkers, nonUserMarkers };
};
