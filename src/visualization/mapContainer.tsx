import React, { useState, useEffect } from 'react';
import ReactMapGl, { Marker } from 'react-map-gl';
import { currentEnv } from '../common/environment';
import styled from 'styled-components';
import fallbackStyle from './fallbackMapStyle.json';
import { RouteComponentProps, withRouter } from 'react-router';
import Deserializer, {
  MapLocationQueryDecoder,
} from '../location/mqttDeserialize';

const KUMPULA_COORDS = { lat: 60.2046657, lon: 24.9621132 };
const DEFAULT_NONTRACKED_ZOOM = 12;

/**
 * When user lands to the page with a position.
 */
const DEFAULT_TRACKED_ZOOM = 18;

const Fullscreen = styled.div`
  width: 100vw;
  height: 100vh;
`;

const OfflineMarker = styled(Marker)`
  background-color: gray;
  &::before {
    background-color: gray;
  }
`;

/**
 * Use default Mapbox vector tiles if MAPBOX_TOKEN is found, otherwise fallback
 * to free Carto Light raster map.
 *
 * See https://wiki.openstreetmap.org/wiki/Tile_servers
 * and https://github.com/CartoDB/basemap-styles
 */
const MapContainer = ({ location }: RouteComponentProps) => {
  const parser = new Deserializer();

  const queryParams =
    location.search === ''
      ? null
      : parser.parseQuery(MapLocationQueryDecoder, location.search);

  const [viewport, setViewport] = useState({
    latitude: queryParams ? queryParams.lat : KUMPULA_COORDS.lat,
    longitude: queryParams ? queryParams.lon : KUMPULA_COORDS.lon,
    zoom: queryParams ? DEFAULT_TRACKED_ZOOM : DEFAULT_NONTRACKED_ZOOM,
  });

  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    if (!currentEnv.MAPBOX_TOKEN) {
      console.error('mapbox api token missing, falling back to raster maps...');
    }
  }, []);

  const UserMarker = isOnline ? Marker : OfflineMarker;

  return (
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
        {queryParams && (
          <UserMarker
            latitude={queryParams.lat}
            longitude={queryParams.lon}
            className="mapboxgl-user-location-dot"
          />
        )}
      </ReactMapGl>
    </Fullscreen>
  );
};

export default withRouter(MapContainer);
