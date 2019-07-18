import React from 'react';
import styled from 'styled-components';
import { Marker } from 'react-map-gl';

import LocationPin from './locationPin';

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
