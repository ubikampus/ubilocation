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

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { GoClippy } from 'react-icons/go';
import Clipboard from 'react-clipboard.js';

const baseUrl = 'http://localhost:8080';

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

const HighlightedParagraph = styled(ModalParagraph)`
  color: red;
`;

interface Props {
  isOpen: boolean;
  nameSelection: null | string;
  beacons: BeaconGeoLocation[];
  confirmName(a: string): void;
  closeModal(): void;
  setNameSelection(a: string): void;
  currentBluetoothName: null | string;
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
  currentBluetoothName,
}: Props) => {
  const shareLink = `${baseUrl}/?track=${currentBluetoothName}`;
  return (
    <Modal isOpen={isOpen} onRequestClose={closeModal}>
      <Tabs>
        <TabList>
          <Tab>My device</Tab>
          <Tab>Share</Tab>
        </TabList>

        <TabPanel>
          <ModalHeader>Ubikampus indoor positioning</ModalHeader>
          <ModalParagraph>
            Please make sure the device bluetooth visibility is on, and select
            your Bluetooth name
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
        </TabPanel>

        <TabPanel>
          <ModalHeader>Share My Location</ModalHeader>
          <ModalParagraph>
            You can share your <b>real-time location</b> with others.
          </ModalParagraph>
          <ModalParagraph>
            Copy the link below and share it as you see fit. Please beware that
            anybody who has access to the link will be able to track your
            location.
          </ModalParagraph>
          {currentBluetoothName ? (
            <div>
              <input value={shareLink} />
              <Clipboard data-clipboard-text={shareLink}>
                <GoClippy />
              </Clipboard>
            </div>
          ) : (
            <HighlightedParagraph>
              Before we can generate a link for you, you need to specify your
              bluetooth name on the tab "My Device"...
            </HighlightedParagraph>
          )}
        </TabPanel>
      </Tabs>
    </Modal>
  );
};

export default BluetoothNameModal;
