import React, { useEffect, useState } from 'react';

import Button from '../common/button';
import Modal, {
  ModalParagraph,
  ModalButtonRow,
  ModalHeader,
} from '../common/modal';
import fetchName from '../location/webbluetooth';
import BluetoothNameModal from './bluetoothNameModal';
import { BeaconGeoLocation } from '../location/mqttDeserialize';

interface Props {
  confirmName(a: string): void;
  beacons: BeaconGeoLocation[];
  onStaticSelected(a: string): void;
  onClose(): void;
  currentBluetoothName: null | string;
}

const TrackingContainer = ({
  onClose,
  confirmName,
  beacons,
  currentBluetoothName,
}: Props) => {
  const [bluetoothLoading, setBluetoothLoading] = useState(false);
  const [manualDeviceSelect, setManualDeviceSelect] = useState(false);

  const [isOpen, setIsOpen] = useState(true);
  const [nameSelection, setNameSelection] = useState<null | string>(null);

  useEffect(() => {
    return () => {
      setIsOpen(false);
    };
  }, []);

  if (manualDeviceSelect) {
    return (
      <BluetoothNameModal
        isOpen={isOpen}
        closeModal={onClose}
        setNameSelection={setNameSelection}
        beacons={beacons}
        nameSelection={nameSelection}
        confirmName={confirmName}
        currentBluetoothName={currentBluetoothName}
      />
    );
  }

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose}>
      <ModalHeader>Ubikampus indoor positioning</ModalHeader>
      {bluetoothLoading && <span>loading...</span>}
      <ModalParagraph>Allow Ubimaps to track my location</ModalParagraph>
      <ModalButtonRow>
        <Button
          onClick={async () => {
            setBluetoothLoading(true);
            try {
              const name = await fetchName();

              console.log('got bt name', name);
              setBluetoothLoading(false);
              confirmName(name);
            } catch (err) {
              if (err.message && err.message.includes('User cancelled')) {
                onClose();
              } else {
                /////// unknown error

                // This is needed because some web bluetooth exceptions are unconventional
                const error = err.stack ? err : err.message;
                console.log('failed to fetch bt, using fallback', error);
                setManualDeviceSelect(true);
              }
            }
          }}
        >
          Yes
        </Button>
        <Button
          onClick={() => {
            onClose();
          }}
        >
          No
        </Button>
      </ModalButtonRow>
    </Modal>
  );
};

export default TrackingContainer;
