import React, { useState } from 'react';
import { Marker } from 'react-map-gl';
import { RouteComponentProps, withRouter } from 'react-router';

import applyMapboxColors from './shapeDraw/mapboxStyle';
import { MapboxButton as CentralizationButton } from '../common/button';
import UbikampusMap, { flyToUserlocation } from './ubikampusMap';
import QrCodeModal from './qrCodeModal';
import { BeaconGeoLocation } from '../location/mqttDeserialize';
import { urlForLocation } from '../location/mqttConnection';
import { RaspberryLocation } from '../admin/adminPanel';
import {
  StaticUbiMarker,
  OfflineMarker,
  NonUserMarker,
  SharedLocationMarker,
  LocationPinMarker,
  divideMarkers,
  PinKind,
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
  beacons: BeaconGeoLocation[];
  bluetoothName: string | null;
  setCentralizeActive(a: boolean): void;
  pinType: PinKind;
  lastKnownPosition: BeaconGeoLocation | null;
  isAdminPanelOpen: boolean;
  isAdmin: boolean;
  getDeviceLocation: Location | null;
  setDeviceLocation(a: Location): void;
  devices: RaspberryLocation[];
  setPinType(a: PinKind): void;
  roomReserved: boolean;
  staticLocations: BeaconGeoLocation[];
}

const MapContainer = ({
  location,
  setDeviceLocation,
  isAdminPanelOpen,
  isAdmin,
  getDeviceLocation,
  beacons,
  devices,
  staticLocations,
  lastKnownPosition,
  roomReserved,
  setPinType,
  bluetoothName,
  pinType,
  setCentralizeActive,
}: RouteComponentProps & Props) => {
  const queryParams =
    location.search === ''
      ? null
      : parseQuery(MapLocationQueryDecoder, location.search);

  const initialCoords =
    queryParams && queryParams.lat && queryParams.lon
      ? { lat: queryParams.lat, lon: queryParams.lon }
      : KUMPULA_COORDS;
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const mapStyle = applyMapboxColors(roomReserved);
  const [modalText, setModalText] = useState('');

  const [pinCoordinates, setPinCoordinates] = useState(initialCoords);

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
      <CentralizationButton className="mapboxgl-ctrl mapboxgl-ctrl-group">
        <button
          onClick={() => {
            if (bluetoothName === null) {
              setCentralizeActive(true);
            } else {
              // Use first known user location.
              setViewport(flyToUserlocation(viewport, allUserMarkers[0]));
            }
          }}
          className="mapboxgl-ctrl-icon mapboxgl-ctrl-geolocate"
        />
      </CentralizationButton>
      <UbikampusMap
        mapStyle={mapStyle as Style}
        onClick={e => {
          const [lon, lat] = e.lngLat;

          if (isAdminPanelOpen) {
            setDeviceLocation({ lon, lat });
          } else if (isAdmin) {
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
        <LocationPinMarker
          coords={pinCoordinates}
          onClick={openModal}
          onClose={() => setPinType('none')}
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
