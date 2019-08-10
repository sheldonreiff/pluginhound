import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { Router } from 'react-router-dom';

import history from './history';
import theme from './theme';
import store from './store';

import App from './app.js';

const AppContainer = props => <Provider store={store}>
    <ThemeProvider theme={theme} >
        <Router history={history} >
            <App />
        </Router>
    </ThemeProvider>
</Provider>;

export default AppContainer;