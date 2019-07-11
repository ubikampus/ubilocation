import React, { useState, useEffect } from 'react';
import ReactMapGl, { Marker } from 'react-map-gl';
import Modal from 'react-modal';
import QRcode from 'qrcode.react';
import { RouteComponentProps, withRouter } from 'react-router';
import { default as UbiMqtt } from 'ubimqtt';
import styled from 'styled-components';
import partition from 'lodash/partition';
import queryString from 'query-string';

import { currentEnv } from '../common/environment';
import fallbackStyle from './fallbackMapStyle.json';
import Deserializer, {
  MapLocationQueryDecoder,
  BeaconGeoLocation,
  mqttMessageToGeo,
  MqttMessage,
} from '../location/mqttDeserialize';

Modal.setAppElement('#app');

const modalStyle = {
  content: {
    bottom: '50%',
    left: '20%',
    right: '20%',
    'text-align': 'center',
  },
};

const UrlModal = (props: any) => (
  <Modal
    isOpen={props.modalIsOpen}
    onRequestClose={props.closeModal}
    contentLabel="QR-code"
    style={modalStyle}
  >
    <a href={props.modalText}>{props.modalText}</a>
    <div>
      <QRcode value={props.modalText} size={256} />
    </div>
  </Modal>
);

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
): BeaconsState => {
  const geoBeacons = parsed.map(i => mqttMessageToGeo(i));

  const nextBluetoothName =
    geoBeacons.length > 0 && bluetoothName === null
      ? geoBeacons[0].beaconId
      : bluetoothName;

  const ourBeacon = geoBeacons.find(
    beacon => beacon.beaconId === nextBluetoothName
  );

  return {
    beacons: geoBeacons,
    bluetoothName: nextBluetoothName,
    lastKnownPosition:
      ourBeacon !== undefined && nextBluetoothName !== null
        ? ourBeacon
        : lastKnownPosition,
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

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalText, setModalText] = useState('');
  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

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

            setBeacons(nextBeacons);
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

  const onMapClick = (event: any) => {
    const url = document.location;

    const query = parser.parseQuery(MapLocationQueryDecoder, location.search);
    const [lon, lat] = event.lngLat;

    query.lat = lat;
    query.lon = lon;

    const updatedQueryString =
      url.origin + url.pathname + '?' + queryString.stringify(query);

    setModalText(updatedQueryString);
    openModal();
  };

  return (
    <Fullscreen>
      <UrlModal
        modalIsOpen={modalIsOpen}
        closeModal={closeModal}
        modalText={modalText}
      />
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
        onClick={onMapClick}
      >
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
