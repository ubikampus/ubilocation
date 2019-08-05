import React from 'react';
import styled from 'styled-components';
import Clipboard from 'react-clipboard.js';
import queryString from 'query-string';
import { GoClippy, GoBroadcast } from 'react-icons/go';
import { FaBroadcastTower } from 'react-icons/fa';
import Modal, { ModalHeader, ModalParagraph } from '../common/modal';

/**
 * TODO: This URL should probably be an environment variable
 */
const baseUrl = 'http://localhost:8080';

const FlexContainer = styled.div`
  display: flex;
  flex-direction: row;
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

/**
 * Credit: UrlInput and CopyButton are based on similar components on the GitHub web page
 */
const UrlInput = styled.input`
  width: 80%;
  font-size: 12px;
  line-height: 20px;
  padding: 3px 5px;
  border: 1px solid #d1d5da;
  border-radius: 3px 0 0 3px;
  color: #24292e;
`;

const CopyButton = styled(Clipboard)`
  font-size: 12px;
  line-height: 20px;
  padding: 3px 10px;
  margin-left: -1px;
  border: 1px solid rgba(27, 31, 35, 0.2);
  border-radius: 0 3px 3px 0;
  background-color: #eff3f6;
  cursor: pointer;
`;

const CopyIcon = styled(GoClippy)`
  /**
   * This doesn't seem to work...
   * The icon is not centered vertically - it's a little off.
   */
  display: inline-block;
  vertical-align: middle;
  width: 14px;
  height: 16px;
`;

interface Props {
  isOpen: boolean;
  onClose(): void;
  currentBluetoothName: null | string;
}

const ShareLocation = ({ isOpen, onClose, currentBluetoothName }: Props) => {
  const queryStr = queryString.stringify({ track: currentBluetoothName });
  const shareLink = `${baseUrl}/?${queryStr}`;

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose}>
      <FlexContainer>
        <div>
          <BroadcastdIcon>
            <GoBroadcast />
          </BroadcastdIcon>
        </div>
        <div>
          <ModifiedModalHeader>Share real-time location</ModifiedModalHeader>
          <ModalParagraph>
            Copy the link below and share it as you see fit. Please note that
            anybody who has the link will be able to track your real-time
            location.
          </ModalParagraph>
          {currentBluetoothName ? (
            <div>
              <UrlInput value={shareLink} readOnly={true} />
              <span>
                <CopyButton data-clipboard-text={shareLink}>
                  <CopyIcon />
                </CopyButton>
              </span>
            </div>
          ) : (
            <HighlightedParagraph>
              Before we can generate a link for you, you need to enable location
              tracking.
            </HighlightedParagraph>
          )}
        </div>
      </FlexContainer>
    </Modal>
  );
};

export default ShareLocation;
