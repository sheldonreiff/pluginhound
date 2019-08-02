import React, { Component } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import 'react-bulma-components/dist/react-bulma-components.min.css';
import 'react-redux-notify/dist/ReactReduxNotify.css';
import 'babel-runtime/core-js/object/assign';

import store from './store';
import styled from 'styled-components';

import { getMe, verifyEmail } from './actions/user';

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
        return <WhenAuthenticated else={isMainContent ? Home : null} children={component} />;
    }
    
    componentWillMount(){
        this.props.getMe();
    }

    componentDidMount(){
        if(this.props.location.pathname === '/verify'){
            this.props.verifyEmail();
        }
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

                            <Route path='/account' render={ () => <WhenAuthenticated else={Home}><Account/></WhenAuthenticated>}/>
                            <Route path='/verify' exact component={Home} />
                            <Route path='/reset' exact component={Home} />

                            <Route path='/my-alerts' exact component={MyAlerts} />

                            <Route path='/all-products' exact render={() => <Products key='all' view='all' />} />
                            <Route path='/search' exact render={() => <Products key='search' view='search' />}/>
                            <Route path='/product/:sku' exact component={Product} />

                            <Route component={NotFound} />
                        </Switch>
                        <Route path='/account/password' exact render={ () => <WhenAuthenticated><UpdatePassword/></WhenAuthenticated>} />
                        <Route path='/account/personal-info' exact render={ () => <WhenAuthenticated><UpdatePersonal/></WhenAuthenticated>} />
                    </Content>
                </Main>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    userStatus: state.user.status
});

const mapDispatchToProps = {
    verifyEmail,
    getMe,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));