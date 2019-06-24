import React, { Component } from 'react';
import { Modal, Form, Section, Button, Notification } from 'react-bulma-components';
import PropTypes from 'prop-types';
import { withTheme } from 'styled-components';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { login } from '../../actions/user';


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
        
        this.props.login({ email, password });

        this.setState(this.initialState);
    };

    render(){

        const { email, password } = this.state;
        const { messages, status, show, close } = this.props;

        return <Modal show={show} onClose={close} closeOnBlur={true} >
                <Modal.Content>
                    <Section style={{ backgroundColor: 'white' }}>
                        <form onSubmit={(e) => this.handleSubmit(e)}>
                            <Form.Field>
                                <Form.Label>Email</Form.Label>
                                <Form.Control>
                                    <Form.Input
                                        type="email"
                                        placeholder="Type your email"
                                        value={email}
                                        onChange={(e) => this.handleChange({ field: 'email', value: e.target.value }) }
                                    />
                                </Form.Control>
                            </Form.Field>
                            <Form.Field>
                                <Form.Label>Password</Form.Label>
                                <Form.Input
                                        type="password"
                                        placeholder="Type your password"
                                        value={password}
                                        onChange={(e) => this.handleChange({ field: 'password', value: e.target.value }) }
                                    />
                            </Form.Field>
                            {status === 'ERROR' &&
                                messages.slice(0, 2).map(message =>
                                    <Notification color='danger'>
                                        {message}
                                    </Notification>
                                )
                            }
                            {status === 'REGISTERED' &&
                                <Notification color='success'>
                                    Thanks for signing up! Check your email for a confimration link to finish up.
                                </Notification>
                            }
                            <Form.Control>
                                <Button disabled={status === 'PROGRESS'} color='primary' type="submit">Login</Button>
                            </Form.Control>
                        </form>
                    </Section>
                </Modal.Content>
        </Modal>;
    }
};

LoginModal.propTypes = {
    show: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    messages: state.user.messages,
    status: state.user.status
});

const mapDispatchToProps = {
    login
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withTheme
)(LoginModal);