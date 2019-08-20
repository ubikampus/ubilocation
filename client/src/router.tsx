import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import { Transition } from 'react-spring/renderprops';

import AboutContainer from './aboutContainer';
import {
  GenuineBusContainer,
  MockBusContainer,
} from './3dVisualisation/screenContainer';
import UrlPromptContainer from './location/urlPromptContainer';
import MapContainer from './map/mapContainer';
import AdminPanel, { RaspberryLocation } from './admin/adminPanel';
import { Location } from './common/typeUtil';
import NavBar from './common/navBar';

import LoginPromptContainer from './admin/loginPromptContainer';
import AuthApi, { Admin } from './admin/authApi';
import AdminTokenStore from './admin/adminTokenStore';
import ShareLocationApi, { Beacon } from './map/shareLocationApi';
import BeaconIdModal from './map/beaconIdModal';
import ShareLocationModal from './map/shareLocationModal';
import PublicShareModal from './map/publicShareModal';
import { parseQuery, MapLocationQueryDecoder } from './common/urlParse';
import { useUbiMqtt } from './location/mqttConnection';
import { BeaconGeoLocation } from './location/mqttDeserialize';
import { PinKind } from './map/marker';
import { fetchConfig, ClientConfig } from './common/environment';

const NotFound = () => <h3>404 page not found</h3>;

const Fullscreen = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainRow = styled.div`
  display: flex;
  height: 100%;
`;

export const isBeaconIdPromptOpen = (
  beaconId: string | null,
  isShareLocationModalOpen: boolean,
  isPublicShareOpen: boolean,
  isCentralizationButtonActive: boolean
) => {
  if (isCentralizationButtonActive) {
    return true;
  }

  if (isShareLocationModalOpen && beaconId === null) {
    return true;
  }

  if (isPublicShareOpen && beaconId === null) {
    return true;
  }

  return false;
};

interface Props {
  appConfig: ClientConfig;
}

const Router = ({ appConfig }: Props) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isAdminPanelOpen, openAdminPanel] = useState(false);
  const [getDeviceLocation, setDeviceLocation] = useState<Location | null>(
    null
  );
  const [devices, setDevices] = useState<RaspberryLocation[]>([]);
  const [newName, setNewName] = useState('');
  const [newHeight, setNewHeight] = useState('');
  const [roomReserved, setRoomReserved] = useState(false);
  const [isShareLocationModalOpen, openShareLocationModal] = useState(false);
  const [isShareLocationDropdownOpen, openShareLocationDropdown] = useState(
    false
  );
  const [publicShareOpen, openPublicShare] = useState(false);
  const [beaconId, setBeaconId] = useState<string | null>(null);
  const [beaconToken, setBeaconToken] = useState<string | null>(null);

  const setBeacon = (beacon: Beacon) => {
    setBeaconId(beacon.beaconId);
    setBeaconToken(beacon.token);
  };

  /**
   * Used when user selects "only current" from the location prompt.
   */
  const [staticLocations, setStaticLocations] = useState<BeaconGeoLocation[]>(
    []
  );

  const queryParams = parseQuery(
    MapLocationQueryDecoder,
    document.location.search
  );

  const fromQuery = !!(queryParams && queryParams.lat && queryParams.lon);
  const initialPinType = fromQuery ? 'show' : 'none';

  const [pinType, setPinType] = useState<PinKind>(initialPinType);

  const mqttHost =
    queryParams && queryParams.host ? queryParams.host : appConfig.MQTT_URL;
  const { beacons, lastKnownPosition } = useUbiMqtt(
    mqttHost,
    beaconId,
    queryParams && queryParams.topic ? queryParams.topic : undefined
  );

  const [centralizeActive, setCentralizeActive] = useState(
    queryParams && queryParams.lat ? true : false
  );

  useEffect(() => {
    const adminUser = AdminTokenStore.get();
    setAdmin(adminUser);
  }, []);

  return (
    <BrowserRouter>
      {isShareLocationModalOpen && beaconId && (
        <ShareLocationModal
          isOpen={isShareLocationModalOpen}
          onClose={() => openShareLocationModal(false)}
          currentBeaconId={beaconId}
        />
      )}
      {publicShareOpen && beaconId && (
        <PublicShareModal
          publishLocation={nickname => {
            // TODO
            console.log('publishing our location as user', nickname.payload);
            openPublicShare(false);
          }}
          onClose={() => openPublicShare(false)}
          isOpen={publicShareOpen}
        />
      )}
      {isBeaconIdPromptOpen(
        beaconId,
        isShareLocationModalOpen,
        publicShareOpen,
        centralizeActive
      ) && (
        <BeaconIdModal
          onClose={() => {
            setCentralizeActive(false);
            openShareLocationModal(false);
            openPublicShare(false);
          }}
          confirmId={async id => {
            const newBeacon = await ShareLocationApi.registerBeacon(id);
            setBeacon(newBeacon);
            setStaticLocations([]);
            setPinType('none');
            setCentralizeActive(false);
          }}
        />
      )}
      <Fullscreen>
        <NavBar
          isAdmin={admin != null}
          openAdminPanel={openAdminPanel}
          isAdminPanelOpen={isAdminPanelOpen}
          isShareLocationDropdownOpen={isShareLocationDropdownOpen}
          openShareLocationDropdown={openShareLocationDropdown}
          openShareLocationModal={openShareLocationModal}
          publicShareOpen={publicShareOpen}
          openPublicShare={openPublicShare}
        />
        <MainRow>
          <Route
            exact
            path="/"
            render={() => (
              <Transition
                items={isAdminPanelOpen}
                from={{ marginLeft: -350 }}
                enter={{ marginLeft: 0 }}
                leave={{ marginLeft: -350 }}
                config={{ mass: 1, tension: 275, friction: 25, clamp: true }}
              >
                {show =>
                  show &&
                  (props => (
                    <AdminPanel
                      style={props}
                      toggleRoomReservation={() =>
                        setRoomReserved(!roomReserved)
                      }
                      newHeight={newHeight}
                      setNewHeight={setNewHeight}
                      newName={newName}
                      onLogout={() => {
                        setAdmin(null);
                        AdminTokenStore.clear();
                        openAdminPanel(false);
                      }}
                      setNewName={setNewName}
                      onSubmit={_ => {
                        console.log(
                          'TODO: send to mqtt bus after signing the message'
                        );

                        if (admin) {
                          const message = JSON.stringify(devices);
                          AuthApi.sign(message, admin.token).then(
                            signedMessage => {
                              console.log('message:', message);
                              console.log('signedMessage:', signedMessage);
                            }
                          );
                        }
                      }}
                      onCancel={() => {
                        openAdminPanel(false);
                        setDeviceLocation(null);
                        setDevices([]);
                      }}
                      devices={devices}
                      setDevices={setDevices}
                      resetDeviceLocation={() => setDeviceLocation(null)}
                      getDeviceLocation={getDeviceLocation}
                    />
                  ))
                }
              </Transition>
            )}
          />

          <Switch>
            <Route
              exact
              path="/"
              render={props => (
                <MapContainer
                  {...props}
                  appConfig={appConfig}
                  isAdmin={admin !== null}
                  beacons={beacons}
                  pinType={pinType}
                  setPinType={setPinType}
                  lastKnownPosition={lastKnownPosition}
                  staticLocations={staticLocations}
                  setCentralizeActive={setCentralizeActive}
                  beaconId={beaconId}
                  roomReserved={roomReserved}
                  devices={devices}
                  getDeviceLocation={getDeviceLocation}
                  setDeviceLocation={setDeviceLocation}
                  isAdminPanelOpen={isAdminPanelOpen}
                />
              )}
            />
            <Route exact path="/config" component={UrlPromptContainer} />
            <Route exact path="/about" component={AboutContainer} />

            <Route
              exact
              path="/admin"
              render={props => (
                <LoginPromptContainer
                  {...props}
                  admin={admin}
                  setAdmin={setAdmin}
                />
              )}
            />

            <Route exact path="/mockviz" component={MockBusContainer} />
            <Route exact path="/viz" component={GenuineBusContainer} />

            {/* catch everything else */}
            <Route component={NotFound} />
          </Switch>
        </MainRow>
      </Fullscreen>
    </BrowserRouter>
  );
};

export default Router;
