import React, { FC } from 'react';
import ReactMapGl, { ViewState, PointerEvent } from 'react-map-gl';
import styled from 'styled-components';
import { currentEnv } from '../common/environment';
import fallbackStyle from './fallbackMapStyle.json';

const Fullscreen = styled.div`
  width: 100vw;
  height: 100vh;
`;

interface Props {
  onClick(event: PointerEvent): void;
  viewport: ViewState;
  setViewport(a: ViewState): void;
}

const UbikampusMap: FC<Props> = ({
  onClick,
  children,
  viewport,
  setViewport,
}) => (
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
      onClick={onClick}
    >
      {children}
    </ReactMapGl>
  </Fullscreen>
);

export default UbikampusMap;
