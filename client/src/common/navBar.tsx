import React from 'react';
import { useState } from 'react';
import { NavLink, withRouter, RouteComponentProps } from 'react-router-dom';

import styled from 'styled-components';
import { IoIosSearch } from 'react-icons/io';
import { TiCog, TiLocationArrow } from 'react-icons/ti';
import { HamburgerSqueeze } from 'react-animated-burgers';

import btlogo from '../../asset/bluetooth_logo.svg';
import ShareLocationDropdown from './../map/shareLocationDropdown';

/** Container */
const Navigation = styled.nav`
  top: 0;
  z-index: 1000;
  position: sticky;
  position: -o-sticky;
  position: -ms-sticky;
  position: -moz-sticky;
  position: -webkit-sticky;

  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  white-space: pre;

  font-size: 0.8125rem;
  font-weight: 700;
  font-family: 'Comfortaa', Helvetica, sans-serif;
  background-color: #4287f5;

  & > nav > ul > li {
    cursor: pointer;
  }
`;

/** Desktop navigation */
const TopNav = styled.nav`
  height: 48px;
  margin-right: 1em;
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
  height: 25px;
  width: 25px;
  padding: 10px 15px 10px 10px;
  margin: 0 10px 0 10px;

  background-image: url("${btlogo}");
`;

const LeftMenuText = styled.li`
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
  padding: 10px;
  display: inherit;
  align-items: center;

  font-size: 12px;
`;

const SearchBar = styled.input`
  border: none;
  padding: 0.5em;
  text-align: left;
  border-radius: 20px;

  color: inherit;
  background: #68a0fc;

  ::placeholder {
    color: #ffffff;
    padding-left: 1em;
    padding-right: 1em;
    font-size: 12px;
  }
`;

const RightMenuText = styled.div`
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

/** Mobile */
const HamburgerMenu = styled.div`
  width: 100%;
  display: inherit;
  justify-content: flex-end;

  @media (min-width: 575px) {
    display: none;
  }
`;

const Mobile = styled.nav<{ active: boolean }>`
  height: auto;
  align-items: center;
  display: ${props => (props.active ? 'inherit' : 'none')};

  color: white;
  background-color: #7db2ff;

  @media (min-width: 575px) {
    display: none;
  }
`;

const MobileMenu = styled.ul`
  width: 100%;
  display: inherit;
  flex-direction: column;
  justify-content: space-between;
`;

const MobileMenuItem = styled.li`
  width: 100%;
  display: inherit;
  align-items: center;
  padding: 5px;

  &:hover {
    background-color: #94bfff;
  }
  &:active {
    background-color: #94bfff;
  }
  & > div > svg {
    height: 80%;
    width: 80%;
  }
`;

const MobileMenuText = styled.div``;

const MobileSearch = styled.input`
  border: none;

  font: inherit;
  color: white;
  background: inherit;

  ::placeholder {
    color: white;
  }
`;

interface Props {
  bluetoothName: string | null;
  openPublicShare(a: boolean): void;
  isAdmin: boolean;
  openAdminPanel(a: boolean): void;
  isAdminPanelOpen: boolean;
  publicShareOpen: boolean;
  isShareLocationDropdownOpen: boolean;
  openShareLocationDropdown(a: boolean): void;
  openShareLocationModal(a: boolean): void;
}

const NavBar = ({
  openPublicShare,
  isAdmin,
  isAdminPanelOpen,
  openAdminPanel,
  location: { pathname },
  history,
  isShareLocationDropdownOpen,
  openShareLocationDropdown,
  openShareLocationModal,
}: Props & RouteComponentProps) => {
  const [isActive, setActive] = useState(false);

  const navigateHomeAndRun = (after: () => void) => () => {
    if (pathname !== '/') {
      history.push('/');
    }

    after();
  };

  return (
    <Navigation>
      <TopNav>
        <TopNavLeftMenu>
          <LeftMenuItem to="/" exact>
            <Logo />
          </LeftMenuItem>

          <LeftMenuItem to="/" exact>
            <LeftMenuText>Map</LeftMenuText>
          </LeftMenuItem>

          <LeftMenuItem to="/about">
            <LeftMenuText>About</LeftMenuText>
          </LeftMenuItem>
        </TopNavLeftMenu>

        <TopRightMenu>
          <RightMenuItem>
            <SearchBar placeholder="Search .." />
          </RightMenuItem>

          <RightMenuItem
            onClick={() => {
              openShareLocationDropdown(!isShareLocationDropdownOpen);
            }}
          >
            <Icon>
              <TiLocationArrow />
            </Icon>
            <RightMenuText>Location Sharing</RightMenuText>
          </RightMenuItem>

          <ShareLocationDropdown
            isOpen={isShareLocationDropdownOpen}
            openDropdown={openShareLocationDropdown}
            onOpenShareLocationModal={navigateHomeAndRun(() => {
              openShareLocationDropdown(false);
              openShareLocationModal(true);
            })}
            onOpenPublishLocationModal={navigateHomeAndRun(() => {
              openPublicShare(true);
            })}
          />

          {isAdmin && (
            <RightMenuItem
              onClick={() => {
                if (pathname !== '/') {
                  history.push('/');
                  openAdminPanel(true);
                } else {
                  openAdminPanel(!isAdminPanelOpen);
                }
              }}
            >
              <Icon>
                <TiCog />
              </Icon>
              <RightMenuText>Admin Panel</RightMenuText>
            </RightMenuItem>
          )}
        </TopRightMenu>

        <HamburgerMenu>
          <HamburgerSqueeze
            isActive={isActive}
            toggleButton={() => setActive(!isActive)}
            buttonWidth={30}
            buttonColor="#4287f5"
            barColor="white"
          />
        </HamburgerMenu>
      </TopNav>

      <Mobile active={isActive}>
        <MobileMenu>
          <MobileMenuItem>
            <Icon>
              <IoIosSearch />
            </Icon>
            <MobileSearch placeholder="Search .." />
          </MobileMenuItem>

          <MobileMenuItem>
            <Icon>
              <TiLocationArrow />
            </Icon>
            <MobileMenuText>Location Sharing</MobileMenuText>
          </MobileMenuItem>

          {isAdmin && (
            <MobileMenuItem
              onClick={() => {
                if (pathname !== '/') {
                  history.push('/');
                  openAdminPanel(true);
                } else {
                  openAdminPanel(!isAdminPanelOpen);
                }
              }}
            >
              <Icon>
                <TiCog />
              </Icon>
              <MobileMenuText>Admin Panel</MobileMenuText>
            </MobileMenuItem>
          )}
        </MobileMenu>
      </Mobile>
    </Navigation>
  );
};

export default withRouter(NavBar);
