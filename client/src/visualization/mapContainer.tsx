import React, { useState, useEffect } from 'react';
import { Marker, PointerEvent } from 'react-map-gl';

import { RouteComponentProps, withRouter } from 'react-router';
import { default as UbiMqtt } from 'ubimqtt';
import styled from 'styled-components';
import partition from 'lodash/partition';
import queryString from 'query-string';

import { MQTT_URL, DEFAULT_TOPIC } from '../location/urlPromptContainer';
import UbikampusMap from './ubikampusMap';
import { currentEnv } from '../common/environment';
import QrCodeModal from './qrCodeModal';
import Deserializer, {
  MapLocationQueryDecoder,
  BeaconGeoLocation,
  mqttMessageToGeo,
  MqttMessage,
} from '../location/mqttDeserialize';
import { useUbiMqtt } from '../location/mqttConnection';
import BluetoothNameModal from './bluetoothNameModal';
import raspberryLogo from '../../asset/rasp.png';
import { RaspberryLocation } from './calibrationPanel';
import { StaticUbiMarker, OfflineMarker, NonUserMarker } from './marker';
import { Location } from '../common/typeUtil';

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
  top: 80px;
  right: 10px;
  z-index: 1000;
`;

const CalibrateButton = styled(MapboxButton)`
  top: 120px;
`;

const CalibrateButtonInset = styled.button`
  && {
    padding: 4px;
  }
`;

const CalibrateIcon = styled.div`
  height: 100%;
  background-image: url("${raspberryLogo}");
  background-size: contain;
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

export const urlForLocation = (
  queryParams: object | null,
  lon: number,
  lat: number
) => {
  const url = document.location;

  const nextQ = queryParams ? { ...queryParams, lat, lon } : { lat, lon };

  const updatedQueryString =
    url.origin + url.pathname + '?' + queryString.stringify(nextQ);

  return updatedQueryString;
};

interface Props {
  isAdmin: boolean;
  calibrationPanelOpen: boolean;
  raspberryLocation: Location | null;
  setCalibrationPanelOpen(a: boolean): void;
  setRaspberryLocation(a: Location): void;
  raspberryDevices: RaspberryLocation[];
}

/**
 * Use default Mapbox vector tiles if MAPBOX_TOKEN is found, otherwise fallback
 * to free Carto Light raster map.
 *
 * See https://wiki.openstreetmap.org/wiki/Tile_servers
 * and https://github.com/CartoDB/basemap-styles
 */
const MapContainer = ({
  location,
  isAdmin,
  setCalibrationPanelOpen,
  setRaspberryLocation,
  calibrationPanelOpen,
  raspberryLocation,
  raspberryDevices,
}: RouteComponentProps & Props) => {
  const parser = new Deserializer();

  const queryParams =
    location.search === ''
      ? null
      : parser.parseQuery(MapLocationQueryDecoder, location.search);

  const initialCoords =
    queryParams && queryParams.lat && queryParams.lon
      ? { lat: queryParams.lat, lon: queryParams.lon }
      : KUMPULA_COORDS;
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalText, setModalText] = useState('');
  const [nameSelection, setNameSelection] = useState<null | string>(null);

  /**
   * Used when user selects "only current" from the location prompt.
   */
  const [staticLocations, setStaticLocations] = useState<BeaconGeoLocation[]>(
    []
  );
  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const [viewport, setViewport] = useState({
    latitude: initialCoords.lat,
    longitude: initialCoords.lon,
    zoom:
      queryParams && queryParams.lat
        ? DEFAULT_TRACKED_ZOOM
        : DEFAULT_NONTRACKED_ZOOM,
  });

  const [nameModalOpen, setNameModalOpen] = useState(
    queryParams && queryParams.lat ? true : false
  );

  const mqttHost =
    queryParams && queryParams.host ? queryParams.host : MQTT_URL;
  const [bluetoothName, setBluetoothName] = useState<string | null>(null);
  const { beacons, lastKnownPosition } = useUbiMqtt(
    mqttHost,
    bluetoothName,
    queryParams && queryParams.topic ? queryParams.topic : undefined
  );

  const { isOnline, allUserMarkers, nonUserMarkers } = divideMarkers(
    beacons,
    bluetoothName,
    lastKnownPosition
  );

  const UserMarker = isOnline ? Marker : OfflineMarker;

  return (
    <>
      <MapboxButton className="mapboxgl-ctrl mapboxgl-ctrl-group">
        <button
          onClick={() => setNameModalOpen(true)}
          className="mapboxgl-ctrl-icon mapboxgl-ctrl-geolocate"
        />
      </MapboxButton>
      {isAdmin && (
        <CalibrateButton className="mapboxgl-ctrl mapboxgl-ctrl-group">
          <CalibrateButtonInset
            onClick={() => {
              setCalibrationPanelOpen(!calibrationPanelOpen);
            }}
          >
            <CalibrateIcon />
          </CalibrateButtonInset>
        </CalibrateButton>
      )}

      <UbikampusMap
        onClick={e => {
          const [lon, lat] = e.lngLat;

          if (calibrationPanelOpen) {
            setRaspberryLocation({ lon, lat });
          } else {
            setModalText(urlForLocation(queryParams, lon, lat));
            openModal();
          }
        }}
        viewport={viewport}
        pointerCursor={calibrationPanelOpen}
        setViewport={setViewport}
      >
        <QrCodeModal
          modalIsOpen={modalIsOpen}
          closeModal={closeModal}
          modalText={modalText}
        />
        <BluetoothNameModal
          promptForName // TODO: Don't prompt if web bluetooth succeeds.
          setStaticLocation={name => {
            const targetBeacons = beacons.filter(b => b.beaconId === name);
            setStaticLocations(targetBeacons);
          }}
          isOpen={nameModalOpen}
          closeModal={() => setNameModalOpen(false)}
          beacons={beacons}
          nameSelection={nameSelection}
          setNameSelection={setNameSelection}
          setBluetoothName={name => {
            setBluetoothName(name);
            setNameModalOpen(false);
          }}
        />
        {[...raspberryDevices, ...staticLocations].map((device, i) => (
          <StaticUbiMarker
            key={'raspberry-' + i}
            latitude={device.lat}
            longitude={device.lon}
          />
        ))}
        {raspberryLocation && (
          <StaticUbiMarker
            latitude={raspberryLocation.lat}
            longitude={raspberryLocation.lon}
          />
        )}
        {allUserMarkers.map((marker, i) => (
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
    </>
  );
};

export default withRouter(MapContainer);
