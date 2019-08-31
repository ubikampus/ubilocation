import React from 'react';
import styled from 'styled-components';
import { animated } from 'react-spring';
import { Transition } from 'react-spring/renderprops';
import { TiChevronLeft } from 'react-icons/ti';

import {
  PrimaryButton,
  SecondaryButton,
  SidebarCloseButton,
} from '../common/button';
import { Location } from '../common/typeUtil';
import { geoCoordsToPlaneCoords } from '../location/mqttDeserialize';

const CancelButton = styled(SecondaryButton)`
  border: none;
`;

export interface AndroidLocation {
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

const AndroidRow = styled.div`
  margin: 10px 0;
`;

const LocationRow = styled.div`
  font-size: 10px;
  margin: 5px 0;
`;

const AndroidHeader = styled.h5`
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

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

interface Props {
  getDeviceLocation: Location | null;
  isAdminPanelOpen: boolean;
  devices: AndroidLocation[];
  setDevices(a: AndroidLocation[]): void;
  onCancel(): void;
  onSubmit(a: AndroidLocation[]): void;
  resetDeviceLocation(): void;
  onLogout(): void;
  newName: string;
  setNewName(a: string): void;
  newHeight: string;
  setNewHeight(a: string): void;
}

const AdminPanel = ({
  getDeviceLocation,
  devices,
  setDevices,
  onCancel,
  onSubmit,
  isAdminPanelOpen,
  onLogout,
  resetDeviceLocation,
  newName,
  setNewName,
  newHeight,
  setNewHeight,
}: Props) => (
  <Transition
    items={isAdminPanelOpen}
    from={{ marginLeft: -350 }}
    enter={{ marginLeft: 0 }}
    leave={{ marginLeft: -350 }}
    config={{ mass: 1, tension: 275, friction: 25, clamp: true }}
  >
    {show =>
      show &&
      (props => (
        <Sidebar style={props}>
          <SidebarContent>
            <div>
              <HeaderRow>
                <CalibrationHeader>
                  Set Android scanner locations
                </CalibrationHeader>
                <SidebarCloseButton>
                  <TiChevronLeft onClick={() => onCancel()} />
                </SidebarCloseButton>
              </HeaderRow>
              <InfoSection>
                Click location on map, and enter name and height in millimeters
                for the Android device. Height should be given relative to the
                second floor.
              </InfoSection>
              {devices.map((device, i) => (
                <AndroidRow key={'rpi-' + i}>
                  <AndroidHeader>{device.name}</AndroidHeader>
                  <LocationRow>
                    N {device.lat.toFixed(6)}° E {device.lon.toFixed(6)}° x:
                    {geoCoordsToPlaneCoords(device, device.height).x} y:
                    {geoCoordsToPlaneCoords(device, device.height).y} z:
                    {device.height}
                  </LocationRow>
                </AndroidRow>
              ))}
              <Divider />
              <form
                onSubmit={e => {
                  e.preventDefault();
                  if (getDeviceLocation) {
                    const newDevice = {
                      name: newName,
                      lat: getDeviceLocation.lat,
                      lon: getDeviceLocation.lon,
                      height: parseInt(newHeight, 10),
                    };
                    setDevices([...devices, newDevice]);
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
                      getDeviceLocation === null ||
                      newName === '' ||
                      newHeight === ''
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
              <SecondaryButton onClick={() => onLogout()}>
                Log out
              </SecondaryButton>
            </BottomRow>
          </SidebarContent>
        </Sidebar>
      ))
    }
  </Transition>
);

export default animated(AdminPanel);
