import React from 'react';
import Axios from 'axios';
import { connect } from 'react-redux';
import { Notification } from 'react-bulma-components';
import LoggedInOnly from '../LoggedInOnly';
import Spinner from '../common/Loader';

import { verifyEmail } from '../../actions/user'; 

class VerifyEmail extends React.Component {

    componentDidUpdate(){
        const { userState } = this.props;

        if(userState === 'LOGGED_IN'){
            this.props.verifyEmail();
        }
    }

    render(){
        const { userState, status, message } = this.props;

        if(!localStorage.getItem('accessToken')){
            return <LoggedInOnly />;
        }

        if(status === 'PROGRESS'){
            return <Spinner />;
        }

        return status === 'SUCCESS' ? 
        <Notification color='success'>
            Email verified!
        </Notification>
        :
        <Notification color='danger'>
            {message}
        </Notification>;
    }
}

const mapStateToProps = state => ({
    userState: state.user.status,
    userId: state.user.me.id,
    status: state.user.verifyEmailStatus,
    message: state.user.verifyEmailMessage, 
});

export default connect(mapStateToProps, { verifyEmail })(VerifyEmail);