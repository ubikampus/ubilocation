import React, { FC } from 'react';
import styled from 'styled-components';
import ReactMapGl, { ViewState } from 'react-map-gl';

import { currentEnv } from '../common/environment';
import fallbackStyle from './fallbackMapStyle.json';

const Fullscreen = styled.div`
  width: 100vw;
  height: 100vh;
`;

interface Props {
  viewport: ViewState;
  setViewport(a: ViewState): void;
}

const UbikampusMap: FC<Props> = ({ children, viewport, setViewport }) => (
  <Fullscreen>
    <ReactMapGl
      // NOTE: onViewportChange adds extra properties to `viewport`
      {...viewport}
      mapStyle={
        currentEnv.MAPBOX_TOKEN
          ? 'mapbox://styles/ljljljlj/cjxf77ldr0wsz1dqmsl4zko9y'
          : fallbackStyle
      }
      mapboxApiAccessToken={currentEnv.MAPBOX_TOKEN}
      width="100%"
      height="100%"
      onViewportChange={vp => {
        setViewport(vp);
      }}
    >
      {children}
    </ReactMapGl>
  </Fullscreen>
);

export default UbikampusMap;
