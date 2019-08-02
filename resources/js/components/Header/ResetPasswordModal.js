import React from 'react';
import { Modal, Section, Button, Form, Notification } from 'react-bulma-components';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import { resetPassword } from '../../actions/user';

const StyledModalContent = styled(Modal.Content)`
    max-width: 400px;
`;

class ResetPasswordModal extends React.Component{
    constructor(){
        super()

        this.initialState = {
            password: '',
            password_confirmation: '',
        };

        this.state = this.initialState;
    }

    static propTypes = {
        show: PropTypes.bool.isRequired,
        close: PropTypes.func.isRequired,
    }

    handleChange = ({ field, value }) => {
        this.setState({
            [field]: value
        });
    }

    handleSubmit = (e) => {
        const { password, password_confirmation } = this.state;
        
        e.preventDefault();
        
        this.props.resetPassword({ password, password_confirmation, signature: this.props.location.search });

        this.setState(this.initialState);
    };

    render(){
        
        const { password, password_confirmation } = this.state;
        const { status, show, close, messages } = this.props;

        return <Modal show={show} onClose={close}>
            <StyledModalContent>
                <Section style={{ backgroundColor: 'white' }}>
                    <form onSubmit={(e) => this.handleSubmit(e)}>
                        <Form.Field>
                            <Form.Label>Password</Form.Label>
                            <Form.Input
                                autoFocus
                                type="password"
                                placeholder="Type your new password"
                                value={password}
                                disabled={status === 'PROGRESS'} 
                                onChange={(e) => this.handleChange({ field: 'password', value: e.target.value }) }
                            />
                        </Form.Field>

                        <Form.Field>
                            <Form.Label>Confirm password</Form.Label>
                            <Form.Input
                                type="password"
                                placeholder="Retype your password"
                                value={password_confirmation}
                                disabled={status === 'PROGRESS'} 
                                onChange={(e) => this.handleChange({ field: 'password_confirmation', value: e.target.value }) }
                            />
                        </Form.Field>

                        <Form.Field>
                            <Button
                                loading={status === 'PROGRESS'}
                                color='primary' type="submit"
                            >Submit</Button>
                        </Form.Field>

                        {status === 'ERROR' &&
                            <Form.Field>
                                {messages.slice(0, 2).map((message, index) => 
                                    <Notification color='danger' key={`reset-message-${index}`}>{message}</Notification>
                                )}
                            </Form.Field>   
                        }
                    </form>
                </Section>
            </StyledModalContent>
        </Modal>
    }
}

const mapStateToProps = state => ({
    status: state.user.passwordResetStatus,
    messages: state.user.passwordResetMessages,
});

const mapDispatchToProps = {
    resetPassword,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ResetPasswordModal));