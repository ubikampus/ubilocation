import React, { useState } from 'react';
import { Marker } from 'react-map-gl';
import { RouteComponentProps, withRouter } from 'react-router';

import applyMapboxColors from './shapeDraw/mapboxStyle';
import { CentralizationButton } from '../common/button';
import UbikampusMap, { flyToUserlocation } from './ubikampusMap';
import QrCodeModal from './qrCodeModal';
import { BeaconGeoLocation } from '../location/mqttDeserialize';
import { urlForLocation } from '../location/mqttConnection';
import { AndroidLocation } from '../admin/adminPanel';
import {
  StaticUbiMarker,
  OfflineMarker,
  NonUserMarker,
  SharedLocationMarker,
  LocationMarker,
  divideMarkers,
  PinKind,
} from './marker';
import { Location } from '../common/typeUtil';
import { Style } from 'mapbox-gl';
import { MapLocationQueryDecoder, parseQuery } from '../common/urlParse';
import { ClientConfig } from '../common/environment';

/**
 * When user lands to the page with a position. Probs not needed as env
 * variable..
 */
const DEFAULT_TRACKED_ZOOM = 18;

interface Props {
  appConfig: ClientConfig;
  beacons: BeaconGeoLocation[];
  beaconId: string | null;
  setCentralizeActive(a: boolean): void;
  pinType: PinKind;
  lastKnownPosition: BeaconGeoLocation | null;
  isAdminPanelOpen: boolean;
  isAdmin: boolean;
  getDeviceLocation: Location | null;
  setDeviceLocation(a: Location): void;
  devices: AndroidLocation[];
  setPinType(a: PinKind): void;
  roomReserved: boolean;
  staticLocations: BeaconGeoLocation[];
}

const MapContainer = ({
  appConfig,
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
  beaconId,
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
      : { lat: appConfig.INITIAL_LATITUDE, lon: appConfig.INITIAL_LONGITUDE };
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
        : appConfig.INITIAL_ZOOM,
  });

  const { isOnline, allUserMarkers, nonUserMarkers } = divideMarkers(
    beacons,
    beaconId,
    lastKnownPosition
  );

  const UserMarker = isOnline ? Marker : OfflineMarker;

  const staticMarkers = [...devices, ...staticLocations];

  const allStaticMarkers = getDeviceLocation
    ? [...staticMarkers, getDeviceLocation]
    : staticMarkers;

  const trackedBeaconId =
    queryParams && queryParams.track ? queryParams.track : null;

  const sharedLocationMarkers = trackedBeaconId
    ? nonUserMarkers.filter(b => b.beaconId === trackedBeaconId)
    : [];

  return (
    <>
      <CentralizationButton className="mapboxgl-ctrl mapboxgl-ctrl-group">
        <button
          onClick={() => {
            if (beaconId === null) {
              setCentralizeActive(true);
            } else {
              // Use first known user location.
              if (allUserMarkers.length > 0) {
                setViewport(flyToUserlocation(viewport, allUserMarkers[0]));
              }
            }
          }}
          className="mapboxgl-ctrl-icon mapboxgl-ctrl-geolocate"
        />
      </CentralizationButton>
      <UbikampusMap
        minZoom={appConfig.MINIMUM_ZOOM}
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
        <LocationMarker
          coords={pinCoordinates}
          onClick={openModal}
          onClose={() => setPinType('none')}
          type={pinType}
        />
        {allStaticMarkers.map((device, i) => (
          <StaticUbiMarker
            key={'android-' + i}
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
        {trackedBeaconId
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
