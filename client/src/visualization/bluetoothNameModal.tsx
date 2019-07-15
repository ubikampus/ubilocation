import React from 'react';
import styled from 'styled-components';
import uniqBy from 'lodash/uniqBy';

import Modal from './modal';
import Button from './button';
import { BeaconGeoLocation } from '../location/mqttDeserialize';

const NameHeader = styled.h3`
  margin-top: 0;
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 20px;
`;

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

const InfoSection = styled.p`
  line-height: 1.25;
  margin: 10px 0;
`;

const ButtonRow = styled.div`
  margin-top: 25px;
`;

interface Props {
  isOpen: boolean;
  promptForName: boolean; // TODO: use with web bluetooth
  nameSelection: null | string;
  beacons: BeaconGeoLocation[];
  closeModal(): void;
  setNameSelection(a: string): void;
  setStaticLocation(targetName: string | null): void;
  setBluetoothName(a: string | null): void;
}

const BluetoothNameModal = ({
  isOpen,
  beacons,
  nameSelection,
  promptForName,
  setNameSelection,
  setBluetoothName,
  setStaticLocation,
  closeModal,
}: Props) => (
  <Modal isOpen={isOpen} onRequestClose={closeModal}>
    <NameHeader>Ubikampus indoor positioning</NameHeader>
    {promptForName && (
      <>
        <InfoSection>
          Please make sure the device bluetooth visibility is on, and select
          your bluetooth name:
        </InfoSection>
        <NameList>
          {uniqBy(beacons, beacon => beacon.beaconId)
            .sort((a, b) =>
              a.beaconId.localeCompare(b.beaconId, undefined, {
                numeric: true,
              })
            )
            .map((beacon, i) => (
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
      </>
    )}
    <InfoSection>Follow my position with bluetooth?</InfoSection>
    <ButtonRow>
      <Button
        disabled={nameSelection === null && promptForName}
        onClick={() => {
          if (nameSelection) {
            setStaticLocation(nameSelection);
            setBluetoothName(null);
            closeModal();
          }
        }}
      >
        Only current
      </Button>
      <Button
        disabled={nameSelection === null && promptForName}
        onClick={() => {
          if (nameSelection) {
            setBluetoothName(nameSelection);
            setStaticLocation(null);
            closeModal();
          }
        }}
      >
        Follow
      </Button>
    </ButtonRow>
  </Modal>
);

export default BluetoothNameModal;
