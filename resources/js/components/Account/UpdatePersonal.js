import React from 'react';
import { Form, Button, Container, Notification } from 'react-bulma-components';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { ClipLoader } from 'react-spinners';

import { updateUser as updateUserInput } from '../../actions/user';
import { updateUser, sendEmailVerification } from '../../actions/account';

const PersonalInfoContainer = styled.div`
    max-width: 400px;
`;

const LoaderContainer = styled.span`
    margin-left: 10px;
    display: inline-block;
`;

class UpdatePersonal extends React.Component{
    handleSubmit = (e) => {
        e.preventDefault();

        const { email, first_name, last_name } = this.props.me;

        this.props.updateUser({ email, first_name, last_name });
    }

    render(){

        const { email, first_name, last_name } = this.props.me;

        const { status, errors, me, originalMe, sendEmailVerification, verifyStatus, verifyMessage, updateUserInput } = this.props;

        const edited = JSON.stringify({ email, first_name, last_name }) 
        !== JSON.stringify({ email: originalMe.email, first_name: originalMe.first_name, last_name: originalMe.last_name });

        return <PersonalInfoContainer>
            <form onSubmit={(e) => this.handleSubmit(e)}>
                <Form.Field>
                    <Form.Label>First Name</Form.Label>
                    <Form.Control>
                        <Form.Input
                            disabled={status === 'PROGRESS'}
                            type='text'
                            value={first_name}
                            onChange={(e) => updateUserInput('first_name', e.target.value)}
                        />
                    </Form.Control>
                </Form.Field>

                <Form.Field>
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control>
                        <Form.Input
                            disabled={status === 'PROGRESS'}
                            type='text'
                            value={last_name}
                            onChange={(e) => updateUserInput('last_name', e.target.value)}
                        />
                    </Form.Control>
                </Form.Field>

                <Form.Field>
                    <Form.Label>Email</Form.Label>
                    <Form.Control>
                        <Form.Input
                            disabled={status === 'PROGRESS'}
                            type='text'
                            value={email}
                            onChange={(e) => updateUserInput('email', e.target.value)}
                        />
                    </Form.Control>

                    <Form.Control>
                        
                    </Form.Control>
                </Form.Field>

                {me.email && !me.email_verified_at &&
                    <React.Fragment>
                        <Form.Field>
                            {verifyStatus !== 'SUCCESS' &&
                                <Notification color='warning'>
                                    Your email hasn't been verified. Please check your email for a link or <a onClick={sendEmailVerification}>resend</a>
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
                            loading={status === 'PROGRESS'}
                            disabled={!edited}
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
    originalMe: state.user.originalMe,
    verifyStatus: state.account.sendEmailVerificationStatus,
    verifyMessage: state.account.sendEmailVerificationMessage,
});

const mapDispatchToProps = {
    updateUser,
    sendEmailVerification,
    updateUserInput,
};

export default connect(mapStateToProps, mapDispatchToProps)(UpdatePersonal  );