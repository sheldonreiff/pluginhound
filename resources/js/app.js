import React, { Component } from 'react';
import { ThemeProvider } from 'styled-components';
import theme from './theme';
import { Router, Route, Switch } from 'react-router-dom';

import 'react-bulma-components/dist/react-bulma-components.min.css';
import 'react-redux-notify/dist/ReactReduxNotify.css';
import 'babel-runtime/core-js/object/assign';

import { Provider } from 'react-redux';
import store from './store';
import history from './history';
import { Container } from 'react-bulma-components'; 

import { getMe } from './actions/user';

// components
import Main from './components/Main/Main';
import Home from './components/Home/Home';
import Account from './components/Account/Account';
import Header from './components/Header/Header';
import ChangePassword from './components/Account/ChangePassword';

export default class App extends Component
{
    componentWillMount(){
        store.dispatch(getMe());
    }

    render(){
        return (
            <Provider store={store}>
                <ThemeProvider theme={theme}>
                    <Router history={history}>
                        <Header />
                        <Switch>
                            <Route path='/' exact component={Home} />
                            <Route path='/account' component={Account} />
                        </Switch> 
                        <Container>
                            <Route path='/account/password' exact component={ChangePassword} />
                        </Container>
                    </Router>
                </ThemeProvider>
            </Provider>
        );
    }
}

