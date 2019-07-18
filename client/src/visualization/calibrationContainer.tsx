import React, { useState } from 'react';
import styled from 'styled-components';

import Button from './button';

const AddNewButton = styled(Button)`
  background: #4287f5;
  color: white;

  &&:hover {
    color: #eee;
  }
`;

export interface RaspberryLocation {
  name: string;
  lat: number;
  lon: number;
  height: number;
}

interface Props {
  raspberryLocation: { lat: number; lon: number } | null;
  onRaspberryAdd(): void;
  raspberryDevices: RaspberryLocation[];
  setRaspberryDevices(a: RaspberryLocation[]): void;
  onCancel(): void;
  onSubmit(a: RaspberryLocation[]): void;
}

const ButtonRow = styled.div`
  display: flex;
  justify-content: center;
`;

const CalibrationContainer = ({
  raspberryLocation,
  raspberryDevices,
  setRaspberryDevices,
  onCancel,
  onSubmit,
}: Props) => {
  const [newName, setNewName] = useState('');
  const [newHeight, setNewHeight] = useState('');

  return (
    <>
      <h1>Set Raspberry Pi locations</h1>
      <p>
        Click location on map and enter name and height in millimeters for the
        Raspberry Pi.
      </p>
      {raspberryDevices.map((device, i) => (
        <div key={'rpi-' + i}>
          name={device.name} lat={device.lat} lon={device.lon}
        </div>
      ))}
      enter new name:
      <form
        onSubmit={e => {
          e.preventDefault();
          if (raspberryLocation) {
            setRaspberryDevices([
              ...raspberryDevices,
              {
                name: newName,
                lat: raspberryLocation.lat,
                lon: raspberryLocation.lon,
                height: parseInt(newHeight, 10),
              },
            ]);
            setNewName('');
            setNewHeight('');
          }
        }}
      >
        {raspberryLocation && (
          <span>
            lat: {raspberryLocation.lat} lon {raspberryLocation.lon}
          </span>
        )}
        <input value={newName} onChange={e => setNewName(e.target.value)} />
        <input
          value={newHeight}
          type="number"
          onChange={e => setNewHeight(e.target.value)}
        />
        <ButtonRow>
          <AddNewButton disabled={raspberryLocation === null || newName === ''}>
            Add new
          </AddNewButton>
        </ButtonRow>
      </form>
      <Button onClick={() => onCancel()}>Cancel</Button>
      <Button onClick={() => onSubmit(raspberryDevices)}>Submit</Button>
    </>
  );
};

export default CalibrationContainer;
