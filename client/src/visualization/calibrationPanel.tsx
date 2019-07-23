import React from 'react';
import styled from 'styled-components';

import Button from './button';
import { Location } from '../common/typeUtil';

const PrimaryButton = styled(Button)`
  background: #4287f5;
  color: white;

  &&:hover {
    color: #eee;
  }
`;

const CancelButton = styled(Button)`
  background: white;
`;

const SecondaryButton = styled(Button)`
  background: #f3f6f7;
`;

export interface RaspberryLocation {
  name: string;
  lat: number;
  lon: number;
  height: number;
}

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

const LogoutButton = styled(Button)`
  margin-top: auto;
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

const BottomRow = styled.div`
  display: flex;
  margin-top: auto;
`;

const SidebarContent = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 20px;
`;

const Sidebar = styled.nav`
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  width: 350px;
  height: 100%;
  z-index: 1001;
  background-color: white;
`;

interface Props {
  raspberryLocation: Location | null;
  raspberryDevices: RaspberryLocation[];
  setRaspberryDevices(a: RaspberryLocation[]): void;
  onCancel(): void;
  onSubmit(a: RaspberryLocation[]): void;
  resetRaspberryLocation(): void;
  onLogout(): void;
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
  onLogout,
  resetRaspberryLocation,
  newName,
  setNewName,
  newHeight,
  setNewHeight,
}: Props) => (
  <Sidebar>
    <SidebarContent>
      <div>
        <CalibrationHeader>Set Raspberry Pi locations</CalibrationHeader>
        <InfoSection>
          Click location on map, and enter name and height in millimeters for
          the Raspberry Pi. Height should be given relative to the second floor.
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
                placeholder="Height mm"
                value={newHeight}
                type="number"
                onChange={e => setNewHeight(e.target.value)}
              />
            </InputCol>
            <PrimaryButton
              disabled={
                raspberryLocation === null || newName === '' || newHeight === ''
              }
            >
              Add new
            </PrimaryButton>
          </InputRow>
        </form>
        <CancelButton onClick={() => onCancel()}>Cancel</CancelButton>
        <SecondaryButton
          disabled={raspberryDevices.length === 0}
          onClick={() => onSubmit(raspberryDevices)}
        >
          Submit
        </SecondaryButton>
      </div>
      <BottomRow>
        <SecondaryButton onClick={() => onLogout()}>Log out</SecondaryButton>
      </BottomRow>
    </SidebarContent>
  </Sidebar>
);

export default CalibrationContainer;
