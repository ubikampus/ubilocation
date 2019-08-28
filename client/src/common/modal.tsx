/**
 * Generic modal and modal subcomponents with reasonable default styles.
 */

import React, { FC } from 'react';
import styled from 'styled-components';
import ReactModal from 'react-modal';
import merge from 'lodash/merge';
import cloneDeep from 'lodash/merge';

import ubiukko from './ubiukko.png';

import { currentEnv } from './environment';

if (currentEnv.NODE_ENV !== 'test') {
  ReactModal.setAppElement('#app');
}

const modalStyles = {
  overlay: {
    zIndex: '1001',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'auto',
  },
  content: {
    boxShadow: 'rgba(0, 0, 0, 0.10) 7px 7px 0px',
    border: 'none',
    flex: '0 1 380px',
    position: 'static',
    margin: '15px',
    maxHeight: '100vh',
  },
};

export const ModalParagraph = styled.p`
  line-height: 1.3;
  margin: 10px 0;

  font-size: 15px;
`;

export const ModalButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 5px;
`;

export const ModalHeader = styled.h3`
  margin-top: 5px;
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 20px;
`;

const UbiLogoImg = styled.img`
  height: 70px;
  margin-right: 25px;
  margin-left: 10px;
  align-self: center;
`;

interface UbiLogoProps {
  className?: string;
}

export const UbiLogo = ({ className }: UbiLogoProps) => (
  <UbiLogoImg className={className} src={ubiukko} />
);

const Modal: FC<ReactModal.Props> = ({ children, style, ...props }) => (
  <ReactModal style={merge(cloneDeep(modalStyles), style)} {...props}>
    {children}
  </ReactModal>
);

export default Modal;
