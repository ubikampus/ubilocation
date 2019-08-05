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
    alignItems: 'flex-start',
  },
  content: {
    boxShadow: '2px 2px 10px hsla(0, 0%, 0%, 15%)',
    border: 'none',
    flex: '0 1 400px',
    position: 'static',
    margin: '20px 10px',
  },
};

export const ModalParagraph = styled.p`
  line-height: 1.25;
  margin: 10px 0;
`;

export const ModalButtonRow = styled.div`
  margin-top: 25px;
`;

export const ModalHeader = styled.h3`
  margin-top: 0;
  font-size: 18px;
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
