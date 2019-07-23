import React from 'react';
import ReactDOM from 'react-dom';
import Router from './router';
import Modal from 'react-modal';
import './global.css';
import { setAutoFreeze } from 'immer';

// We use immer for the Mapbox style.json, but mapbox itself mutates it, so we
// cannot use freezed objects.
setAutoFreeze(false);

// Needed for accessibility
Modal.setAppElement('#app');

ReactDOM.render(<Router />, document.querySelector('#app'));
