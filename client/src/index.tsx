import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import './global.css';
import Router from './router';

// Needed for accessibility
Modal.setAppElement('#app');

ReactDOM.render(<Router />, document.querySelector('#app'));
