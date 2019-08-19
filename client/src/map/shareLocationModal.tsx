import React from 'react';
import styled from 'styled-components';
import Clipboard from 'react-clipboard.js';
import queryString from 'query-string';
import { GoClippy } from 'react-icons/go';
import Modal, { ModalHeader, ModalParagraph, UbiLogo } from '../common/modal';

const FlexContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const ModifiedModalHeader = styled(ModalHeader)`
  margin-bottom: 10px;
`;

/**
 * Credit: UrlInput and CopyButton are based on similar components on the
 * GitHub web page
 */
const UrlRow = styled.div`
  display: flex;
  height: 28px;
`;

const UrlInput = styled.input`
  flex: 1;
  font-size: 12px;
  padding: 3px 5px;
  border-radius: 3px 0 0 3px;
  border: 1px solid #d1d5da;
  color: #24292e;
`;

const CopyButton = styled(Clipboard)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
  padding: 3px 10px;
  margin-left: -1px;
  border: 1px solid rgba(27, 31, 35, 0.2);
  border-radius: 0 3px 3px 0;
  background-color: #eff3f6;
`;

const CopyIcon = styled(GoClippy)`
  width: 14px;
  height: 16px;
`;

interface Props {
  isOpen: boolean;
  onClose(): void;
  currentBeaconId: string;
}

const ShareLocation = ({ isOpen, onClose, currentBeaconId }: Props) => {
  const queryStr = queryString.stringify({ track: currentBeaconId });
  const shareLink = `${window.location.href}?${queryStr}`;

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose}>
      <FlexContainer>
        <UbiLogo />
        <div>
          <ModifiedModalHeader>Share real-time location</ModifiedModalHeader>
          <ModalParagraph>
            Copy the link below and share it as you see fit. Please note that
            anybody who has the link will be able to track your real-time
            location.
          </ModalParagraph>
          <UrlRow>
            <UrlInput value={shareLink} readOnly={true} />
            <CopyButton data-clipboard-text={shareLink}>
              <CopyIcon />
            </CopyButton>
          </UrlRow>
        </div>
      </FlexContainer>
    </Modal>
  );
};

export default ShareLocation;
