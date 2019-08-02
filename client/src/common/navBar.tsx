import React from 'react';
import styled from 'styled-components';
import { NavLink, withRouter, RouteComponentProps } from 'react-router-dom';
import { TiCog, TiLocationArrow } from 'react-icons/ti';
import btlogo from '../../asset/bluetooth_logo.svg';

const AdminCog = styled.div`
  color: white;
  height: auto;
  width: 30px;

  & > svg {
    height: 100%;
    width: 100%;
  }
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

const AdminChip = styled.div`
  font-size: 11px;
  margin-right: 5px;
  white-space: pre;
  font-weight: 700;
  color: white;
`;

const SidepanelButton = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-right: 15px;
`;

interface Props {
  isAdmin: boolean;
  openAdminPanel(a: boolean): void;
  isAdminPanelOpen: boolean;
  openShareLocationModal(): void;
}

const NavBar = ({
  isAdmin,
  isAdminPanelOpen,
  openAdminPanel,
  location: { pathname },
  history,
  openShareLocationModal,
}: Props & RouteComponentProps) => (
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
    <SidepanelButton
      onClick={() => {
        if (pathname !== '/') {
          history.push('/');
        }
        openShareLocationModal();
      }}
    >
      <AdminChip>Location sharing</AdminChip>
      <AdminCog>
        <TiLocationArrow />
      </AdminCog>
    </SidepanelButton>
    {isAdmin && (
      <SidepanelButton
        onClick={() => {
          if (pathname !== '/') {
            history.push('/');
            openAdminPanel(true);
          } else {
            openAdminPanel(!isAdminPanelOpen);
          }
        }}
      >
        <AdminChip>Admin panel</AdminChip>
        <AdminCog>
          <TiCog />
        </AdminCog>
      </SidepanelButton>
    )}
  </NavContainer>
);

export default withRouter(NavBar);
