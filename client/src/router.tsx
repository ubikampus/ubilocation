import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import AboutContainer from './aboutContainer';
import SettingsContainer from './settingsContainer';
import MapContainer from './map/mapContainer';
import AdminPanel, { AndroidLocation } from './admin/adminPanel';
import { Location } from './common/typeUtil';
import NavBar from './common/navBar';
import LoginPromptContainer from './admin/loginPromptContainer';
import AdminApi, { Admin, formatAndroidLocations } from './admin/api';
import TokenStore, {
  ADMIN_STORE_ID,
  BEACON_STORE_ID,
} from './common/tokenStore';
import mqttClient from './common/mqttClient';
import ShareLocationApi, { Beacon } from './map/shareLocationApi';
import { PublicBeacon } from './map/shareLocationApi';
import PublicBeacons from './map/publicBeacons';
import BeaconIdModal, { isBeaconIdPromptOpen } from './map/beaconIdModal';
import ShareLocationModal from './map/shareLocationModal';
import PublicShareModal from './map/publicShareModal';
import { parseQuery, MapLocationQueryDecoder } from './common/urlParse';
import { useUbiMqtt, lastKnownPosCache } from './location/mqttConnection';
import { PinKind } from './map/marker';
import { ClientConfig } from './common/environment';
import Fullscreen, {
  FullscreenRow,
  useDynamicViewportHeight,
} from './map/fullscreen';

const inferLastKnownPosition = lastKnownPosCache();

const NotFound = () => <h3>404 page not found</h3>;

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

  const [isShareLocationModalOpen, openShareLocationModal] = useState(false);
  const [isShareLocationDropdownOpen, openShareLocationDropdown] = useState(
    false
  );
  const [publicShareOpen, openPublicShare] = useState(false);
  const [beaconId, setBeaconId] = useState<string | null>(null);
  const [beaconToken, setBeaconToken] = useState<string | null>(null);

  const setBeacon = (beacon: Beacon | null) => {
    if (beacon === null) {
      setBeaconId(null);
      setBeaconToken(null);
      return;
    }

    setBeaconId(beacon.beaconId);
    setBeaconToken(beacon.token);
  };

  const [publicBeacons, setPublicBeacons] = useState<PublicBeacon[]>([]);

  const queryParams = parseQuery(
    MapLocationQueryDecoder,
    document.location.search
  );

  const fromQuery = !!(queryParams.lat && queryParams.lon);
  const initialPinType = fromQuery ? 'show' : 'none';

  const [pinType, setPinType] = useState<PinKind>(initialPinType);

  const mqttHost = queryParams.host ? queryParams.host : appConfig.WEB_MQTT_URL;
  const beaconTopic = queryParams.topic ? queryParams.topic : undefined;
  const beacons = useUbiMqtt(mqttHost, beaconTopic);

  const lastKnownPosition = inferLastKnownPosition(beacons, beaconId);

  const [centralizeActive, setCentralizeActive] = useState(
    queryParams && queryParams.lat ? true : false
  );

  const [isSettingsModeActive, setSettingsModeActive] = useState(false);

  const adminTokenStore = new TokenStore<Admin>(ADMIN_STORE_ID);
  const beaconTokenStore = new TokenStore<Beacon>(BEACON_STORE_ID);

  useDynamicViewportHeight();

  useEffect(() => {
    const fetchPublicBeacons = async () => {
      const pubBeacons = await ShareLocationApi.fetchPublicBeacons();
      setPublicBeacons(pubBeacons);
    };

    fetchPublicBeacons();
    setAdmin(adminTokenStore.get());
    setBeacon(beaconTokenStore.get());
  }, []);

  return (
    <BrowserRouter>
      {beaconId && (
        <ShareLocationModal
          isOpen={isShareLocationModalOpen}
          onClose={() => openShareLocationModal(false)}
          currentBeaconId={beaconId}
        />
      )}
      {beaconId && (
        <PublicShareModal
          publishLocation={async enable => {
            if (!beaconToken) {
              console.log('cannot publish: beacon token not set');
              return;
            }

            if (enable) {
              const pubBeacon = await ShareLocationApi.publish(beaconToken);
              setPublicBeacons(PublicBeacons.update(publicBeacons, pubBeacon));
            } else {
              setPublicBeacons(PublicBeacons.remove(publicBeacons, beaconId));
              await ShareLocationApi.attemptUnpublish(beaconId, beaconToken);
            }
          }}
          publicBeacon={PublicBeacons.find(publicBeacons, beaconId)}
          onClose={() => openPublicShare(false)}
          isOpen={publicShareOpen}
        />
      )}
      {isBeaconIdPromptOpen(
        beaconId,
        isShareLocationModalOpen,
        publicShareOpen,
        centralizeActive,
        isSettingsModeActive
      ) && (
        <BeaconIdModal
          onClose={() => {
            setCentralizeActive(false);
            openShareLocationModal(false);
            openPublicShare(false);
            setSettingsModeActive(false);
          }}
          confirmId={async id => {
            const newBeacon = await ShareLocationApi.registerBeacon(id);
            setBeacon(newBeacon);
            beaconTokenStore.set(newBeacon);
            setPinType('none');
            setCentralizeActive(false);
            setSettingsModeActive(false);
          }}
          currentBeaconId={beaconId}
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
        <FullscreenRow>
          <Route
            exact
            path="/"
            render={() => (
              <AdminPanel
                newHeight={newHeight}
                isAdminPanelOpen={isAdminPanelOpen}
                setNewHeight={setNewHeight}
                newName={newName}
                onLogout={() => {
                  setAdmin(null);
                  adminTokenStore.clear();
                  openAdminPanel(false);
                }}
                setNewName={setNewName}
                onSubmit={async _ => {
                  if (admin) {
                    const message = formatAndroidLocations(devices);
                    const signedMsg = await AdminApi.sign(message, admin.token);

                    mqttClient.sendAndroidLocations(
                      appConfig.WEB_MQTT_URL,
                      JSON.stringify(signedMsg)
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
                  setCentralizeActive={setCentralizeActive}
                  beaconId={beaconId}
                  devices={devices}
                  getDeviceLocation={getDeviceLocation}
                  setDeviceLocation={setDeviceLocation}
                  isAdminPanelOpen={isAdminPanelOpen}
                  publicBeacons={publicBeacons}
                />
              )}
            />

            <Route
              exact
              path="/settings"
              render={props => (
                <SettingsContainer
                  {...props}
                  setSettingsModeActive={setSettingsModeActive}
                />
              )}
            />

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

            {/* catch everything else */}
            <Route component={NotFound} />
          </Switch>
        </FullscreenRow>
      </Fullscreen>
    </BrowserRouter>
  );
};

export default Router;
