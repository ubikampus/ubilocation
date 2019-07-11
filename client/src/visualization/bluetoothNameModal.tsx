import React from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';

import { BeaconGeoLocation } from '../location/mqttDeserialize';

const modalStyles = {
  overlay: {
    zIndex: '1001',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  content: {
    maxHeight: '80vh',
    maxWidth: '400px',
    position: 'static',
    margin: '20px 10px',
  },
};

const NameHeader = styled.h3`
  margin-top: 0;
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 20px;
`;

const NameList = styled.ul`
  list-style: none;
  padding-left: 13px;
  margin: 20px 0;
  word-break: break-all;
`;

const BluetoothName = styled.li`
  cursor: pointer;
  margin: 10px 0;
`;

interface Props {
  isOpen: boolean;
  beacons: BeaconGeoLocation[];
  setBluetoothName(a: string): void;
}

const BluetoothNameModal = ({ isOpen, beacons, setBluetoothName }: Props) => (
  <Modal style={modalStyles} isOpen={isOpen}>
    <NameHeader>Device select</NameHeader>
    <p>
      Please make sure the device bluetooth visibility is on, and select your
      bluetooth name:
    </p>
    <NameList>
      {beacons
        .sort((a, b) =>
          a.beaconId.localeCompare(b.beaconId, undefined, {
            numeric: true,
          })
        )
        .map((beacon, i) => (
          <BluetoothName
            key={beacon.beaconId + i}
            onClick={() => {
              setBluetoothName(beacon.beaconId);
            }}
          >
            {beacon.beaconId}
          </BluetoothName>
        ))}
    </NameList>
  </Modal>
);

export default BluetoothNameModal;
