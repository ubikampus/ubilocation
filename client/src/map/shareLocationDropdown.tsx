import React, { useEffect } from 'react';
import styled from 'styled-components';

/**
 * Credit: This dropdown menu is based on
 * (1) https://blog.campvanilla.com/reactjs-dropdown-menus-b6e06ae3a8fe and
 * (2) https://www.w3schools.com/howto/howto_js_dropdown.asp
 */

const DropdownContent = styled.div`
  /**
   * Make this dropdown appear below the 'Location sharing' link in the navbar.
   */
  position: absolute;
  top: 48px;
  background-color: #68a0fd;
  border-radius: 0 0 8px 8px;
  /**
   * So that the corners stay rounded also when hovering over a link
   * (since links don't have rounded corners)
   */
  overflow: hidden;
`;

const DropdownLink = styled.div`
  text-align: left;
  font-size: 12px;
  color: white;
  &:hover {
    background-color: #7db2ff;
  }
  cursor: pointer;
  padding: 10px 15px;
`;

interface Props {
  isOpen: boolean;
  openDropdown(a: boolean): void;
  onOpenShareLocationModal(): void;
  onOpenPublishLocationModal(): void;
}

const ShareLocationDropdown = ({
  isOpen,
  openDropdown,
  onOpenShareLocationModal,
  onOpenPublishLocationModal,
}: Props) => {
  /**
   * Add event handlers so that the dropdown closes when the user clicks on
   * anywhere on the map
   */
  const onOpenDropdown = () => {
    document.addEventListener('click', closeDropdown);
  };

  const closeDropdown = () => {
    document.removeEventListener('click', closeDropdown);
    openDropdown(false);
  };

  useEffect(() => {
    if (isOpen) {
      onOpenDropdown();
    }
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <DropdownContent>
          <DropdownLink onClick={onOpenShareLocationModal}>
            Share privately
          </DropdownLink>
          <DropdownLink onClick={onOpenPublishLocationModal}>
            Publish to Ubimaps
          </DropdownLink>
        </DropdownContent>
      )}
    </>
  );
};

export default ShareLocationDropdown;
