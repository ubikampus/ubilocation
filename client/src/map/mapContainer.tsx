import React, { useState } from 'react';
import { Marker } from 'react-map-gl';

import { RouteComponentProps, withRouter } from 'react-router';

import TrackingContainer from './trackingContainer';
import applyMapboxColors from './shapeDraw/mapboxStyle';
import { MapboxButton } from '../common/button';
import { MQTT_URL } from '../location/urlPromptContainer';
import UbikampusMap from './ubikampusMap';
import QrCodeModal from './qrCodeModal';
import { BeaconGeoLocation } from '../location/mqttDeserialize';
import { useUbiMqtt, urlForLocation } from '../location/mqttConnection';
import { RaspberryLocation } from '../admin/adminPanel';
import {
  StaticUbiMarker,
  OfflineMarker,
  NonUserMarker,
  SharedLocationMarker,
  LocationPinMarker,
  divideMarkers,
} from './marker';
import { Location } from '../common/typeUtil';
import { Style } from 'mapbox-gl';
import { MapLocationQueryDecoder, parseQuery } from '../common/urlParse';

const KUMPULA_COORDS = { lat: 60.2046657, lon: 24.9621132 };
const DEFAULT_NONTRACKED_ZOOM = 17;

/**
 * When user lands to the page with a position.
 */
const DEFAULT_TRACKED_ZOOM = 18;

interface Props {
  bluetoothName: string | null;
  nameModalOpen: boolean;
  setNameModalOpen(a: boolean): void;
  setBluetoothName(a: string | null): void;
  isAdminPanelOpen: boolean;
  getDeviceLocation: Location | null;
  setDeviceLocation(a: Location): void;
  devices: RaspberryLocation[];
  roomReserved: boolean;
}

const MapContainer = ({
  location,
  setDeviceLocation,
  isAdminPanelOpen,
  getDeviceLocation,
  devices,
  roomReserved,
  bluetoothName,
  setBluetoothName,
  nameModalOpen,
  setNameModalOpen,
}: RouteComponentProps & Props) => {
  const queryParams =
    location.search === ''
      ? null
      : parseQuery(MapLocationQueryDecoder, location.search);

  const fromQuery = !!(queryParams && queryParams.lat && queryParams.lon);
  const initialCoords =
    queryParams && queryParams.lat && queryParams.lon
      ? { lat: queryParams.lat, lon: queryParams.lon }
      : KUMPULA_COORDS;
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const mapStyle = applyMapboxColors(roomReserved);
  const [modalText, setModalText] = useState('');

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

  const mqttHost =
    queryParams && queryParams.host ? queryParams.host : MQTT_URL;
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

  const staticMarkers = [...devices, ...staticLocations];

  const allStaticMarkers = getDeviceLocation
    ? [...staticMarkers, getDeviceLocation]
    : staticMarkers;

  const trackedBtName =
    queryParams && queryParams.track ? queryParams.track : null;

  const sharedLocationMarkers = trackedBtName
    ? nonUserMarkers.filter(b => b.beaconId === trackedBtName)
    : [];

  return (
    <>
      <MapboxButton className="mapboxgl-ctrl mapboxgl-ctrl-group">
        <button
          onClick={() => setNameModalOpen(true)}
          className="mapboxgl-ctrl-icon mapboxgl-ctrl-geolocate"
        />
      </MapboxButton>
      <UbikampusMap
        mapStyle={mapStyle as Style}
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
        {nameModalOpen && (
          <TrackingContainer
            beacons={beacons}
            onClose={() => setNameModalOpen(false)}
            confirmName={name => {
              setBluetoothName(name);
              setStaticLocations([]);
              setPinType('none');
              setNameModalOpen(false);
            }}
            onStaticSelected={name => {
              const targetBeacons = beacons.filter(b => b.beaconId === name);
              setStaticLocations(targetBeacons);
            }}
          />
        )}
        <LocationPinMarker
          coords={pinCoordinates}
          onClick={openModal}
          type={pinType}
        />
        {allStaticMarkers.map((device, i) => (
          <StaticUbiMarker
            key={'raspberry-' + i}
            latitude={device.lat}
            longitude={device.lon}
          />
        ))}
        {allUserMarkers.map((marker, i) => (
          <UserMarker
            key={i}
            latitude={marker.lat}
            longitude={marker.lon}
            className="mapboxgl-user-location-dot"
          />
        ))}
        {trackedBtName
          ? sharedLocationMarkers.map((beacon, i) => (
              <SharedLocationMarker
                key={'sharedLocationMarker-' + i}
                latitude={beacon.lat}
                longitude={beacon.lon}
                className="mapboxgl-user-location-dot"
              />
            ))
          : nonUserMarkers.map((beacon, i) => (
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
