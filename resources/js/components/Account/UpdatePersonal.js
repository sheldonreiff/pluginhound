import React from 'react';
import { Form, Button, Container, Notification } from 'react-bulma-components';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { ClipLoader } from 'react-spinners';

import { updateUser, sendEmailVerification } from '../../actions/account';

const PersonalInfoContainer = styled.div`
    max-width: 400px;
`;

const StyledInput = styled(Form.Input)`
    &::placeholder{
        color: black;
    }
`;

const LoaderContainer = styled.span`
    margin-left: 10px;
    display: inline-block;
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

        const { status, errors, me, sendEmailVerification, verifyStatus, verifyMessage } = this.props;

        const filledIn = [email, firstName, lastName].filter(field => field).length;

        return <PersonalInfoContainer>
            <form onSubmit={(e) => this.handleSubmit(e)}>
                <Form.Field>
                    <Form.Label>First Name</Form.Label>
                    <Form.Control>
                        <StyledInput
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
                        <StyledInput
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
                        <StyledInput
                            disabled={status === 'PROGRESS'}
                            type='text'
                            placeholder={me.email}
                            value={email}
                            onChange={(e) => this.handleChange('email', e.target.value)}
                        />
                    </Form.Control>

                    <Form.Control>
                        
                    </Form.Control>
                </Form.Field>

                {(me.email === email || !email) && !me.email_verified_at &&
                    <React.Fragment>
                        <Form.Field>
                            {verifyStatus !== 'SUCCESS' &&
                                <Notification color='warning'>
                                    You email hasn't been verified. Please check your email for a link or <a onClick={sendEmailVerification}>resend</a>
                                    <LoaderContainer>
                                        <ClipLoader
                                            sizeUnit={'px'}
                                            size={15}
                                            color='rgba(0,0,0,.7)'
                                            loading={verifyStatus === 'PROGRESS'}
                                        />
                                    </LoaderContainer>
                                </Notification>
                            }
                        </Form.Field>

                        <Form.Field>
                            {verifyStatus === 'SUCCESS' &&
                                <Notification color='success'>
                                    Email verification sent. Check your inbox!
                                </Notification>
                            }
                        </Form.Field>

                        <Form.Field>
                            {verifyStatus === 'ERROR' &&
                                <Notification color='danger'>
                                    {verifyMessage}
                                </Notification>
                            }
                        </Form.Field>
                    </React.Fragment>
                }

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
    verifyStatus: state.account.sendEmailVerificationStatus,
    verifyMessage: state.account.sendEmailVerificationMessage,
});

const mapDispatchToProps = {
    updateUser,
    sendEmailVerification,
};

export default connect(mapStateToProps, mapDispatchToProps)(UpdatePersonal  );