import React from 'react';
import { TiCog } from 'react-icons/ti';
import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom';
import styled from 'styled-components';
import btlogo from '../../asset/bluetooth_logo.svg';
import { HamburgerSqueeze } from 'react-animated-burgers';
import { useState } from 'react';

/** Container */
const Navigation = styled.header`
  z-index: 1000;

  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;

  background-color: #4287f5;
  font-size: 0.8125rem;
  font-weight: 700;
  font-family: 'Comfortaa', Helvetica, sans-serif;
`;

/** Upper nav */

const TopNav = styled.nav`
  height: 48px;
  margin: 0 1em 0 1em;
  display: inherit;
  align-items: center;
  justify-content: space-between;

  color: #ffffff;
`;

/** Left menu */

const TopNavLeftMenu = styled.ul`
  height: inherit;
  display: inherit;
  align-items: center;
`;

const LeftMenuItem = styled(NavLink)`
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

/** Right menu */

const TopRightMenu = styled.ul`
  display: inherit;

  @media (max-width: 575px) {
    display: none;
  }
`;

const RightMenuItem = styled.li`
  cursor: pointer;
  padding: 0 10px 0 10px;
  display: inherit;
  align-items: center;

  font-size: 12px;
`;

const SearchBar = styled.input`
  border: none;
  padding: 0.5em;
  text-align: left;
  border-radius: 20px;

  background: #68a0fc;

  ::placeholder {
    color: #ffffff;
    padding-left: 1em;
    padding-right: 1em;
    font-size: 12px;
  }
`;

const RightMenuItemText = styled.div`
  white-space: pre;
  margin-right: 5px;

  /* Collapse to an icon on medium screens */
  @media (max-width: 750px) {
    font-size: 0px !important;
  }
`;

const Icon = styled.div`
  width: 30px;

  & > svg {
    height: 100%;
    width: 100%;
  }
`;

const Button = styled.button`
  display: none;

  background-color: lightcoral;

  @media (max-width: 575px) {
    display: inline-block;
  }
`;

/** Mobile */

const Mobile = styled.nav`
  height: 48px;

  background-color: lightblue;
`;

const MobileMenu = styled.ul`
  display: inherit;

  background-color: teal;
`;

const MobileMenuItem = styled.li`
  display: inherit;
  align-items: center;

  font-size: 12px;
`;

/** End */

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
          <LeftMenuItem to="/" exact>
            <Logo />
          </LeftMenuItem>

          <LeftMenuItem to="/" exact>
            <LinkText>Map</LinkText>
          </LeftMenuItem>

          <LeftMenuItem to="/config">
            <LinkText>Config</LinkText>
          </LeftMenuItem>

          <LeftMenuItem to="/about">
            <LinkText>About</LinkText>
          </LeftMenuItem>
        </TopNavLeftMenu>

        <TopRightMenu>
          <RightMenuItem>
            <SearchBar placeholder="Search .." />
          </RightMenuItem>

          <RightMenuItem>
            <RightMenuItemText>Location Sharing</RightMenuItemText>
            <Icon>
                <TiCog />
            </Icon>
          </RightMenuItem>

          <RightMenuItem>
              <RightMenuItemText>Admin Panel</RightMenuItemText>
              <Icon>
                <TiCog />
              </Icon>
          </RightMenuItem>
        </TopRightMenu>

        <Button>///</Button>
      </TopNav>

      <Mobile>
        MobileNav
        <MobileMenu>
          <MobileMenuItem>Item 1</MobileMenuItem>
          <MobileMenuItem>Item 2</MobileMenuItem>
        </MobileMenu>
      </Mobile>
    </Navigation>
  );
};

export default withRouter(NavBar2);
