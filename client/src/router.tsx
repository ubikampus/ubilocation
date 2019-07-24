import React, { useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
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
} from './visualization/calibrationPanel';
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
            render={() =>
              isAdminPanelOpen && (
                <CalibrationPanel
                  newHeight={newHeight}
                  setNewHeight={setNewHeight}
                  newName={newName}
                  onLogout={() => {
                    setAdminMode(false); // TODO: actually logout
                    openAdminPanel(false);
                  }}
                  setNewName={setNewName}
                  onSubmit={devices => {
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
                  getDeviceLocation={getDeviceLocation}
                  resetDeviceLocation={() => setDeviceLocation(null)}
                />
              )
            }
          />

          <Switch>
            <Route
              exact
              path="/"
              render={props => (
                <MapContainer
                  {...props}
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
