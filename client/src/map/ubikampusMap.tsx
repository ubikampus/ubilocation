import React, { FC } from 'react';
import ReactMapGl, {
  ViewState,
  PointerEvent,
  NavigationControl,
} from 'react-map-gl';
import { Style } from 'mapbox-gl';
import { easeCubic } from 'd3-ease';
import styled from 'styled-components';

import { BeaconGeoLocation } from '../location/mqttDeserialize';

export const flyToUserlocation = (
  viewport: ViewState,
  userLocation: BeaconGeoLocation
) => {
  const nextViewport = {
    ...viewport,
    longitude: userLocation.lon,
    latitude: userLocation.lat,
    zoom: 18,
    transitionDuration: 1000,
    transitionEasing: easeCubic,
  };

  return nextViewport;
};

const Navigation = styled.div`
  position: absolute;
  right: 10px;
  bottom: 60px;
`;

interface Props {
  onClick(event: PointerEvent): void;
  viewport: ViewState;
  setViewport(a: ViewState): void;
  pointerCursor: boolean;
  mapStyle: Style;
  minZoom: number;
}

const UbikampusMap: FC<Props> = ({
  onClick,
  children,
  viewport,
  setViewport,
  mapStyle,
  pointerCursor,
  minZoom,
}) => (
  <ReactMapGl
    // NOTE: onViewportChange adds extra properties to `viewport`
    {...viewport}
    mapStyle={mapStyle}
    width="100%"
    height="auto"
    minZoom={minZoom}
    getCursor={pointerCursor ? () => 'pointer' : undefined}
    style={{ flex: '1' }}
    onViewportChange={nextViewport => {
      setViewport(nextViewport);
    }}
    onClick={e => onClick(e)}
  >
    {children}
    <Navigation>
      <NavigationControl />
    </Navigation>
  </ReactMapGl>
);

export default UbikampusMap;
