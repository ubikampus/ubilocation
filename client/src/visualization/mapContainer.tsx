import React, { useState } from 'react';
import { Marker, Popup } from 'react-map-gl';

import { RouteComponentProps, withRouter } from 'react-router';
import styled from 'styled-components';
import partition from 'lodash/partition';
import queryString from 'query-string';

import { MQTT_URL } from '../location/urlPromptContainer';
import UbikampusMap from './ubikampusMap';
import QrCodeModal from './qrCodeModal';
import Deserializer, {
  MapLocationQueryDecoder,
  BeaconGeoLocation,
} from '../location/mqttDeserialize';
import { useUbiMqtt } from '../location/mqttConnection';
import BluetoothNameModal from './bluetoothNameModal';
import { RaspberryLocation } from './calibrationPanel';
import { StaticUbiMarker, OfflineMarker, NonUserMarker } from './marker';
import { Location } from '../common/typeUtil';

const KUMPULA_COORDS = { lat: 60.2046657, lon: 24.9621132 };
const DEFAULT_NONTRACKED_ZOOM = 17;

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

interface PinProps {
  type: 'configure' | 'show' | 'none';
  coords: any;
  onClick: any;
}

const LocationPinMarker = ({ type, coords, onClick }: PinProps) => {
  switch (type) {
    case 'configure':
      return (
        <Popup anchor="bottom" longitude={coords.lon} latitude={coords.lat}>
          <button onClick={onClick}>qr code</button>
        </Popup>
      );
    case 'show':
      return (
        <NonUserMarker
          latitude={coords.lat}
          longitude={coords.lon}
          className="mapboxgl-user-location-dot"
        />
      );
    case 'none':
      return null;
  }
};

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
  isAdminPanelOpen: boolean;
  getDeviceLocation: Location | null;
  setDeviceLocation(a: Location): void;
  devices: RaspberryLocation[];
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
  setDeviceLocation,
  isAdminPanelOpen,
  getDeviceLocation,
  devices,
}: RouteComponentProps & Props) => {
  const parser = new Deserializer();

  const queryParams =
    location.search === ''
      ? null
      : parser.parseQuery(MapLocationQueryDecoder, location.search);

  const fromQuery = !!(queryParams && queryParams.lat && queryParams.lon);
  const initialCoords =
    queryParams && queryParams.lat && queryParams.lon
      ? { lat: queryParams.lat, lon: queryParams.lon }
      : KUMPULA_COORDS;
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalText, setModalText] = useState('');
  const [nameSelection, setNameSelection] = useState<null | string>(null);

  const initialPinType = fromQuery ? 'show' : 'none';
  const [pinCoordinates, setPinCoordinates] = useState(initialCoords);
  const [pinType, setPinType] = useState<'configure' | 'show' | 'none'>(
    initialPinType
  );

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

      <UbikampusMap
        onClick={e => {
          const [lon, lat] = e.lngLat;

          if (isAdminPanelOpen) {
            setDeviceLocation({ lon, lat });
          } else {
            setModalText(urlForLocation(queryParams, lon, lat));
            setPinType('configure');
            setPinCoordinates({ lat, lon });
          }
        }}
        viewport={viewport}
        pointerCursor={isAdminPanelOpen}
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
        {[...devices, ...staticLocations].map((device, i) => (
          <StaticUbiMarker
            key={'raspberry-' + i}
            latitude={device.lat}
            longitude={device.lon}
          />
        ))}
        {getDeviceLocation && (
          <StaticUbiMarker
            latitude={getDeviceLocation.lat}
            longitude={getDeviceLocation.lon}
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

        <LocationPinMarker
          coords={pinCoordinates}
          onClick={openModal}
          type={pinType}
        />
      </UbikampusMap>
    </>
  );
};

export default withRouter(MapContainer);
