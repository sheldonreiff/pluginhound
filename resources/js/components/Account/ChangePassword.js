import React from 'react';
import { Form, Button, Container } from 'react-bulma-components';
import styled from 'styled-components';
import { connect } from 'react-redux';


const PasswordContainer = styled.div`
    max-width: 400px;
`;


class ChangePassword extends React.Component{
    constructor(){
        super();

        this.initialState = {
            oldPassword: '',
            newPassword: '',
            confirmNewPassword: '',
            submittedOnce: false,
            noMatch: false
        };

        this.state = this.initialState;
    }

    // passwordsDoNotMatch = (isSubmit = false) => {
    //     const { submittedOnce, newPassword, confirmNewPassword, noMatch  } = this.state;
        
    //     if(isSubmit && !submittedOnce){
    //         this.setState({ submittedOnce: true});
    //     }

    //     if(isSubmit || submittedOnce){
    //         const isNotMatch = newPassword !== confirmNewPassword;

    //         if(isNotMatch !== noMatch){
    //             this.setState({ noMatch: isNotMatch });
    //         }
    //         return isNotMatch;
    //     }
    // }

    handlePasswordSubmit = (e) => {
        e.preventDefault();
    }

    handleChange = (key, value) => {
        this.setState({ [key]: value });

        if(['newPassword', 'confirmNewPassword'].includes(key)){
            this.passwordsDoNotMatch();
        }
    }

    render(){

        const { oldPassword, newPassword, confirmNewPassword, noMatch } = this.state;

        return <PasswordContainer>
            <h3>Change Password</h3>
            <form onSubmit={(e) => this.handlePasswordSubmit(e)}>
                <Form.Field>
                    <Form.Label>Old Password</Form.Label>
                    <Form.Control>
                        <Form.Input
                            type='password'
                            placeholder='Type your old password'
                            value={oldPassword}
                            onChange={(e) => this.handleChange('oldPassword', e.target.value)}
                        />
                    </Form.Control>
                </Form.Field>
                <Form.Field>
                    <Form.Label>New Password</Form.Label>
                    <Form.Control>
                        <Form.Input
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
                            type='password'
                            placeholder='Type your new password again'
                            value={confirmNewPassword}
                            onChange={(e) => this.handleChange('confirmNewPassword', e.target.value)}
                        />
                        {noMatch &&
                            <Form.Help color='danger'>Passwords don't match</Form.Help>
                        }
                    </Form.Control>
                </Form.Field>
                <Form.Field>
                    <Form.Control>
                        <Button
                            color='light'
                        >
                            Submit
                        </Button>
                    </Form.Control>
                </Form.Field>
            </form>
        </PasswordContainer>;
    }
}

export default ChangePassword;