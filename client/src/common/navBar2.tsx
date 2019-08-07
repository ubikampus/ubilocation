import React from 'react';
import { TiCog } from 'react-icons/ti';
import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom';
import styled from 'styled-components';
import btlogo from '../../asset/bluetooth_logo.svg';
import { HamburgerSqueeze } from 'react-animated-burgers';
import { useState } from 'react';

const Navigation = styled.header`
  z-index: 1000;

  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;

  background-color: #4287f5;
  font-size: 0.8125rem;
  font-family: 'Comfortaa', Helvetica, sans-serif;
`;

const TopNav = styled.nav`
  height: 48px;
  margin: 0 1em 0 1em;
  display: inherit;
  align-items: center;
  justify-content: space-between;

  color: #ffffff;
`;

const TopNavLeftMenu = styled.ul`
  height: inherit;
  display: inherit;
  align-items: center;
`;

const TopNavLeftMenuLink = styled(NavLink)`
  border-top: 3px solid transparent;
  border-bottom: 3px solid transparent;

  color: #bed4f7;

  &.active {
    > li {
      color: #ffffff;
      border-bottom: 3px solid #ffffff;
    }
  }
`;

const Logo = styled.div`
  padding: 10px;
  height: 25px;
  width: 25px;

  background-image: url("${btlogo}");
`;

const LinkText = styled.li`
  padding: 15px;
  border-top: 3px solid transparent;
  border-bottom: 3px solid transparent;

  color: #bed4f7;

  &:active {
    color: #ffffff;
    border-bottom: 3px solid #ffffff;
  }
  &:hover {
    color: #ffffff;
  }
`;

const TopRightMenu = styled.ul`
  display: inherit;

  background-color: teal;

  @media (max-width: 550px) {
    display: none;
  }
`;

const RightMenuItem = styled.li``;

const Button = styled.button`
  display: none;

  background-color: lightcoral;

  @media (max-width: 550px) {
    display: inline-block;
  }
`;

const Mobile = styled.nav`
  height: 48px;

  background-color: lightblue;
`;

const MobileMenu = styled.ul`
  display: inherit;

  background-color: teal;
`;

interface Props {
  isAdmin: boolean;
  openAdminPanel(a: boolean): void;
  isAdminPanelOpen: boolean;
  isMobileNavVisible: boolean;
}

const NavBar2 = ({
  isAdmin,
  isAdminPanelOpen,
  openAdminPanel,
  location: { pathname },
  history,
}: Props & RouteComponentProps) => {
  const [isActive, setActive] = useState(false);
  return (
    <Navigation>
      <TopNav>
        <TopNavLeftMenu>
          <TopNavLeftMenuLink to="/" exact>
            <Logo />
          </TopNavLeftMenuLink>

          <TopNavLeftMenuLink to="/" exact>
            <LinkText>Map</LinkText>
          </TopNavLeftMenuLink>

          <TopNavLeftMenuLink to="/config">
            <LinkText>Config</LinkText>
          </TopNavLeftMenuLink>

          <TopNavLeftMenuLink to="/about">
            <LinkText>About</LinkText>
          </TopNavLeftMenuLink>

        </TopNavLeftMenu>

        <TopRightMenu>
          <RightMenuItem>Item 1</RightMenuItem>
          <RightMenuItem>Item 2</RightMenuItem>
        </TopRightMenu>

        <Button>///</Button>
      </TopNav>

      <Mobile>
        MobileNav
        <MobileMenu>
          <RightMenuItem>Item 1</RightMenuItem>
          <RightMenuItem>Item 2</RightMenuItem>
        </MobileMenu>
      </Mobile>
    </Navigation>
  );
};

export default withRouter(NavBar2);
