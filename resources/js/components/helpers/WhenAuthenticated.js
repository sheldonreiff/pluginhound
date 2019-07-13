import React from 'react';
import { connect } from 'react-redux';

const WhenAuthenticated = props => {
    if(props.status === 'LOGGED_IN'){
        return props.children;
    }

    return props.else ? props.else : null;
}

const mapStateToProps = state => ({
    status: state.user.status
});

export default connect(mapStateToProps)(WhenAuthenticated);