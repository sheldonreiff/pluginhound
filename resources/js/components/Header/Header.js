import React, { Component, Fragment } from 'react';
import { Heading, Navbar } from 'react-bulma-components';
import { withRouter } from 'react-router-dom';
import styled, { withTheme } from 'styled-components';
import LoginModal from './LoginModal';
import { darken } from 'polished';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { toggleLoginModal, toggleRegisterModal } from '../../actions/user';
import SignInOut from './SignInOut';
import RegisterModal from './RegisterModal';
import history from '../../history';

import Search from './Search';
import ResetPasswordModal from './ResetPasswordModal';


const NavContainer = styled.div`
    display: flex;
    justify-content: space-between;
`;

const WordMark = styled(Heading)`
    padding: 1rem;
    color: white;
    display: inline-block;
    cursor: pointer;
`;

const LoginButton = styled(Navbar.Item)`
    color: white!important;
    background: ${props => props.theme.blue};
    &:hover{
        background: ${props => darken(.1, props.theme.blue)}!important;
    }
`;

const RegisterButton = styled(Navbar.Item)`
    color: white!important;
    background: ${props => props.theme.orange};
    &:hover{
        background: ${props => darken(.1, props.theme.orange)}!important;
    }
`;

const NavbarItem = props => <Navbar.Item
        renderAs='a'
        onClick={(e) => {
            e.preventDefault();
            history.push(props.to);
            props.additionalAction();
        }}
    >
        {props.children}
    </Navbar.Item>;


class Header extends Component {
    constructor(){
        super();
        
        this.state = {
            showRegister: false,
            open: false
        };
    }

    toggleMobileNav = () => {
        this.setState({
            open: !this.state.open
        });
    }

    goHome = () => {
        history.push('/');
    }

    showLoginModal = () => {
        this.toggleMobileNav();
        this.props.toggleLoginModal(true);
    }

    showRegisterModal = () => {
        this.props.toggleRegisterModal(true)
        this.toggleMobileNav();
    }

    render() {
        const { user } = this.props;

        return (
            <Fragment>
                <Navbar
                    active={this.state.open}
                    color='primary'
                >
                    <NavContainer>
                        <WordMark onClick={this.goHome}>Waves Saver</WordMark>
                        <Navbar.Burger
                            active={this.state.open.toString()}
                            onClick={this.toggleMobileNav}
                        />
                    </NavContainer>
                    <Navbar.Menu active={this.state.open.toString()}>
                        <Navbar.Container
                            position='end'
                        >
                            <NavbarItem to='/' additionalAction={this.toggleMobileNav}>Top Deals</NavbarItem>
                            <NavbarItem to='/all-products' additionalAction={this.toggleMobileNav}>All Products</NavbarItem>
                            {user.status === 'LOGGED_IN' && 
                                <NavbarItem to='/my-alerts' additionalAction={this.toggleMobileNav}>
                                    My Alerts
                                </NavbarItem>
                            }
                            {user.status === 'LOGGED_IN' && 
                                <NavbarItem to='/account/personal-info' additionalAction={this.toggleMobileNav}>
                                    Account
                                </NavbarItem>
                            }
                            <Navbar.Item renderAs='span'>
                                <Search onSearch={this.toggleMobileNav} />
                            </Navbar.Item>

                            {user.status === 'LOGGED_IN' && 
                                <Navbar.Item>
                                    <SignInOut />
                                </Navbar.Item>
                            }

                            {user.status !== 'LOGGED_IN' &&
                                <Fragment>
                                    <LoginButton
                                        onClick={this.showLoginModal}
                                    >
                                        Login
                                    </LoginButton>
                                    {user.status !== 'REGISTERED' &&
                                        <RegisterButton
                                            onClick={this.showRegisterModal}
                                        >
                                            Register
                                        </RegisterButton>
                                    }
                                </Fragment>
                            }
                        </Navbar.Container>
                    </Navbar.Menu>
                </Navbar>

                <LoginModal
                    show={this.props.user.loginOpen}
                    close={() => this.props.toggleLoginModal(false)}
                />

                <RegisterModal
                    show={this.props.user.registerOpen}
                    close={() => this.props.toggleRegisterModal(false)}
                />

                <ResetPasswordModal
                    show={this.props.location.pathname === '/reset'}
                    close={() => history.push('/')}
                />
            </Fragment>
        );
    }
}

const mapDispatchToProps = {
    toggleLoginModal,
    toggleRegisterModal
};

const mapStateToProps = state => ({
    user: state.user
});

export default compose(
    withRouter,
    connect(mapStateToProps, mapDispatchToProps),
    withTheme
)(Header);