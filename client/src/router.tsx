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
  const [isAdmin, setIsAdmin] = useState(true);
  const [calibrationPanelOpen, setCalibrationPanelOpen] = useState(false);
  const [raspberryLocation, setRaspberryLocation] = useState<Location | null>(
    null
  );
  const [raspberryDevices, setRaspberryDevies] = useState<RaspberryLocation[]>(
    []
  );
  const [newName, setNewName] = useState('');
  const [newHeight, setNewHeight] = useState('');

  return (
    <BrowserRouter basename={apiRoot()}>
      <Fullscreen>
        <NavBar
          isAdmin={isAdmin}
          setCalibrationPanelOpen={setCalibrationPanelOpen}
          calibrationPanelOpen={calibrationPanelOpen}
        />
        <MainRow>
          <Route
            exact
            path="/"
            render={() =>
              calibrationPanelOpen && (
                <CalibrationPanel
                  newHeight={newHeight}
                  setNewHeight={setNewHeight}
                  newName={newName}
                  onLogout={() => {
                    setIsAdmin(false); // TODO: actually logout
                    setCalibrationPanelOpen(false);
                  }}
                  setNewName={setNewName}
                  onSubmit={devices => {
                    console.log(
                      'TODO: sent to mqtt bus after signing the message'
                    );
                  }}
                  onCancel={() => {
                    setCalibrationPanelOpen(false);
                    setRaspberryLocation(null);
                    setRaspberryDevies([]);
                  }}
                  raspberryDevices={raspberryDevices}
                  setRaspberryDevices={setRaspberryDevies}
                  raspberryLocation={raspberryLocation}
                  resetRaspberryLocation={() => setRaspberryLocation(null)}
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
                  raspberryDevices={raspberryDevices}
                  raspberryLocation={raspberryLocation}
                  setRaspberryLocation={setRaspberryLocation}
                  calibrationPanelOpen={calibrationPanelOpen}
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
