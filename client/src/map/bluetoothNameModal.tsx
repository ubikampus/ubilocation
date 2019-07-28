import React from 'react';
import styled from 'styled-components';
import uniqBy from 'lodash/uniqBy';

import Modal from '../common/modal';
import Button from '../common/button';
import { BeaconGeoLocation } from '../location/mqttDeserialize';
import { BluetoothFetchResult } from './bluetoothTypes';

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
  nameSelection: null | string;
  beacons: BeaconGeoLocation[];
  bluetoothFetch: BluetoothFetchResult;
  closeModal(): void;
  setNameSelection(a: string): void;
  onTrackingConfirmed(a: string): void;
  onStaticLocationConfirmed(a: string): void;
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
  onTrackingConfirmed,
  bluetoothFetch,
  onStaticLocationConfirmed,
  closeModal,
}: Props) => {
  const canSubmit = nameSelection !== null || bluetoothFetch.kind !== 'loading';
  const newNameCandidate =
    bluetoothFetch.kind === 'success' ? bluetoothFetch.name : nameSelection;
  return (
    <Modal isOpen={isOpen} onRequestClose={closeModal}>
      <NameHeader>Ubikampus indoor positioning</NameHeader>
      {bluetoothFetch.kind === 'loading' && <span>loading...</span>}
      {bluetoothFetch.kind === 'fail' && (
        <>
          <InfoSection>
            Please make sure the device bluetooth visibility is on, and select
            your Bluetooth name
          </InfoSection>
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
        </>
      )}
      <InfoSection>Allow Ubimaps to track my location</InfoSection>
      <ButtonRow>
        <Button
          disabled={!canSubmit}
          onClick={() => {
            if (newNameCandidate) {
              onTrackingConfirmed(newNameCandidate);
            }
          }}
        >
          Yes
        </Button>
        <Button
          disabled={!canSubmit}
          onClick={() => {
            if (newNameCandidate) {
              onStaticLocationConfirmed(newNameCandidate);
            }
          }}
        >
          No
        </Button>
      </ButtonRow>
    </Modal>
  );
};

export default BluetoothNameModal;
