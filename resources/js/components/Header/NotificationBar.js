import React from 'react';
import { connect } from 'react-redux';

import Notification from './Notification';

class NotificationBar extends React.Component{
    render(){

        const { notifications } = this.props;

        return <React.Fragment>
            {notifications.map(notification => {
                return <Notification
                    key={notification.id}
                    notification={notification}
                />
            })}
        </React.Fragment>;
    }
}

const mapStateToProps = state => ({
    notifications: state.notifications
});

export default connect(mapStateToProps)(NotificationBar);