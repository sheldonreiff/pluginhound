import React, { Component } from 'react';
import { Modal, Form, Section, Button, Notification } from 'react-bulma-components';
import PropTypes from 'prop-types';
import { withTheme } from 'styled-components';
import { connect } from 'react-redux';
import { compose } from 'redux';
import styled from 'styled-components';

import { login, toggleLoginModal, toggleRegisterModal, toggleResetMode, sendPasswordReset } from '../../actions/user';

const ActionPanel = styled(Form.Control)`
    display: flex;
    justify-content: space-between;
`;

const StyledModalContent = styled(Modal.Content)`
    max-width: 400px;
`;

const OtherActions = styled.div`
    display: flex;
    flex-direction: column;
`;

class LoginModal extends Component {
    constructor(){
        super();

        this.initialState = {
            email: '',
            password: ''
        };

        this.state = this.initialState;
    }

    handleChange = ({ field, value }) => {
        this.setState({
            [field]: value
        });
    }

    handleSubmit = (e) => {
        const { email, password } = this.state;
        
        e.preventDefault();
        
        if(this.props.resetMode){
            this.sendReset();
        }else{
            this.props.login({ email, password });
        }

        this.setState(this.initialState);
    };

    register = () => {
        this.props.toggleLoginModal(false);
        this.props.toggleRegisterModal(true);
    }

    showReset = () => {
        this.props.toggleResetMode(true);
    }

    hideReset = () => {
        this.props.toggleResetMode(false);
    }

    sendReset = () => {
        this.props.sendPasswordReset(this.state.email);
    }

    render(){

        const { email, password } = this.state;
        const { messages, status, show, close, resetMode, sendResetStatus, passwordResetStatus } = this.props;

        return <Modal show={show} onClose={close} >
                <StyledModalContent>
                    <Section style={{ backgroundColor: 'white' }}>
                        <form onSubmit={(e) => this.handleSubmit(e)}>

                            <Form.Field>
                                <Form.Label>Email</Form.Label>
                                <Form.Control>
                                    <Form.Input
                                        type="email"
                                        placeholder="Type your email"
                                        value={email}
                                        disabled={status === 'PROGRESS'} 
                                        onChange={(e) => this.handleChange({ field: 'email', value: e.target.value }) }
                                        autoFocus
                                    />
                                </Form.Control>
                            </Form.Field>

                            {!resetMode &&
                                <Form.Field>
                                    <Form.Label>Password</Form.Label>
                                    <Form.Input
                                        autoFocus
                                        type="password"
                                        placeholder="Type your password"
                                        value={password}
                                        disabled={status === 'PROGRESS'} 
                                        onChange={(e) => this.handleChange({ field: 'password', value: e.target.value }) }
                                    />
                                </Form.Field>
                            }

                            {!resetMode &&
                                <React.Fragment>
                                    {status === 'ERROR' &&
                                        messages.slice(0, 2).map(message =>
                                            <Notification color='danger'>
                                                {message}
                                            </Notification>
                                        )
                                    }

                                    {status === 'REGISTERED' &&
                                        <Notification color='success'>
                                            Thanks for signing up! Log in with your new account, then check your email for a confimration link to finish up.
                                        </Notification>
                                    }
                                </React.Fragment>
                            }

                            {resetMode &&
                                <React.Fragment>
                                    {sendResetStatus === 'SUCCESS' &&
                                        <Notification color='success'>Password reset email sent! Please check your email.</Notification>
                                    }

                                    {sendResetStatus === 'ERROR' &&
                                        <Notification color='danger'>Couldn't send password reset email</Notification>
                                    }
                                </React.Fragment>
                                
                            }

                            {passwordResetStatus === 'SUCCESS' &&
                                <Notification color='success'>Password reset successfully! Please login with your new password</Notification>
                            }

                            <ActionPanel>

                                <Button
                                    loading={status === 'PROGRESS' || sendResetStatus === 'PROGRESS'}
                                    color='primary' type="submit"
                                >{resetMode ? 'Send Reset' : 'Login'}</Button>

                                <OtherActions>
                                    <a onClick={this.register}>I don't have an account</a>
                                    or
                                    {!resetMode &&
                                        <a onClick={this.showReset}>I forgot my password</a>
                                    }
                                    {resetMode &&
                                        <a onClick={this.hideReset}>Back to Login</a>
                                    }
                                </OtherActions>
                            </ActionPanel>
                        </form>
                    </Section>
                </StyledModalContent>
        </Modal>;
    }
};

LoginModal.propTypes = {
    show: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    messages: state.user.messages,
    status: state.user.status,
    resetMode: state.user.resetMode,
    sendResetStatus: state.user.sendResetStatus,
    passwordResetStatus: state.user.passwordResetStatus,
});

const mapDispatchToProps = {
    login,
    toggleLoginModal,
    toggleRegisterModal,
    toggleResetMode,
    sendPasswordReset,
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withTheme
)(LoginModal);