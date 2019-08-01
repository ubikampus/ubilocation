import React, { FC } from 'react';
import ReactMapGl, { ViewState, PointerEvent } from 'react-map-gl';
import { Style } from 'mapbox-gl';
import { currentEnv } from '../common/environment';

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
