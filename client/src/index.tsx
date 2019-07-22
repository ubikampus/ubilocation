import React from 'react';
import ReactDOM from 'react-dom';
import Router from './router';
import Modal from 'react-modal';
import './global.css';
import './normalize.css';
import './skeleton.css';

// Needed for accessibility
Modal.setAppElement('#app');

ReactDOM.render(<Router />, document.querySelector('#app'));
