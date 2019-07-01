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
import UpdatePassword from './components/Account/UpdatePassword';
import UpdatePersonal from './components/Account/UpdatePersonal';
import VerifyEmail from './components/VeifyEmail/VerifyEmail';
import Product from './components/Product/Product';

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
                            <Route path='/account' exact component={Account} />
                            <Route path='/verify' exact component={VerifyEmail} />
                            
                            <Route path='/product/:sku' exact component={Product} />
                        </Switch> 
                        <Container>
                            <Route path='/account/password' exact component={UpdatePassword} />
                            <Route path='/account/personal-info' exact component={UpdatePersonal} />
                        </Container>
                    </Router>
                </ThemeProvider>
            </Provider>
        );
    }
}

