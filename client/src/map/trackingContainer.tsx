import React, { useEffect, useState } from 'react';
import fetchName from '../location/webbluetooth';
import BluetoothNameModal from './bluetoothNameModal';
import { BeaconGeoLocation } from '../location/mqttDeserialize';
import { BluetoothFetchResult } from './bluetoothTypes';

interface Props {
  setName(a: string | null): void;
  beacons: BeaconGeoLocation[];
  onStaticSelected(a: string): void;
  onTrackingConfirmed(a: string): void;
  onStaticLocationConfirmed(a: string): void;
  onClose(): void;
}

const TrackingContainer = ({
  onClose,
  setName,
  beacons,
  onStaticLocationConfirmed,
  onTrackingConfirmed,
}: Props) => {
  const [bluetoothFetch, setBluetoothFetch] = useState<BluetoothFetchResult>({
    kind: 'loading',
  });

  const [isOpen, setIsOpen] = useState(true);
  const [nameSelection, setNameSelection] = useState<null | string>(null);

  useEffect(() => {
    const fetch = async () => {
      const name = await fetchName();
      console.log('got bt name', name);
      setName(name);

      if (name !== null) {
        setBluetoothFetch({ kind: 'success', name });
      } else {
        setBluetoothFetch({ kind: 'fail' });
      }
    };

    fetch();

    return () => {
      setIsOpen(false);
    };
  }, []);

  return (
    <BluetoothNameModal
      isOpen={isOpen}
      closeModal={onClose}
      bluetoothFetch={bluetoothFetch}
      beacons={beacons}
      onStaticLocationConfirmed={onStaticLocationConfirmed}
      nameSelection={nameSelection}
      setNameSelection={setNameSelection}
      onTrackingConfirmed={onTrackingConfirmed}
    />
  );
};

export default TrackingContainer;
