require('./bootstrap');

import React from 'react';
import ReactDOM from 'react-dom';

import AppContainer from './AppContainer';

if (document.getElementById('root')) {
    ReactDOM.render(<AppContainer />, document.getElementById('root'));
}
