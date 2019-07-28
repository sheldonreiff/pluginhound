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
import Account from './components/Account/Account';
import Header from './components/Header/Header';
import UpdatePassword from './components/Account/UpdatePassword';
import UpdatePersonal from './components/Account/UpdatePersonal';
import Product from './components/Product/Product';
import Products from './components/Products/Products';
import MyAlerts from './components/MyAlerts/MyAlerts';
import NotFound from './components/NotFound';
import NotificationBar from './components/Header/NotificationBar';
import WhenAuthenticated from './components/helpers/WhenAuthenticated';

const Main = styled.div`
    padding-top: 60px;
    position: relative;
`;

const Content = styled.div`
    padding-bottom: 20px;
    padding-right: 3%;
    padding-left: 3%;
`;

const Home = props => <Products key='deals' view='bestDeals' />;

class App extends Component
{
    protected = (component, isMainContent=true) => {
        return <WhenAuthenticated else={isMainContent ? Home : null} chilren={component} />;
    }
    
    componentWillMount(){
        store.dispatch(getMe());
    }

    render(){
        return (
           <React.Fragment>
                <Header />
                <Main>
                    <NotificationBar />
                    <Content>
                        <Switch>
                            <Route path='/' exact render={Home} />

                            <Route path='/account' component={this.protected(Home)} />
                            <Route path='/verify' exact component={Home} />

                            <Route path='/my-alerts' exact component={MyAlerts} />

                            <Route path='/all-products' exact render={() => <Products key='all' view='all' />} />
                            <Route path='/search' exact render={() => <Products key='search' view='search' />}/>
                            <Route path='/product/:sku' exact component={Product} />

                            <Route component={NotFound} />
                        </Switch>
                        <Route path='/account/password' exact component={this.protected(UpdatePassword, false)} />
                        <Route path='/account/personal-info' exact component={this.protected(UpdatePersonal, false)} />
                    </Content>
                </Main>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    userStatus: state.user.status
});

export default connect(mapStateToProps)(App);