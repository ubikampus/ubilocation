import React from 'react';
import styled from 'styled-components';
import Clipboard from 'react-clipboard.js';
import { GoClippy, GoBroadcast } from 'react-icons/go';
import { FaBroadcastTower } from 'react-icons/fa';
import Modal, { ModalHeader, ModalParagraph } from '../common/modal';

const baseUrl = 'http://localhost:8080';

const FlexContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const IconColumn = styled.div`
  /* ... */
`;

const ContentColumn = styled.div`
  /* ... */
`;

const BroadcastdIcon = styled.div`
  height: auto;
  width: 100px;
  padding: 30px 15px 0 0;

  & > svg {
    height: 100%;
    width: 100%;
  }
`;

const ModifiedModalHeader = styled(ModalHeader)`
  margin-bottom: 10px;
`;

const HighlightedParagraph = styled(ModalParagraph)`
  color: red;
`;

/*
const LinkTable = styled.div`
  display: table;
`;

const LinkRow = styled.div`
  display: table-row;
`;
*/

const LinkField = styled.input`
  /*display: table-cell;*/
  width: 80%;
  /*box-sizing: border-box;*/
  /*font-size: 13px;
  padding: 7px 8px;*/
`;

const CopyButton = styled(Clipboard)`
  /*display: table-cell;*/
  /*padding: 6px 12px;
  width: 1%;
  vertical-align: middle;*/
`;

interface Props {
  isOpen: boolean;
  onClose(): void;
  currentBluetoothName: null | string;
}

const ShareLocation = ({ isOpen, onClose, currentBluetoothName }: Props) => {
  const shareLink = `${baseUrl}/?track=${currentBluetoothName}`;
  return (
    <Modal isOpen={isOpen} onRequestClose={onClose}>
      <FlexContainer>
        <IconColumn>
          <BroadcastdIcon>
            <GoBroadcast />
          </BroadcastdIcon>
        </IconColumn>
        <ContentColumn>
          <ModifiedModalHeader>Share real-time location</ModifiedModalHeader>
          <ModalParagraph>
            Copy the link below and share it as you see fit. Please note that
            anybody who has the link will be able to track your real-time
            location.
          </ModalParagraph>
          {currentBluetoothName ? (
            <div>
              <LinkField value={shareLink} readOnly={true} />
              <CopyButton data-clipboard-text={shareLink}>
                <GoClippy />
              </CopyButton>
            </div>
          ) : (
            <HighlightedParagraph>
              Before we can generate a link for you, you need to enable location
              tracking.
            </HighlightedParagraph>
          )}
        </ContentColumn>
      </FlexContainer>
    </Modal>
  );
};

export default ShareLocation;
