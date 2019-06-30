import React, { Component, Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import { Heading, Hero, Button, Modal, Navbar, Form } from 'react-bulma-components';
import styled, { withTheme } from 'styled-components';
import LoginModal from './LoginModal';
import { darken } from 'polished';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { toggleLoginModal, toggleRegisterModal } from '../../actions/user';
import SignInOut from './SignInOut';
import RegisterModal from './RegisterModal';


const NavContainer = styled.div`
    display: flex;
    justify-content: space-between;
`;

const WordMark = styled(Heading)`
    padding: 1rem;
    color: white;
    display: inline-block;
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

const ExpandedNavLink = styled(NavLink)`
    color: white;
    display: flex;
    align-items: center;
    height: 100%;
    width: 100%;
    padding: 10px;
`;

const TightNavbarItem = styled(Navbar.Item)`
    padding: 0;
`;

const NavbarItem = props => <TightNavbarItem 
        onClick={(e) => e.preventDefault()}
    >
        <ExpandedNavLink to={props.to}>
            {props.children}
        </ExpandedNavLink>
    </TightNavbarItem>;


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

    render() {
        const { user } = this.props;

        return (
            <Fragment>
                <Navbar
                    active={this.state.open}
                    color='primary'
                >
                    <NavContainer>
                        <WordMark>Save On Waves</WordMark>
                        <Navbar.Burger
                            active={this.state.open}
                            onClick={this.toggleMobileNav}
                        />
                    </NavContainer>
                    <Navbar.Menu active={this.state.open}>
                        <Navbar.Container
                            position='end'
                        >
                            <NavbarItem to='best-deals'>Best Deals</NavbarItem>
                            {user.status === 'LOGGED_IN' && 
                                <NavbarItem to='/my-alerts'>
                                    My Alerts
                                </NavbarItem>
                            }
                            {user.status === 'LOGGED_IN' && 
                                <NavbarItem to='/account/personal-info'>
                                    Account
                                </NavbarItem>
                            }
                            <Navbar.Item renderAs='span'>
                                <Form.Field className='has-addons'>
                                    <Form.Control>
                                        <Form.Input type="text" placeholder="Plugin or bundle" />
                                    </Form.Control>
                                    <Form.Control>
                                        <Button>
                                            Search
                                        </Button>
                                    </Form.Control>
                                </Form.Field>
                            </Navbar.Item>

                            {user.status === 'LOGGED_IN' && 
                                <Navbar.Item>
                                    <SignInOut />
                                </Navbar.Item>
                            }

                            {user.status !== 'LOGGED_IN' &&
                                <Fragment>
                                    <LoginButton
                                        onClick={() => this.props.toggleLoginModal(true)}
                                    >
                                        Login
                                    </LoginButton>
                                    {user.status !== 'REGISTERED' &&
                                        <RegisterButton
                                            onClick={() => this.props.toggleRegisterModal(true)}
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
    connect(mapStateToProps, mapDispatchToProps),
    withTheme
)(Header);