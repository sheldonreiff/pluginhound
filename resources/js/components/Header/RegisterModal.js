import React, { Component } from 'react';
import { Modal, Form, Section, Button, Notification } from 'react-bulma-components';
import PropTypes from 'prop-types';
import { withTheme } from 'styled-components';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { register } from '../../actions/user';
import styled from 'styled-components';

const StyledModalContent = styled(Modal.Content)`
    max-width: 400px;
`;

class RegisterModal extends Component {
    constructor(){
        super();

        this.initialState = {
            email: '',
            firstName: '',
            lastName: '',
            password: '',
            confirmPassword: ''
        };

        this.state = this.initialState;
    }

    handleChange = ({ field, value }) => {
        this.setState({
            [field]: value
        });
    }

    handleSubmit = (e) => {
        const { firstName, lastName, email, password, confirmPassword } = this.state;
        
        e.preventDefault();
        
        this.props.register({ firstName, lastName, email, password, confirmPassword });

        this.setState({
            ...this.state,
            password: this.initialState.password,
            confirmPassword: this.initialState.confirmPassword
        });
    };

    render(){

        const { email, firstName, lastName, password, confirmPassword } = this.state;
        const { messages, status, show, close } = this.props;

        const disabled = status === 'REGISTER_PROGRESS';

        return <Modal show={show} onClose={close}>
            <StyledModalContent>
                <Section style={{ backgroundColor: 'white' }}>
                    <form onSubmit={(e) => this.handleSubmit(e)}>
                        <Form.Field>
                            <Form.Label>First Name</Form.Label>
                            <Form.Control>
                                <Form.Input
                                    type="text"
                                    placeholder="Type your first name"
                                    value={firstName}
                                    name='firstName'
                                    onChange={(e) => this.handleChange({ field: e.target.name, value: e.target.value }) }
                                    disabled={disabled}
                                    autoFocus
                                />
                            </Form.Control>
                        </Form.Field>

                        <Form.Field>
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control>
                                <Form.Input
                                    type="text"
                                    placeholder="Type your last name"
                                    value={lastName}
                                    name='lastName'
                                    onChange={(e) => this.handleChange({ field: e.target.name, value: e.target.value }) }
                                    disabled={disabled}
                                />
                            </Form.Control>
                        </Form.Field>

                        <Form.Field>
                            <Form.Label>Email</Form.Label>
                            <Form.Control>
                                <Form.Input
                                    type="email"
                                    placeholder="Type your email"
                                    value={email}
                                    name='email'
                                    onChange={(e) => this.handleChange({ field: e.target.name, value: e.target.value }) }
                                    disabled={disabled}
                                />
                            </Form.Control>
                        </Form.Field>

                        <Form.Field>
                            <Form.Label>Password</Form.Label>
                            <Form.Input
                                    type="password"
                                    placeholder="Type a password"
                                    value={password}
                                    name='password'
                                    onChange={(e) => this.handleChange({ field: e.target.name, value: e.target.value }) }
                                    disabled={disabled}
                                />
                        </Form.Field>

                        <Form.Field>
                            <Form.Label>Confirm password</Form.Label>
                            <Form.Input
                                    type="password"
                                    placeholder="Type your password again"
                                    value={confirmPassword}
                                    name='confirmPassword'
                                    onChange={(e) => this.handleChange({ field: e.target.name, value: e.target.value }) }
                                    disabled={disabled}
                                />
                        </Form.Field>

                        {status === 'REGISTER_ERROR' &&
                            messages.slice(0, 2).map(message =>
                                <Notification color='danger'>
                                    {message}
                                </Notification>
                            )
                        }

                        <Form.Control>
                            <Button color='primary' type="submit" disabled={disabled}>Register</Button>
                        </Form.Control>
                    </form>
                </Section>
            </StyledModalContent>
        </Modal>;
    }
};

RegisterModal.propTypes = {
    show: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    messages: state.user.messages,
    status: state.user.status
});

const mapDispatchToProps = {
    register
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withTheme
)(RegisterModal);