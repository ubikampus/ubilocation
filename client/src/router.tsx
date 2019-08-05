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
import { apiRoot } from './common/environment';
import MapContainer from './map/mapContainer';
import AdminPanel, { RaspberryLocation } from './admin/adminPanel';
import { Location } from './common/typeUtil';
import NavBar from './common/navBar';
import LoginPromptContainer from './admin/loginPromptContainer';
import AuthApi, { Admin } from './admin/authApi';

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

const Router = () => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isAdminPanelOpen, openAdminPanel] = useState(false);
  const [getDeviceLocation, setDeviceLocation] = useState<Location | null>(
    null
  );
  const [devices, setDevices] = useState<RaspberryLocation[]>([]);
  const [newName, setNewName] = useState('');
  const [newHeight, setNewHeight] = useState('');
  const [roomReserved, setRoomReserved] = useState(false);
  const [shareLocationModalOpen, openShareLocationModal] = useState(false);
  const [shareLocationDropdownOpen, openShareLocationDropdown] = useState(
    false
  );

  useEffect(() => {
    const loggedAdminUserJSON = window.localStorage.getItem(
      'loggedUbimapsAdmin'
    );

    if (loggedAdminUserJSON) {
      const adminUser = JSON.parse(loggedAdminUserJSON);
      setAdmin(adminUser);
    }
  }, []);

  return (
    <BrowserRouter basename={apiRoot()}>
      <Fullscreen>
        <NavBar
          isAdmin={admin != null}
          openAdminPanel={openAdminPanel}
          isAdminPanelOpen={isAdminPanelOpen}
          shareLocationDropdownOpen={shareLocationDropdownOpen}
          openShareLocationDropdown={openShareLocationDropdown}
          openShareLocationModal={openShareLocationModal}
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
                        window.localStorage.removeItem('loggedUbimapsAdmin');
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
                  roomReserved={roomReserved}
                  devices={devices}
                  getDeviceLocation={getDeviceLocation}
                  setDeviceLocation={setDeviceLocation}
                  isAdminPanelOpen={isAdminPanelOpen}
                  shareLocationModalOpen={shareLocationModalOpen}
                  openShareLocationModal={openShareLocationModal}
                />
              )}
            />
            <Route exact path="/config" component={UrlPromptContainer} />
            <Route exact path="/about" component={AboutContainer} />

            <Route
              exact
              path="/admin"
              render={props => (
                <LoginPromptContainer {...props} setAdmin={setAdmin} />
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
