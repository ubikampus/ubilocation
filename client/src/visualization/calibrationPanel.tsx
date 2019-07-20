import React from 'react';
import styled from 'styled-components';

import Button from './button';
import { Location } from '../common/typeUtil';

const AddNewButton = styled(Button)`
  background: #4287f5;
  color: white;

  &&:hover {
    color: #eee;
  }
`;

const CancelButton = styled(Button)`
  background: white;
`;

const SubmitButton = styled(Button)`
  background: #f3f6f7;
`;

export interface RaspberryLocation {
  name: string;
  lat: number;
  lon: number;
  height: number;
}

const CalibrationBar = styled.div`
  padding: 20px;
`;

const CalibrationHeader = styled.h3`
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 25px;
`;

const InfoSection = styled.p`
  font-size: 14px;
  line-height: 1.25;
  margin: 20px 0;
`;

const InputRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
`;

const InputCol = styled.div`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  width: 100%;
  margin: 5px 0;
`;

const RaspberryRow = styled.div`
  margin: 10px 0;
`;

const LocationRow = styled.div`
  font-size: 10px;
  margin: 5px 0;
`;

const RaspberryHeader = styled.h5`
  font-size: 16px;
  margin: 5px 0;
`;

const Divider = styled.hr`
  margin: 20px 0;
  border: 0;
  border-bottom: 1px solid #e6e6e6;
`;

interface Props {
  raspberryLocation: Location | null;
  raspberryDevices: RaspberryLocation[];
  setRaspberryDevices(a: RaspberryLocation[]): void;
  onCancel(): void;
  onSubmit(a: RaspberryLocation[]): void;
  resetRaspberryLocation(): void;
  newName: string;
  setNewName(a: string): void;
  newHeight: string;
  setNewHeight(a: string): void;
}

const CalibrationContainer = ({
  raspberryLocation,
  raspberryDevices,
  setRaspberryDevices,
  onCancel,
  onSubmit,
  resetRaspberryLocation,
  newName,
  setNewName,
  newHeight,
  setNewHeight,
}: Props) => (
  <CalibrationBar>
    <CalibrationHeader>Set Raspberry Pi locations</CalibrationHeader>
    <InfoSection>
      Click location on map and enter name and height in millimeters relative to
      the second floor for the Raspberry Pi.
    </InfoSection>
    {raspberryDevices.map((device, i) => (
      <RaspberryRow key={'rpi-' + i}>
        <RaspberryHeader>{device.name}</RaspberryHeader>
        <LocationRow>
          N {device.lat.toFixed(6)}° E {device.lon.toFixed(6)}°
        </LocationRow>
      </RaspberryRow>
    ))}
    <Divider />
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
          resetRaspberryLocation();
        }
      }}
    >
      <InputRow>
        <InputCol>
          <Input
            placeholder="Device name"
            value={newName}
            onChange={e => setNewName(e.target.value)}
          />
          <Input
            placeholder="Elevation mm"
            value={newHeight}
            type="number"
            onChange={e => setNewHeight(e.target.value)}
          />
        </InputCol>
        <AddNewButton
          disabled={
            raspberryLocation === null || newName === '' || newHeight === ''
          }
        >
          Add new
        </AddNewButton>
      </InputRow>
    </form>
    <CancelButton onClick={() => onCancel()}>Cancel</CancelButton>
    <SubmitButton
      disabled={raspberryDevices.length === 0}
      onClick={() => onSubmit(raspberryDevices)}
    >
      Submit
    </SubmitButton>
  </CalibrationBar>
);

export default CalibrationContainer;
