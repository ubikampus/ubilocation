import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import Button, { SecondaryButton } from '../common/button';
import Modal, {
  ModalParagraph,
  ModalButtonRow,
  ModalHeader,
} from '../common/modal';

const IdRow = styled.div`
  display: flex;
`;

const IdInput = styled.input`
  flex: 1;
  font-size: 12px;
  padding: 3px 5px;
  border-radius: 3px 0 0 3px;
  border: 1px solid #d1d5da;
  color: #24292e;
`;

interface Props {
  confirmId(id: string): void;
  onClose(): void;
}

const BeaconIdModal = ({ confirmId, onClose }: Props) => {
  const [isOpen, setIsOpen] = useState(true);
  const [beaconId, setBeaconId] = useState('');

  useEffect(() => {
    return () => {
      setIsOpen(false);
    };
  }, []);

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose}>
      <ModalHeader>Ubikampus indoor positioning</ModalHeader>
      <ModalParagraph>Enter your beacon ID</ModalParagraph>
      <IdRow>
        <IdInput
          placeholder="Beacon ID"
          value={beaconId}
          onChange={e => setBeaconId(e.target.value)}
        />
      </IdRow>
      <ModalParagraph>Allow Ubimaps to track my location</ModalParagraph>
      <ModalButtonRow>
        <SecondaryButton
          onClick={() => {
            onClose();
          }}
        >
          No
        </SecondaryButton>
        <Button
          onClick={() => {
            if (!beaconId) {
              // TODO: Show an error message: beacon id cannot be empty
              return;
            }

            confirmId(beaconId);
          }}
        >
          Yes
        </Button>
      </ModalButtonRow>
    </Modal>
  );
};

export default BeaconIdModal;
