import React from 'react';
import { TiCog } from 'react-icons/ti';
import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom';
import styled from 'styled-components';
import btlogo from '../../asset/bluetooth_logo.svg';
import { HamburgerSqueeze } from 'react-animated-burgers';
import { useState } from 'react';

const Container = styled.header`
  width: 100%;
  height: auto;
  display: flex;
  background-color: lightyellow;
  flex-direction: column;
`;

const DesktopNavbar = styled.nav`
  align-items: center;
  justify-content: flex-start;
  display: inherit;
  height: 48px;
  background-color: lightgreen;
`;

const Logo = styled.div``;

const LeftMenu = styled.ul`
  display: inherit;

  justify-content: center;
  align-items: flex-start;
  background-color: pink;
`;

const LeftItem = styled.li``;

const RightMenu = styled.ul`
  display: inherit;
  background-color: salmon;

  @media (max-width: 550px) {
    display: none;
  }
`;

const RightItem = styled.li``;

const Button = styled.button`
  background-color: lightcoral;
  display: none;

  @media (max-width: 550px) {
    display: inline-block;
  }
`;

const MobileNavbar = styled.nav`
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
    <Container>
      <DesktopNavbar>
        <Logo>Logo</Logo>

        <LeftMenu>
          <LeftItem>Item 1</LeftItem>
          <LeftItem>Item 2</LeftItem>
        </LeftMenu>

        <RightMenu>
          <RightItem>Item 1</RightItem>
          <RightItem>Item 2</RightItem>
        </RightMenu>

        <Button>///</Button>
      </DesktopNavbar>

      <MobileNavbar>
        MobileNav
         <MobileMenu>
          <RightItem>Item 1</RightItem>
          <RightItem>Item 2</RightItem>
        </MobileMenu>
      </MobileNavbar>

    </Container>
  );
};

export default withRouter(NavBar2);
