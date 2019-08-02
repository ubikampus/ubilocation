import React from 'react';
import styled from 'styled-components';
import Clipboard from 'react-clipboard.js';
import { GoClippy } from 'react-icons/go';
import Modal, { ModalHeader, ModalParagraph } from '../common/modal';

const baseUrl = 'http://localhost:8080';

const HighlightedParagraph = styled(ModalParagraph)`
  color: red;
`;

const LinkTable = styled.div`
  display: table;
`;

const LinkRow = styled.div`
  display: table-row;
`;

const LinkField = styled.input`
  display: table-cell;
  width: 80%;
  /*box-sizing: border-box;*/
  /*font-size: 13px;
  padding: 7px 8px;*/
`;

const CopyButton = styled(Clipboard)`
  display: table-cell;
  /*padding: 6px 12px;*/
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
      <ModalHeader>Share My Location</ModalHeader>
      <ModalParagraph>
        Copy the link below and share it as you see fit. Please note that
        anybody who has the link will be able to track your real-time location.
      </ModalParagraph>
      {currentBluetoothName ? (
        <LinkTable>
          <LinkRow>
            <LinkField value={shareLink} readOnly={true} />
            <CopyButton data-clipboard-text={shareLink}>
              <GoClippy />
            </CopyButton>
          </LinkRow>
        </LinkTable>
      ) : (
        <HighlightedParagraph>
          Before we can generate a link for you, you need to enable location
          tracking.
        </HighlightedParagraph>
      )}
    </Modal>
  );
};

export default ShareLocation;
