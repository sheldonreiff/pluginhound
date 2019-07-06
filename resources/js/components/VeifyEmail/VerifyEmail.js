import React from 'react';
import { connect } from 'react-redux';
import { Notification } from 'react-bulma-components';
import LoggedInOnly from '../LoggedInOnly';
import { ClipLoader } from 'react-spinners';

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
            return <ClipLoader
                sizeUnit={'px'}
                size={40}
                color='lightgray'
                loading={true}
            />;
        }

        if(status === 'ERROR'){
            return <Notification color='danger'>
                {message}
            </Notification>;
        }


        if(status === 'SUCCESS'){
            return <Notification color='success'>
                Email verified!
            </Notification>;
        }

        return null;
    }
}

const mapStateToProps = state => ({
    userState: state.user.status,
    userId: state.user.me.id,
    status: state.user.verifyEmailStatus,
    message: state.user.verifyEmailMessage, 
});

export default connect(mapStateToProps, { verifyEmail })(VerifyEmail);