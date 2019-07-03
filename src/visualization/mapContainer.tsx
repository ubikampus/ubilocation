import React, { useState, useEffect } from 'react';
import ReactMapGl, { Marker } from 'react-map-gl';
import { RouteComponentProps, withRouter } from 'react-router';
import { default as UbiMqtt } from 'ubimqtt';
import styled from 'styled-components';
import partition from 'lodash/partition';

import { currentEnv } from '../common/environment';
import fallbackStyle from './fallbackMapStyle.json';
import Deserializer, {
  MapLocationQueryDecoder,
  BeaconGeoLocation,
  mqttMessageToGeo,
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

const NonUserMarker = styled(OfflineMarker)`
  width: 10px;
  height: 10px;

  &:before {
    display: none;
  }

  &:after {
    height: 14px;
    width: 14px;
  }
`;

interface BeaconsState {
  beacons: BeaconGeoLocation[];

  /**
   * null indicates that user is offline.
   */
  bluetoothName: null | string;
  lastKnownPosition: null | BeaconGeoLocation;
}

/**
 * Why can there be multiple markers for the user? Because we cannot get unique
 * Id for the device thanks to bluetooth security limits. Instead we can utilize
 * the non-unique bluetooth name.
 */
export const divideMarkers = (
  beacons: BeaconGeoLocation[],
  name: null | string
) => {
  if (name === null) {
    return {
      userMarkers: [],
      nonUserMarkers: beacons,
    };
  } else {
    const [userMarkers, nonUserMarkers] = partition(
      beacons,
      beacon => beacon.beaconId === name
    );

    return { userMarkers, nonUserMarkers };
  }
};

/**
 * Use default Mapbox vector tiles if MAPBOX_TOKEN is found, otherwise fallback
 * to free Carto Light raster map.
 *
 * See https://wiki.openstreetmap.org/wiki/Tile_servers
 * and https://github.com/CartoDB/basemap-styles
 */
const MapContainer = ({ location }: RouteComponentProps) => {
  const parser = new Deserializer();

  const queryParams = parser.parseQuery(
    MapLocationQueryDecoder,
    location.search
  );

  const [viewport, setViewport] = useState({
    latitude: queryParams.lat ? queryParams.lat : KUMPULA_COORDS.lat,
    longitude: queryParams.lon ? queryParams.lon : KUMPULA_COORDS.lon,
    zoom: queryParams.lat ? DEFAULT_TRACKED_ZOOM : DEFAULT_NONTRACKED_ZOOM,
  });

  const [{ beacons, bluetoothName, lastKnownPosition }, setBeacons] = useState<
    BeaconsState
  >({
    beacons: [],
    bluetoothName: null,
    lastKnownPosition: null,
  });

  const refreshBeacons = (msg: string) => {
    const parsed = parser.deserializeMessage(msg);
    const geoBeacons = parsed.map(i => mqttMessageToGeo(i));

    const nextBluetoothName =
      geoBeacons.length > 0 && bluetoothName === null
        ? geoBeacons[0].beaconId
        : bluetoothName;

    const ourBeacon = geoBeacons.find(
      beacon => beacon.beaconId === nextBluetoothName
    );

    setBeacons({
      beacons: geoBeacons,
      bluetoothName: nextBluetoothName,
      lastKnownPosition:
        ourBeacon !== undefined && nextBluetoothName !== null
          ? ourBeacon
          : lastKnownPosition,
    });
  };

  useEffect(() => {
    if (!currentEnv.MAPBOX_TOKEN) {
      console.error('mapbox api token missing, falling back to raster maps...');
    }

    const ubiClient = new UbiMqtt(queryParams.host);
    console.log('connecting to ', queryParams.host);
    ubiClient.connect((error: any) => {
      if (error) {
        console.error('error connecting to ubi mqtt', error);
      } else {
        ubiClient.subscribe(
          queryParams.topic,
          null,
          (topic: string, msg: string) => {
            refreshBeacons(msg);
          },
          (err: any) => {
            if (err) {
              console.error('error during sub', err);
            }
          }
        );
      }
    });

    return () => {
      ubiClient.forceDisconnect(() => {
        console.log('disconnected from ubimqtt');
      });
    };
  }, []);

  const { userMarkers, nonUserMarkers } = divideMarkers(beacons, bluetoothName);

  const shouldShowOldPos = bluetoothName !== null && userMarkers.length === 0;

  const UserMarker = shouldShowOldPos ? OfflineMarker : Marker;
  const allUserMarkers =
    shouldShowOldPos && lastKnownPosition ? [lastKnownPosition] : userMarkers;

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
        {allUserMarkers.length &&
          allUserMarkers.map((marker, i) => (
            <UserMarker
              key={marker.beaconId + i}
              latitude={marker.lat}
              longitude={marker.lon}
              className="mapboxgl-user-location-dot"
            />
          ))}
        {nonUserMarkers.map((beacon, i) => (
          <NonUserMarker
            key={beacon.beaconId + i}
            latitude={beacon.lat}
            longitude={beacon.lon}
            className="mapboxgl-user-location-dot"
          />
        ))}
      </ReactMapGl>
    </Fullscreen>
  );
};

export default withRouter(MapContainer);
