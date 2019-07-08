import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import 'react-bulma-components/dist/react-bulma-components.min.css';
import 'react-redux-notify/dist/ReactReduxNotify.css';
import 'babel-runtime/core-js/object/assign';

import store from './store';
import styled from 'styled-components';

import { getMe } from './actions/user';

// components
import Main from './components/Main/Main';
import Account from './components/Account/Account';
import Header from './components/Header/Header';
import UpdatePassword from './components/Account/UpdatePassword';
import UpdatePersonal from './components/Account/UpdatePersonal';
import VerifyEmail from './components/VeifyEmail/VerifyEmail';
import Product from './components/Product/Product';
import Products from './components/Products/Products';

const Content = styled.div`
    padding: 20px;
    padding-right: 3%;
    padding-left: 3%;
`;

const Home = props => <Products key='deals' view='bestDeals' />;

class App extends Component
{
    protected = (component, isMainContent=true) => {
        const { userStatus } = this.props;
        return userStatus === 'LOGGED_IN'
        ? component
        : (isMainContent ? Home : null);
    }
    
    componentWillMount(){
        store.dispatch(getMe());
    }

    render(){
        return (
           <React.Fragment>
                <Header />
                <Content>
                    <Switch>
                        <Route path='/' exact render={Home} />

                        <Route path='/account' component={this.protected(Account)} />
                        <Route path='/verify' exact component={VerifyEmail} />
                        
                        <Route path='/all-products' exact render={() => <Products key='all' view='all' />} />
                        <Route path='/search' exact render={() => <Products key='search' view='search' />}/>
                        <Route path='/product/:sku' exact component={Product} />
                    </Switch>
                    <Route path='/account/password' exact component={this.protected(UpdatePassword, false)} />
                    <Route path='/account/personal-info' exact component={this.protected(UpdatePersonal, false)} />
                </Content>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    userStatus: state.user.status
});

export default connect(mapStateToProps)(App);