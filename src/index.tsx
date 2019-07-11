import React from 'react';
import ReactDOM from 'react-dom';
import Router from './router';
import Modal from 'react-modal';
import './global.css';

// Needed for accessibility
Modal.setAppElement('#app');

ReactDOM.render(<Router />, document.querySelector('#app'));
