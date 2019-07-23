import React, { useState, useEffect } from 'react';
import { Marker } from 'react-map-gl';
import { Style, Layer } from 'mapbox-gl';
import axios from 'axios';
import produce from 'immer';

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
import { RaspberryLocation } from './adminPanel';
import {
  StaticUbiMarker,
  OfflineMarker,
  NonUserMarker,
  LocationPinMarker,
} from './marker';
import { Location } from '../common/typeUtil';
import { currentEnv } from '../common/environment';
import fallbackStyle from './fallbackMapStyle.json';
import geojsonSource from './roomSource.json';
import geojsonLayer from './roomLayer.json';

const KUMPULA_COORDS = { lat: 60.2046657, lon: 24.9621132 };
const DEFAULT_NONTRACKED_ZOOM = 17;
const STYLE_URL =
  'https://api.mapbox.com/styles/v1/ljljljlj/cjxf77ldr0wsz1dqmsl4zko9y';

/**
 * When user lands to the page with a position.
 */
const DEFAULT_TRACKED_ZOOM = 18;

const MapboxButton = styled.div`
  && {
    display: inline-block;
  }

  position: absolute;
  bottom: 50px;
  right: 10px;
  z-index: 1000;
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
  isAdminPanelOpen: boolean;
  getDeviceLocation: Location | null;
  setDeviceLocation(a: Location): void;
  devices: RaspberryLocation[];
  isAdmin: boolean;
  roomReserved: boolean;
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
  roomReserved,
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
  const [mapStyle, setMapStyle] = useState<Style | null>(null);
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

  useEffect(() => {
    const fetchStyle = async (token: string) => {
      const { data: style } = await axios.get<Style>(
        `${STYLE_URL}?${queryString.stringify({ access_token: token })}`
      );
      (style.sources as any).geojsonSource = geojsonSource;
      (style.layers as any).push(geojsonLayer);
      setMapStyle(style);
    };

    if (currentEnv.MAPBOX_TOKEN) {
      fetchStyle(currentEnv.MAPBOX_TOKEN);
    } else {
      // there might be some way to remove this type cast
      setMapStyle(fallbackStyle as Style);
    }
  }, []);

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

  const nextMapStyle =
    mapStyle === null
      ? null
      : produce(mapStyle, draft => {
          (draft.sources as any).geojsonSource.data.features[0].properties.colorMode = roomReserved
            ? 0
            : 1;
        });

  return (
    <>
      <MapboxButton className="mapboxgl-ctrl mapboxgl-ctrl-group">
        <button
          onClick={() => setNameModalOpen(true)}
          className="mapboxgl-ctrl-icon mapboxgl-ctrl-geolocate"
        />
      </MapboxButton>
      {nextMapStyle && (
        <UbikampusMap
          mapStyle={nextMapStyle}
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
          <LocationPinMarker
            coords={pinCoordinates}
            onClick={openModal}
            type={pinType}
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
        </UbikampusMap>
      )}
    </>
  );
};

export default withRouter(MapContainer);
