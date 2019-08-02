import React from 'react';
import { Tabs } from 'react-bulma-components';
import styled from 'styled-components';
import { connect } from 'react-redux';
import history from '../../history';
import { withRouter } from 'react-router-dom';

import { changeTab, clearResults } from '../../actions/account';

const AccountContainer = styled.div`
    margin-bottom: 20px;
`;

class Account extends React.Component{

    changeTab = (newTab) => {
        history.push(`/account/${newTab}`);
        this.props.clearResults();
    }

    render(){

        const { location } = this.props;
        
        return <AccountContainer>
            <Tabs>
                <Tabs.Tab
                    active={location.pathname === '/account/personal-info'}
                    onClick={() => this.changeTab('personal-info')}
                >
                    Personal Info
                </Tabs.Tab>
                <Tabs.Tab
                    active={location.pathname === '/account/password'}
                    onClick={() => this.changeTab('password')}
                >
                    Password
                </Tabs.Tab>
            </Tabs>
        </AccountContainer>;
    }
}

const mapDispatchToProps = {
    changeTab,
    clearResults
};

const mapStateToProps = state => ({
    tab: state.account.tab
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Account));