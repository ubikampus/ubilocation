import React, { useState, useEffect } from 'react';
import { BrowserRouter, NavLink, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import Button from './visualization/button';
import btlogo from '../asset/bluetooth_logo.svg';
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
import LoginPromptContainer from './visualization/loginPromptContainer';
import { Admin } from './visualization/authServerService';

const NotFound = () => <h3>404 page not found</h3>;

const Fullscreen = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const NavContainer = styled.nav`
  height: 48px;
  width: 100%;
  display: flex;
  z-index: 1000;
  align-items: center;
  justify-content: flex-start;
  background-color: #4287f5;
  font-family: 'Comfortaa', cursive;
  font-size: 13px;
`;

const Logo = styled.div`
  height: 25px;
  width: 25px;
  margin-left: 1em;
  margin-right: 1em;
  background-image: url("${btlogo}");
`;

const Items = styled.ul`
  display: flex;
  width: 100%;
  align-items: center;
  list-style-type: none;
`;

const LinkBox = styled(NavLink)`
  &.active {
    > li {
      color: #ffffff;
      border-bottom: 3px solid #ffffff;
    }
  }
`;

const Content = styled.li`
  text-align: center;
  padding: 15px;
  color: #bed4f7;
  border-top: 3px solid transparent;
  border-bottom: 3px solid transparent;
  &:active {
    color: #ffffff;
    border-bottom: 3px solid #ffffff;
  }
  &:hover {
    color: #ffffff;
  }
`;

const Search = styled.input`
  padding: 0.5em;
  margin: 1.5em;
  color: #ffffff;
  border: none;
  border-radius: 20px;
  background: #68a0fc;
  text-align: left;
  ::placeholder {
    color: #ffffff;
    padding-left: 1em;
    padding-right: 1em;
    font-size: 12px;
    opacity: 1;
  }
`;

const Sidebar = styled.nav`
  width: 350px;
  height: 100%;
  z-index: 1001;

  overflow-x: hidden;
  background-color: white;
`;

const AdminChip = styled.div`
  margin-right: 15px;
  white-space: pre;
  text-transform: uppercase;
  font-weight: 700;
  color: white;
`;

const LogOutButton = styled(Button)`
  background: #e9e9e9;
  white-space: pre;
`;

const MainRow = styled.div`
  display: flex;
  height: 100%;
`;

const Router = () => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [calibrationPanelOpen, setCalibrationPanelOpen] = useState(false);
  const [raspberryLocation, setRaspberryLocation] = useState<Location | null>(
    null
  );
  const [raspberryDevices, setRaspberryDevies] = useState<RaspberryLocation[]>(
    []
  );
  const [newName, setNewName] = useState('');
  const [newHeight, setNewHeight] = useState('');

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
        <NavContainer>
          <Items>
            <Logo />
            <LinkBox to="/" exact>
              <Content>Map</Content>
            </LinkBox>
            <LinkBox to="/config">
              <Content>Settings</Content>
            </LinkBox>
            <LinkBox to="/about">
              <Content>About</Content>
            </LinkBox>
          </Items>
          <Search placeholder="Search .." />
          {admin && (
            <>
              <AdminChip>admin mode</AdminChip>
              <LogOutButton
                onClick={() => {
                  setAdmin(null);
                  window.localStorage.removeItem('loggedUbimapsAdmin');
                }}
              >
                Log out
              </LogOutButton>
            </>
          )}
        </NavContainer>

        <MainRow>
          {calibrationPanelOpen && (
            <Sidebar>
              <CalibrationPanel
                newHeight={newHeight}
                setNewHeight={setNewHeight}
                newName={newName}
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
            </Sidebar>
          )}

          <Switch>
            <Route
              exact
              path="/"
              render={props => (
                <MapContainer
                  {...props}
                  raspberryDevices={raspberryDevices}
                  raspberryLocation={raspberryLocation}
                  isAdmin={admin != null}
                  setRaspberryLocation={setRaspberryLocation}
                  calibrationPanelOpen={calibrationPanelOpen}
                  setCalibrationPanelOpen={setCalibrationPanelOpen}
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
