import React, { useState } from 'react';
import ReactMapGl from 'react-map-gl';
import { currentEnv } from './environment';
import styled from 'styled-components';
import fallbackStyle from './fallbackMapStyle.json';

const KUMPULA_COORDS = { lat: 60.2046657, lon: 24.9621132 };

const Fullscreen = styled.div`
  width: 100vw;
  height: 100vh;
`;

if (!currentEnv.MAPBOX_TOKEN) {
  console.error('mapbox api token missing, falling back to raster maps...');
}

/**
 * Use default Mapbox vector tiles if MAPBOX_TOKEN is found, otherwise fallback
 * to free Carto Light raster map.
 *
 * See https://wiki.openstreetmap.org/wiki/Tile_servers
 * and https://github.com/CartoDB/basemap-styles
 */
const MapContainer = () => {
  const [viewport, setViewport] = useState({
    latitude: KUMPULA_COORDS.lat,
    longitude: KUMPULA_COORDS.lon,
    zoom: 12,
  });

  return (
    <Fullscreen>
      <ReactMapGl
        // NOTE: onViewportChange adds extra properties to `viewport`
        {...viewport}
        mapStyle={currentEnv.MAPBOX_TOKEN ? undefined : fallbackStyle}
        mapboxApiAccessToken={currentEnv.MAPBOX_TOKEN}
        width="100%"
        height="100%"
        onViewportChange={vp => {
          setViewport(vp);
        }}
      />
    </Fullscreen>
  );
};

export default MapContainer;
