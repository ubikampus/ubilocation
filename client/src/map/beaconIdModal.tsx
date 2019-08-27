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
  height: 30px;

  border-radius: 3px 0 0 3px;
  padding: 3px 5px;

  font-size: 12px;
  border: 1px solid #d1d5da;
  color: #24292e;
`;

interface Props {
  confirmId(id: string): void;
  onClose(): void;
}

const InstructionListItem = styled.li`
  line-height: 1.3;
  margin: 5px 0;
`;

const InstructionList = styled.ol`
  font-size: 15px;
  margin: 15px 30px;

  list-style: decimal;
`;

const IdentifierList = styled.ul`
  list-style: none;
  margin: 0 15px 15px;
  line-height: 1.2;
`;

const IdentifierItem = styled.li`
  margin: 5px;
  line-height: 1;
`;

const PlayStoreLink = styled.a`
  font-weight: 700;

  color: #4287f5;

  &:visited {
    color: #4287f5;
  }

  &:hover {
    color: #221f20;
  }
`;

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
      <ModalHeader>Ubilocation</ModalHeader>
      <form
        onSubmit={e => {
          e.preventDefault();
          if (!beaconId) {
            // TODO: Show an error message: beacon id cannot be empty
            return;
          }

          confirmId(beaconId);
        }}
      >
        <ModalParagraph>
          Ubilocation uses beacon IDs to link Bluetooth devices to their
          corresponding owners. If you do not own a beacon, you can transform
          your device such as mobile phone into one by downloading a beacon
          simulation application from Google Play (e.g.{' '}
          <PlayStoreLink
            href="https://play.google.com/store/apps/details?id=net.alea.beaconsimulator&hl=en"
            target="_blank"
          >
            Beacon Simulator
          </PlayStoreLink>
          ).
        </ModalParagraph>
        <InstructionList>
          <InstructionListItem>Download the simulator</InstructionListItem>
          <InstructionListItem>
            Select IBeacon or Eddystone from the list of available simulators
          </InstructionListItem>
          <InstructionListItem>
            Write down your beacon ID in the following field
            <IdentifierList>
              <IdentifierItem>iBeacon: ID is the same as UUID</IdentifierItem>
              <IdentifierItem>
                Eddystone: ID is the same as Namespace ID
              </IdentifierItem>
            </IdentifierList>
          </InstructionListItem>
        </InstructionList>
        <IdRow>
          <IdInput
            autoFocus
            type="password"
            placeholder="Beacon ID"
            value={beaconId}
            onChange={e => setBeaconId(e.target.value)}
          />
        </IdRow>
        <ModalButtonRow>
          <SecondaryButton
            type="button"
            onClick={() => {
              onClose();
            }}
          >
            Cancel
          </SecondaryButton>
          <Button type="submit">Submit</Button>
        </ModalButtonRow>
      </form>
    </Modal>
  );
};

export default BeaconIdModal;
