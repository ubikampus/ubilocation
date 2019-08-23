import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import { setAutoFreeze } from 'immer';

import './global.css';
import ConfigContainer from './configContainer';

// We use immer for the Mapbox style.json, but mapbox itself mutates it, so we
// cannot use freezed objects.
setAutoFreeze(false);

// Needed for accessibility
Modal.setAppElement('#app');

ReactDOM.render(<ConfigContainer />, document.querySelector('#app'));
