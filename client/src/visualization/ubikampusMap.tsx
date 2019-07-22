import React, { FC } from 'react';
import ReactMapGl, { ViewState, PointerEvent } from 'react-map-gl';
import { currentEnv } from '../common/environment';
import fallbackStyle from './fallbackMapStyle.json';

interface Props {
  onClick(event: PointerEvent): void;
  viewport: ViewState;
  setViewport(a: ViewState): void;
  pointerCursor: boolean;
}

const UbikampusMap: FC<Props> = ({
  onClick,
  children,
  viewport,
  setViewport,
  pointerCursor,
}) => (
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
    height="auto"
    getCursor={pointerCursor ? () => 'pointer' : undefined}
    style={{ flex: '1' }}
    onViewportChange={vp => {
      setViewport(vp);
    }}
    onClick={e => onClick(e)}
  >
    {children}
  </ReactMapGl>
);

export default UbikampusMap;
