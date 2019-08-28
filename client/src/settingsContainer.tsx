import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import styled from 'styled-components';

import { ModalHeader, ModalParagraph } from './common/modal';
import { PrimaryButton } from './common/button';

const Container = styled.div`
  padding: 8px 8px;
`;

interface Props {
  setSettingsModeActive(a: boolean): void;
}

const SettingsContainer = ({
  setSettingsModeActive,
}: RouteComponentProps & Props) => {
  return (
    <Container>
      <ModalHeader>Settings</ModalHeader>
      <ModalParagraph>
        Press the button below to reset your beacon ID:
      </ModalParagraph>
      <PrimaryButton onClick={e => setSettingsModeActive(true)}>
        Set beacon ID
      </PrimaryButton>
    </Container>
  );
};

export default withRouter(SettingsContainer);
