import React from 'react';
import { Form, Button, Container, Notification } from 'react-bulma-components';
import styled from 'styled-components';
import { connect } from 'react-redux';

import { updateUser } from '../../actions/account';

const PasswordContainer = styled.div`
    max-width: 400px;
`;


class UpdatePassword extends React.Component{
    constructor(){
        super();

        this.initialState = {
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: '',
        };

        this.state = this.initialState;
    }

    handlePasswordSubmit = (e) => {
        e.preventDefault();

        const { currentPassword, newPassword, confirmNewPassword } = this.state;

        this.props.updateUser({ currentPassword, newPassword, confirmNewPassword });

        this.setState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    }

    handleChange = (key, value) => {
        this.setState({ [key]: value });
    }

    render(){

        const { currentPassword, newPassword, confirmNewPassword } = this.state;

        const { status, errors } = this.props;

        const filledIn = [currentPassword, newPassword, confirmNewPassword].filter(field => field).length;

        return <PasswordContainer>
            <form onSubmit={(e) => this.handlePasswordSubmit(e)}>
                <Form.Field>
                    <Form.Label>Old Password</Form.Label>
                    <Form.Control>
                        <Form.Input
                            disabled={status === 'PROGRESS'}
                            type='password'
                            placeholder='Type your current password'
                            value={currentPassword}
                            onChange={(e) => this.handleChange('currentPassword', e.target.value)}
                        />
                    </Form.Control>
                </Form.Field>
                <Form.Field>
                    <Form.Label>New Password</Form.Label>
                    <Form.Control>
                        <Form.Input
                            disabled={status === 'PROGRESS'}
                            type='password'
                            placeholder='Type your new password'
                            value={newPassword}
                            onChange={(e) => this.handleChange('newPassword', e.target.value)}
                        />
                    </Form.Control>
                </Form.Field>
                <Form.Field>
                    <Form.Label>Confirm New Password</Form.Label>
                    <Form.Control>
                        <Form.Input
                            disabled={status === 'PROGRESS'}
                            type='password'
                            placeholder='Type your new password again'
                            value={confirmNewPassword}
                            onChange={(e) => this.handleChange('confirmNewPassword', e.target.value)}
                        />
                    </Form.Control>
                </Form.Field>
                <Form.Field>
                    <Form.Control>
                        <Button
                            color='primary'
                            disabled={!filledIn || status === 'PROGRESS'}
                        >
                            Update
                        </Button>
                    </Form.Control>
                </Form.Field>
            </form>
            {status === 'SUCCESS' &&
                <Notification
                    color='success'
                >
                    Updated successfully
                </Notification>
            }
            {status === 'ERROR' &&
                <React.Fragment>
                    {errors.map(error => <Notification
                            color='danger'
                        >
                            {error}
                        </Notification>
                    )}
                </React.Fragment>
                
            }
        </PasswordContainer>;
    }
}

const mapStateToProps = state => ({
    status: state.account.userUpdateStatus,
    errors: state.account.userUpdateMessage,
});

const mapDispatchToProps = {
    updateUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(UpdatePassword);