import React from 'react';
import { Tabs, Container } from 'react-bulma-components';
import styled from 'styled-components';
import { connect } from 'react-redux';
import history from '../../history';
import { withRouter } from 'react-router-dom';
import { Route, Switch } from 'react-router-dom';

import { changeTab } from '../../actions/account';

class Account extends React.Component{

    changeTab = (newTab) => {
        history.push(`/account/${newTab}`);
    }

    render(){

        const { location } = this.props;

        return <Container>
            <Tabs>
                <Tabs.Tab
                    active={location.pathname === '/account/password'}
                    onClick={() => this.changeTab('password')}
                >
                    Password
                </Tabs.Tab>
                <Tabs.Tab
                    active={location.pathname === '/account/email'}
                    onClick={() => this.changeTab('email')}
                >
                    Email
                </Tabs.Tab>
            </Tabs>
        </Container>;
    }
}

const mapDispatchToProps = {
    changeTab
};

const mapStateToProps = state => ({
    tab: state.account.tab
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Account));