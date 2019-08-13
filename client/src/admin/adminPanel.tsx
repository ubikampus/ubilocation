import React from 'react';
import styled from 'styled-components';
import { animated } from 'react-spring';

import { PrimaryButton, SecondaryButton } from '../common/button';
import { TiChevronLeft } from 'react-icons/ti';
import { Location } from '../common/typeUtil';

const CancelButton = styled(SecondaryButton)`
  border: none;
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

const Sidebar = styled(animated.nav)`
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  width: 350px;
  height: 100%;
  z-index: 1001;
  background-color: white;
`;

interface Props {
  getDeviceLocation: Location | null;
  devices: RaspberryLocation[];
  setDevices(a: RaspberryLocation[]): void;
  onCancel(): void;
  onSubmit(a: RaspberryLocation[]): void;
  resetDeviceLocation(): void;
  onLogout(): void;
  style: object;
  toggleRoomReservation(): void;
  newName: string;
  setNewName(a: string): void;
  newHeight: string;
  setNewHeight(a: string): void;
}

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

const CloseButton = styled.div`
  width: 30px;
  height: 30px;
  margin-top: -10px;
  margin-right: -10px;
  padding: 5px;

  color: #4d4d4d;
  cursor: pointer;

  & > svg {
    height: 100%;
    width: 100%;
  }
`;

const AdminPanel = ({
  getDeviceLocation,
  devices,
  setDevices,
  onCancel,
  onSubmit,
  style,
  toggleRoomReservation,
  onLogout,
  resetDeviceLocation,
  newName,
  setNewName,
  newHeight,
  setNewHeight,
}: Props) => (
  <Sidebar style={style}>
    <SidebarContent>
      <div>
        <HeaderRow>
          <CalibrationHeader>Set Raspberry Pi locations</CalibrationHeader>
          <CloseButton>
            <TiChevronLeft onClick={() => onCancel()} />
          </CloseButton>
        </HeaderRow>
        <InfoSection>
          Click location on map, and enter name and height in millimeters for
          the Raspberry Pi. Height should be given relative to the second floor.
        </InfoSection>
        {devices.map((device, i) => (
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
            if (getDeviceLocation) {
              setDevices([
                ...devices,
                {
                  name: newName,
                  lat: getDeviceLocation.lat,
                  lon: getDeviceLocation.lon,
                  height: parseInt(newHeight, 10),
                },
              ]);
              setNewName('');
              setNewHeight('');
              resetDeviceLocation();
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
                getDeviceLocation === null || newName === '' || newHeight === ''
              }
            >
              Add new
            </PrimaryButton>
          </InputRow>
        </form>
        <CancelButton onClick={() => onCancel()}>Cancel</CancelButton>
        <SecondaryButton
          disabled={devices.length === 0}
          onClick={() => onSubmit(devices)}
        >
          Submit
        </SecondaryButton>
      </div>
      <BottomRow>
        <SecondaryButton onClick={() => onLogout()}>Log out</SecondaryButton>
        <SecondaryButton onClick={() => toggleRoomReservation()}>
          Room reservation
        </SecondaryButton>
      </BottomRow>
    </SidebarContent>
  </Sidebar>
);

export default animated(AdminPanel);
