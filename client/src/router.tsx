import React, { useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import { Transition } from 'react-spring/renderprops';
import { config } from 'react-spring';
import AboutContainer from './aboutContainer';
import {
  GenuineBusContainer,
  MockBusContainer,
} from './visualization/screenContainer';
import UrlPromptContainer from './location/urlPromptContainer';
import { apiRoot } from './common/environment';
import MapContainer from './visualization/mapContainer';
import CalibrationPanel, {
  RaspberryLocation,
} from './visualization/adminPanel';
import { Location } from './common/typeUtil';
import NavBar from './common/navBar';

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
  // TODO: authenticate with auth-server
  const [isAdmin, setAdminMode] = useState(true);
  const [isAdminPanelOpen, openAdminPanel] = useState(false);
  const [getDeviceLocation, setDeviceLocation] = useState<Location | null>(
    null
  );
  const [devices, setDevices] = useState<RaspberryLocation[]>([]);
  const [newName, setNewName] = useState('');
  const [newHeight, setNewHeight] = useState('');
  const [roomReserved, setRoomReserved] = useState(false);

  return (
    <BrowserRouter basename={apiRoot()}>
      <Fullscreen>
        <NavBar
          isAdmin={isAdmin}
          openAdminPanel={openAdminPanel}
          isAdminPanelOpen={isAdminPanelOpen}
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
                    <CalibrationPanel
                      style={props}
                      toggleRoomReservation={() =>
                        setRoomReserved(!roomReserved)
                      }
                      newHeight={newHeight}
                      setNewHeight={setNewHeight}
                      newName={newName}
                      onLogout={() => {
                        setAdminMode(false); // TODO: actually logout
                        openAdminPanel(false);
                      }}
                      setNewName={setNewName}
                      onSubmit={rasps => {
                        console.log(
                          'TODO: sent to mqtt bus after signing the message'
                        );
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
                  isAdmin={isAdmin}
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
