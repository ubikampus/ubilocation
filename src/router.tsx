import React from 'react';
import { BrowserRouter, NavLink, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import btlogo from '../asset/bluetooth_logo.svg';
import AboutContainer from './aboutContainer';
import {
  GenuineBusContainer,
  MockBusContainer,
} from './visualization/screenContainer';
import UrlPromptContainer from './location/urlPromptContainer';
import { apiRoot } from './common/environment';
import MapContainer from './visualization/mapContainer';

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

/** For future use */
const Sidebar = styled.nav`
  height: 100%;
  width: 35px;
  z-index: -1000;
  right: 0;
  bottom: 0;
  position: fixed;
  overflow-x: hidden;
  padding-top: 20px;
  background-color: #111;
`;

const Router = () => {
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
        </NavContainer>

        <Switch>
          <Route exact path="/" component={MapContainer} />
          <Route exact path="/config" component={UrlPromptContainer} />
          <Route exact path="/about" component={AboutContainer} />

          <Route exact path="/mockviz" component={MockBusContainer} />
          <Route exact path="/viz" component={GenuineBusContainer} />

          {/* catch everything else */}
          <Route component={NotFound} />
        </Switch>
      </Fullscreen>
    </BrowserRouter>
  );
};

export default Router;
