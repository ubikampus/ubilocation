import React, { FC } from 'react';
import ReactMapGl, { ViewState, PointerEvent } from 'react-map-gl';
import { Style } from 'mapbox-gl';
import { BeaconGeoLocation } from '../location/mqttDeserialize';
import { easeCubic } from 'd3-ease';

const MIN_ZOOM = 9;

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

interface Props {
  onClick(event: PointerEvent): void;
  viewport: ViewState;
  setViewport(a: ViewState): void;
  pointerCursor: boolean;
  mapStyle: Style;
}

const UbikampusMap: FC<Props> = ({
  onClick,
  children,
  viewport,
  setViewport,
  mapStyle,
  pointerCursor,
}) => (
  <ReactMapGl
    // NOTE: onViewportChange adds extra properties to `viewport`
    {...viewport}
    mapStyle={mapStyle}
    width="100%"
    height="auto"
    minZoom={MIN_ZOOM}
    getCursor={pointerCursor ? () => 'pointer' : undefined}
    style={{ flex: '1' }}
    onViewportChange={nextViewport => {
      setViewport(nextViewport);
    }}
    onClick={e => onClick(e)}
  >
    {children}
  </ReactMapGl>
);

export default UbikampusMap;
