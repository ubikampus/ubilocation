import React, { FC } from 'react';
import styled from 'styled-components';
import ReactMapGl, { ViewState } from 'react-map-gl';

import { currentEnv } from '../common/environment';
import fallbackStyle from './fallbackMapStyle.json';

interface Props {
  viewport: ViewState;
  setViewport(a: ViewState): void;
}

const Map = styled(ReactMapGl)`
  flex: 1;
`;

const UbikampusMap: FC<Props> = ({ children, viewport, setViewport }) => (
  <Map
    // NOTE: onViewportChange adds extra properties to `viewport`
    {...viewport}
    mapStyle={
      currentEnv.MAPBOX_TOKEN
        ? 'mapbox://styles/ljljljlj/cjxf77ldr0wsz1dqmsl4zko9y'
        : fallbackStyle
    }
    mapboxApiAccessToken={currentEnv.MAPBOX_TOKEN}
    width="100%"
    height="auto"
    style={{ flex: '1' }}
    onViewportChange={vp => {
      setViewport(vp);
    }}
  >
    {children}
  </Map>
);

export default UbikampusMap;
