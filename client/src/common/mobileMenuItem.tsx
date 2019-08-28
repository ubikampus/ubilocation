import React, { useState, FC, HTMLAttributes } from 'react';
import styled from 'styled-components';
import { Icon } from './icon';
import { FiPlus, FiMinus } from 'react-icons/fi';

const MobileMenuItemRow = styled.li`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 9px;

  &:hover {
    background-color: #5e9bfc;
  }
  &:active {
    background-color: #5e9bfc;
  }
`;

const ExpandButton = styled(Icon)`
  height: 20px;
  width: 20px;

  margin-left: auto;
  margin-right: 10px;
`;

export const MenuSubItem = styled.li`
  padding: 12px 45px;
  background: #272f35;

  &:hover {
    background-color: #5e9bfc;
  }
`;

const MobileIcon = styled(Icon)`
  width: 20px;
  height: 20px;

  margin-right: 6px;
`;

interface Props {
  itemIcon: React.ElementType;
  renderSubItems?(): JSX.Element;
}

const MobileMenuItem: FC<Props & HTMLAttributes<HTMLElement>> = ({
  renderSubItems: renderExpandedItems,
  itemIcon: ItemIcon,
  children,
  ...rest
}) => {
  const [expanded, setExpanded] = useState(false);

  const ExpandIcon = expanded ? FiMinus : FiPlus;

  return (
    <div>
      <MobileMenuItemRow
        {...rest}
        onClick={
          renderExpandedItems ? () => setExpanded(!expanded) : rest.onClick
        }
      >
        <MobileIcon>
          <ItemIcon />
        </MobileIcon>
        {children}
        {renderExpandedItems && (
          <ExpandButton>
            <ExpandIcon />
          </ExpandButton>
        )}
      </MobileMenuItemRow>
      {expanded && renderExpandedItems && <ul>{renderExpandedItems()}</ul>}
    </div>
  );
};

export default MobileMenuItem;
