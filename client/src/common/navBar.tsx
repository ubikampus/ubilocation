import React from 'react';
import { useState } from 'react';
import { NavLink, withRouter, RouteComponentProps } from 'react-router-dom';
import { TiCog, TiLocationArrow } from 'react-icons/ti';
import { HamburgerSqueeze } from 'react-animated-burgers';
import styled from 'styled-components';
import { IoIosSearch } from 'react-icons/io';

import btlogo from './bluetooth_logo.svg';
import ShareLocationDropdown from './../map/shareLocationDropdown';
import MobileMenuItem, { MenuSubItem } from './mobileMenuItem';
import { Icon } from './icon';

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
  background-color: #20262b;

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
  const [isMobileMenuExpanded, expandMobileMenu] = useState(false);

  const navigateHomeAndRun = (after: () => void) => () => {
    if (pathname !== '/') {
      history.push('/');
    }

    after();
  };

  const sharePrivateClicked = navigateHomeAndRun(() => {
    openShareLocationDropdown(false);
    openShareLocationModal(true);
  });

  const publishLocationClicked = navigateHomeAndRun(() => {
    openPublicShare(true);
  });

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
            <ShareLocationDropdown
              isOpen={isShareLocationDropdownOpen}
              openDropdown={openShareLocationDropdown}
              onOpenShareLocationModal={sharePrivateClicked}
              onOpenPublishLocationModal={publishLocationClicked}
            />
          </RightMenuItem>

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
            isActive={isMobileMenuExpanded}
            toggleButton={() => expandMobileMenu(!isMobileMenuExpanded)}
            buttonWidth={30}
            buttonColor="#4287f5"
            barColor="white"
          />
        </HamburgerMenu>
      </TopNav>

      <Mobile active={isMobileMenuExpanded}>
        <MobileMenu>
          <MobileMenuItem itemIcon={IoIosSearch}>
            <MobileSearch placeholder="Search .." />
          </MobileMenuItem>

          <MobileMenuItem
            itemIcon={TiLocationArrow}
            renderSubItems={() => (
              <>
                <MenuSubItem onClick={sharePrivateClicked}>
                  Share privately
                </MenuSubItem>
                <MenuSubItem onClick={publishLocationClicked}>
                  Publish to Ubilocation
                </MenuSubItem>
              </>
            )}
          >
            <MobileMenuText>Location Sharing</MobileMenuText>
          </MobileMenuItem>

          {isAdmin && (
            <MobileMenuItem
              itemIcon={TiCog}
              onClick={() => {
                if (pathname !== '/') {
                  history.push('/');
                  openAdminPanel(true);
                } else {
                  openAdminPanel(!isAdminPanelOpen);
                }
              }}
            >
              <MobileMenuText>Admin Panel</MobileMenuText>
            </MobileMenuItem>
          )}
        </MobileMenu>
      </Mobile>
    </Navigation>
  );
};

export default withRouter(NavBar);
