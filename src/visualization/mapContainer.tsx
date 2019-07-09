import React, { useState, useEffect } from 'react';
import ReactMapGl, { Marker } from 'react-map-gl';
import { RouteComponentProps, withRouter } from 'react-router';
import { default as UbiMqtt } from 'ubimqtt';
import styled from 'styled-components';
import partition from 'lodash/partition';
import Modal from 'react-modal';

import { currentEnv } from '../common/environment';
import fallbackStyle from './fallbackMapStyle.json';
import Deserializer, {
  MapLocationQueryDecoder,
  BeaconGeoLocation,
  mqttMessageToGeo,
  MqttMessage,
} from '../location/mqttDeserialize';

const KUMPULA_COORDS = { lat: 60.2046657, lon: 24.9621132 };
const DEFAULT_NONTRACKED_ZOOM = 12;

/**
 * When user lands to the page with a position.
 */
const DEFAULT_TRACKED_ZOOM = 18;

const NameHeader = styled.h3`
  margin-top: 0;
`;

const NameList = styled.ul`
  list-style: none;
  padding-left: 13px;
`;

const BluetoothName = styled.li`
  cursor: pointer;
  margin: 10px 0;
`;

const MapboxButton = styled.div`
  && {
    display: inline-block;
  }

  position: absolute;
  top: 20px;
  right: 10px;
`;

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
  bluetoothName: string | null,
  lastKnownPosition: BeaconGeoLocation | null
) => {
  const [userMarkers, nonUserMarkers] = partition(
    beacons,
    beacon => beacon.beaconId === bluetoothName
  );

  const allUserMarkers =
    lastKnownPosition && userMarkers.length === 0
      ? [lastKnownPosition]
      : userMarkers;

  return { isOnline: userMarkers.length !== 0, allUserMarkers, nonUserMarkers };
};

export const refreshBeacons = (
  parsed: MqttMessage[],
  bluetoothName: string | null,
  lastKnownPosition: BeaconGeoLocation | null
) => {
  const geoBeacons = parsed.map(i => mqttMessageToGeo(i));

  const ourBeacon = geoBeacons.find(
    beacon => beacon.beaconId === bluetoothName
  );

  return {
    beacons: geoBeacons,
    lastKnownPosition: ourBeacon !== undefined ? ourBeacon : lastKnownPosition,
  };
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

  const [nameModalOpen, setNameModalOpen] = useState(false);

  const [beacons, setBeacons] = useState<BeaconGeoLocation[]>([]);
  const [bluetoothName, setBluetoothName] = useState<null | string>(null);
  const [
    lastKnownPosition,
    setLastKnownPosition,
  ] = useState<null | BeaconGeoLocation>(null);

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
            const nextBeacons = refreshBeacons(
              parser.deserializeMessage(msg),
              bluetoothName,
              lastKnownPosition
            );

            setBeacons(nextBeacons.beacons);
            setLastKnownPosition(nextBeacons.lastKnownPosition);
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

  const { isOnline, allUserMarkers, nonUserMarkers } = divideMarkers(
    beacons,
    bluetoothName,
    lastKnownPosition
  );

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
        <MapboxButton className="mapboxgl-ctrl mapboxgl-ctrl-group">
          <button
            onClick={() => setNameModalOpen(true)}
            className="mapboxgl-ctrl-icon mapboxgl-ctrl-geolocate"
          />
        </MapboxButton>
        <Modal
          style={{
            overlay: {
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start',
            },
            content: {
              maxHeight: '80vh',
              maxWidth: '400px',
              position: 'static',
              margin: '20px 10px',
            },
          }}
          isOpen={nameModalOpen}
        >
          <NameHeader>Device select</NameHeader>
          <p>
            Please make sure the device bluetooth visibility is on, and select
            your bluetooth name:
          </p>
          <NameList>
            {beacons
              .sort((a, b) =>
                a.beaconId.localeCompare(b.beaconId, undefined, {
                  numeric: true,
                })
              )
              .map((beacon, i) => (
                <BluetoothName
                  key={beacon.beaconId + i}
                  onClick={() => {
                    setBluetoothName(beacon.beaconId);
                    setNameModalOpen(false);
                  }}
                >
                  {beacon.beaconId}
                </BluetoothName>
              ))}
          </NameList>
        </Modal>
        {allUserMarkers.length &&
          allUserMarkers.map((marker, i) => (
            <UserMarker
              key={i}
              latitude={marker.lat}
              longitude={marker.lon}
              className="mapboxgl-user-location-dot"
            />
          ))}
        {nonUserMarkers.map((beacon, i) => (
          <NonUserMarker
            key={i}
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
