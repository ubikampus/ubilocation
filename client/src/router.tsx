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
import AdminPanel, { AndroidLocation } from './admin/adminPanel';
import { Location } from './common/typeUtil';
import NavBar from './common/navBar';

import LoginPromptContainer from './admin/loginPromptContainer';
import AuthApi, { Admin } from './admin/authApi';
import AdminTokenStore from './admin/adminTokenStore';
import ShareLocationApi, { Beacon } from './map/shareLocationApi';
import PublicBeaconList from './map/publicBeaconList';
import BeaconIdModal from './map/beaconIdModal';
import ShareLocationModal from './map/shareLocationModal';
import PublicShareModal from './map/publicShareModal';
import { parseQuery, MapLocationQueryDecoder } from './common/urlParse';
import { useUbiMqtt, lastKnownPosCache } from './location/mqttConnection';
import { BeaconGeoLocation } from './location/mqttDeserialize';
import { PinKind } from './map/marker';
import { ClientConfig } from './common/environment';

const inferLastKnownPosition = lastKnownPosCache();

const NotFound = () => <h3>404 page not found</h3>;

const Fullscreen = styled.div`
  display: flex;
  flex-direction: column;

  height: 100vh; /* fallback */
  height: calc(var(--vh, 1vh) * 100);

  overflow-x: hidden;
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
  const [devices, setDevices] = useState<AndroidLocation[]>([]);
  const [newName, setNewName] = useState('');
  const [newHeight, setNewHeight] = useState('');

  // setRoomReserved can be used for controlling room reservation status.
  // TODO: use genuine MQTT bus data for room reservation status
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

  const [publicBeacons, setPublicBeacons] = useState<PublicBeaconList>(
    new PublicBeaconList([])
  );

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
    queryParams && queryParams.host ? queryParams.host : appConfig.WEB_MQTT_URL;
  const beacons = useUbiMqtt(
    mqttHost,
    queryParams && queryParams.topic ? queryParams.topic : undefined
  );

  const lastKnownPosition = inferLastKnownPosition(beacons, beaconId);

  const [centralizeActive, setCentralizeActive] = useState(
    queryParams && queryParams.lat ? true : false
  );

  useEffect(() => {
    const fetchPublicBeacons = async () => {
      const pubBeacons = await ShareLocationApi.fetchPublicBeacons();
      const pubBeaconsList = new PublicBeaconList(pubBeacons);
      setPublicBeacons(pubBeaconsList);
    };

    const updateViewportHeight = () => {
      // 100vh hack for mobile https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
      // Without this, the content will overflow from the bottom.
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    window.addEventListener('resize', updateViewportHeight);
    const adminUser = AdminTokenStore.get();

    fetchPublicBeacons();
    setAdmin(adminUser);
    updateViewportHeight();
    return () => {
      window.removeEventListener('resize', updateViewportHeight);
    };
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
          publishLocation={async enable => {
            if (!beaconToken) {
              console.log('cannot publish: beacon token not set');
              return;
            }

            if (enable) {
              const pubBeacon = await ShareLocationApi.publish(beaconToken);
              publicBeacons.update(pubBeacon);

              console.log('published our location as user', pubBeacon.nickname);
            } else {
              try {
                console.log('disabling public location sharing');
                publicBeacons.remove(beaconId);
                await ShareLocationApi.unpublish(beaconId, beaconToken);
              } catch (e) {
                // The beacon we tried to remove doesn't exist on the server
                // This could happen, e.g. because the server was restarted
                console.log('cannot unpublish', beaconId);
                console.log(e.message());
              }
            }
          }}
          publicBeacon={publicBeacons.find(beaconId)}
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
                  publicBeacons={publicBeacons.asList()}
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
