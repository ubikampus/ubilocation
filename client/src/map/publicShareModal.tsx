import React from 'react';
import Switch from 'react-switch';

import Modal, {
  ModalHeader,
  ModalParagraph,
  ModalButtonRow,
  UbiLogo,
} from '../common/modal';
import styled from 'styled-components';
import { PrimaryButton } from '../common/button';
import { PublicBeacon } from './shareLocationApi';

interface Props {
  isOpen: boolean;
  onClose(): void;
  publicBeacon: PublicBeacon | null;
  publishLocation(a: boolean): void;
}

const Nickname = styled.span`
  font-family: monospace;
`;

const MainRow = styled.div`
  display: flex;
`;

const ToggleSwitch = styled(Switch)`
  vertical-align: middle;
  margin-right: 4px;
`;

interface LabelProps {
  checked: boolean;
}

const ToggleLabel = styled.span<LabelProps>`
  color: ${props => (props.checked ? 'black' : '#70757a')};
  cursor: pointer;
`;

const PublicShareModal = ({
  isOpen,
  onClose,
  publicBeacon,
  publishLocation,
}: Props) => {
  const isPublic = publicBeacon !== null;
  const nickname = publicBeacon ? publicBeacon.nickname : null;

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose}>
      <MainRow>
        <UbiLogo />
        <div>
          <ModalHeader>Share location for all users</ModalHeader>
          <ModalParagraph>
            Display your current position on Ubikampus info screen and for other
            Ubilocation users. Generated nickname will be shown on map.
          </ModalParagraph>
          <label>
            <ToggleSwitch
              checked={isPublic}
              onChange={checked => publishLocation(checked)}
              height={20}
              width={48}
            />
            <ToggleLabel checked={isPublic}>Share location</ToggleLabel>
          </label>
          {nickname !== null && (
            <ModalParagraph>
              <>
                using nickname <Nickname>{nickname}</Nickname>
              </>
            </ModalParagraph>
          )}
        </div>
      </MainRow>

      <ModalButtonRow>
        <PrimaryButton onClick={() => onClose()}>Ok</PrimaryButton>
      </ModalButtonRow>
    </Modal>
  );
};

export default PublicShareModal;
