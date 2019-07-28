import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';     

import Notification from './Notification';

const StyledBar = styled.div`
    position: absolute;
    top: 0;
    width: 100%;
`;

class NotificationBar extends React.Component{
    render(){

        const { notifications } = this.props;

        return <StyledBar>
            {notifications.map(notification => {
                return <Notification
                    key={notification.id}
                    notification={notification}
                />
            })}
        </StyledBar>;
    }
}

const mapStateToProps = state => ({
    notifications: state.notifications
});

export default connect(mapStateToProps)(NotificationBar);