/**
 * Generic modal component with reasonable default styles.
 */

import React, { FC } from 'react';
import ReactModal from 'react-modal';
import merge from 'lodash/merge';
import cloneDeep from 'lodash/merge';

import { currentEnv } from '../common/environment';

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

const Modal: FC<ReactModal.Props> = ({ children, style, ...props }) => (
  <ReactModal style={merge(cloneDeep(modalStyles), style)} {...props}>
    {children}
  </ReactModal>
);

export default Modal;
