import React from 'react';
import { Form, Button, Container, Notification } from 'react-bulma-components';
import styled from 'styled-components';
import { connect } from 'react-redux';

import { updateUser } from '../../actions/account';

const PersonalInfoContainer = styled.div`
    max-width: 400px;
`;


class UpdatePersonal extends React.Component{
    constructor(){
        super();

        this.initialState = {
            firstName: '',
            lastName: '',
            email: '',
        };

        this.state = this.initialState;
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const { email, firstName, lastName } = this.state;

        this.props.updateUser({ email, firstName, lastName });

        this.setState({ email: '', firstName: '', lastName: '' });
    }

    handleChange = (key, value) => {
        this.setState({ [key]: value });
    }

    render(){

        const { email, firstName, lastName } = this.state;

        const { status, errors, me } = this.props;

        const filledIn = [email, firstName, lastName].filter(field => field).length;

        return <PersonalInfoContainer>
            <form onSubmit={(e) => this.handleSubmit(e)}>
                <Form.Field>
                    <Form.Label>First Name</Form.Label>
                    <Form.Control>
                        <Form.Input
                            disabled={status === 'PROGRESS'}
                            type='text'
                            placeholder={me.first_name}
                            value={firstName}
                            onChange={(e) => this.handleChange('firstName', e.target.value)}
                        />
                    </Form.Control>
                </Form.Field>
                <Form.Field>
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control>
                        <Form.Input
                            disabled={status === 'PROGRESS'}
                            type='text'
                            placeholder={me.last_name}
                            value={lastName}
                            onChange={(e) => this.handleChange('lastName', e.target.value)}
                        />
                    </Form.Control>
                </Form.Field>
                <Form.Field>
                    <Form.Label>Email</Form.Label>
                    <Form.Control>
                        <Form.Input
                            disabled={status === 'PROGRESS'}
                            type='text'
                            placeholder={me.email}
                            value={email}
                            onChange={(e) => this.handleChange('email', e.target.value)}
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
        </PersonalInfoContainer>;
    }
}

const mapStateToProps = state => ({
    status: state.account.userUpdateStatus,
    errors: state.account.userUpdateMessage,
    me: state.user.me,
});

const mapDispatchToProps = {
    updateUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(UpdatePersonal  );