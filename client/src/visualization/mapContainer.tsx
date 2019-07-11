import React, { useState, useEffect } from 'react';
import { Marker } from 'react-map-gl';
import { RouteComponentProps, withRouter } from 'react-router';
import { default as UbiMqtt } from 'ubimqtt';
import styled from 'styled-components';
import partition from 'lodash/partition';
import UbikampusMap from './ubikampusMap';

import { currentEnv } from '../common/environment';
import Deserializer, {
  MapLocationQueryDecoder,
  BeaconGeoLocation,
  mqttMessageToGeo,
  MqttMessage,
} from '../location/mqttDeserialize';
import BluetoothNameModal from './bluetoothNameModal';

const KUMPULA_COORDS = { lat: 60.2046657, lon: 24.9621132 };
const DEFAULT_NONTRACKED_ZOOM = 12;

/**
 * When user lands to the page with a position.
 */
const DEFAULT_TRACKED_ZOOM = 18;

const MapboxButton = styled.div`
  && {
    display: inline-block;
  }

  position: absolute;
  top: 20px;
  right: 10px;
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
    <UbikampusMap viewport={viewport} setViewport={setViewport}>
      <MapboxButton className="mapboxgl-ctrl mapboxgl-ctrl-group">
        <button
          onClick={() => setNameModalOpen(true)}
          className="mapboxgl-ctrl-icon mapboxgl-ctrl-geolocate"
        />
      </MapboxButton>
      <BluetoothNameModal
        isOpen={nameModalOpen}
        beacons={beacons}
        setBluetoothName={name => {
          setBluetoothName(name);
          setNameModalOpen(false);
        }}
      />
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
    </UbikampusMap>
  );
};

export default withRouter(MapContainer);
