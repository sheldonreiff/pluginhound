import React from 'react';
import { Notification } from 'react-bulma-components';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const StyledNotification = styled(Notification)`
    display: inline-block;
`;

const AlertsDisabled = props => {
    return props.verified
        ? null
        :<StyledNotification
            color='info'
        >
            Alerts won't be sent until you <Link to='/account/personal-info'>veify</Link> your email
        </StyledNotification>;
}

const mapStateToProps = state => ({
    verified: state.user.me.email_verified_at,
})

export default connect(mapStateToProps)(AlertsDisabled);