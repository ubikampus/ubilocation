import React from 'react';
import styled from 'styled-components';
import uniqBy from 'lodash/uniqBy';

import Modal, {
  ModalHeader,
  ModalButtonRow,
  ModalParagraph,
} from '../common/modal';
import Button from '../common/button';
import { BeaconGeoLocation } from '../location/mqttDeserialize';

const NameList = styled.ul`
  margin: 20px 0;
  max-height: 30vh;
  overflow: auto;

  list-style: none;
  word-break: break-all;
`;

const BluetoothName = styled.li<{ active: boolean }>`
  cursor: pointer;
  padding: 7px 10px;
  margin-right: 15px;
  border-radius: 5px;
  background-color: ${props => (props.active ? '#f3f3f3' : 'inherit')};
`;

interface Props {
  isOpen: boolean;
  nameSelection: null | string;
  beacons: BeaconGeoLocation[];
  confirmName(a: string): void;
  closeModal(): void;
  setNameSelection(a: string): void;
}

export const sortBeacons = (beacons: BeaconGeoLocation[]) => {
  return uniqBy(beacons, beacon => beacon.beaconId).sort((left, right) =>
    left.beaconId.localeCompare(right.beaconId, undefined, { numeric: true })
  );
};

const BluetoothNameModal = ({
  isOpen,
  beacons,
  nameSelection,
  setNameSelection,
  confirmName,
  closeModal,
}: Props) => {
  return (
    <Modal isOpen={isOpen} onRequestClose={closeModal}>
      <ModalHeader>Ubikampus indoor positioning</ModalHeader>
      <ModalParagraph>
        Please make sure the device bluetooth visibility is on, and select your
        Bluetooth name
      </ModalParagraph>
      <NameList>
        {sortBeacons(beacons).map((beacon, i) => (
          <BluetoothName
            key={beacon.beaconId + i}
            active={beacon.beaconId === nameSelection}
            onClick={() => {
              setNameSelection(beacon.beaconId);
            }}
          >
            {beacon.beaconId}
          </BluetoothName>
        ))}
      </NameList>

      <ModalButtonRow>
        <Button
          onClick={() => {
            if (nameSelection) {
              confirmName(nameSelection);
            }
          }}
        >
          Ok
        </Button>
      </ModalButtonRow>
    </Modal>
  );
};

export default BluetoothNameModal;
