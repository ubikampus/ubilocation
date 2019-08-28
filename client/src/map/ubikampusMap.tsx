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
import { CentralizationButton } from '../common/button';
import poiLayer from './shapeDraw/poiLayer.json';

// https://icons-for-free.com/exit+stairs+stairway+icon-1320085825255624486/
import stairs from '../../asset/stairs.png';

// https://www.flaticon.com/free-icon/toilet_185547
import toiletIcon from '../../asset/toilet.png';

// https://www.flaticon.com/free-icon/coffee_251078#term=coffee&page=1&position=28
import coffeeIcon from '../../asset/coffee.png';

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
  right: 15px;
  bottom: 100px;
`;

interface Props {
  onClick(event: PointerEvent): void;
  viewport: ViewState;
  setViewport(a: ViewState): void;
  pointerCursor: boolean;
  onCentralizeClick(): void;
  mapStyle: Style;
  minZoom: number;
}

const UbikampusMap: FC<Props> = ({
  onClick,
  onCentralizeClick,
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
    onLoad={async map => {
      const images = [
        { id: 'stairs', url: stairs },
        { id: 'toilet', url: toiletIcon },
        { id: 'coffee', url: coffeeIcon },
      ];

      await Promise.all(
        images.map(
          img =>
            new Promise((res, rej) => {
              map.target.loadImage(img.url, (error: any, image: any) => {
                if (error) {
                  rej(error);
                }

                map.target.addImage(img.id, image);

                res();
              });
            })
        )
      );

      map.target.addLayer(poiLayer as any);
    }}
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

      <CentralizationButton className="mapboxgl-ctrl mapboxgl-ctrl-group">
        <button
          onClick={() => onCentralizeClick()}
          className="mapboxgl-ctrl-icon mapboxgl-ctrl-geolocate"
        />
      </CentralizationButton>
    </Navigation>
  </ReactMapGl>
);

export default UbikampusMap;
