import React from 'react';
import { Notification as BulmaNotification } from 'react-bulma-components';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import posed from 'react-pose';

import { removeNotification } from '../../actions/notifications';

const StyledNotification = styled(BulmaNotification)`
    border-radius: 0;
`;

const Animation = posed.div({
visible: { opacity: 1 },
hidden: { opacity: 0 }
});


class Notification extends React.Component{
    constructor(){
        super();

        this.colorMap = {
            SUCCESS: 'success',
            INFO: 'info',
            ERROR: 'danger',
        };
    }

    static propTypes = {
        notification: PropTypes.object.isRequired,
    }

    handleDismiss = () => {
        const { removeNotification, notification } = this.props;

        removeNotification(notification.id);
    }

    componentDidMount() {
        const { duration } = this.props.notification;
        if (duration !== 0) {
            setTimeout(() => {
                this.handleDismiss();
            }, duration);
        }
    }

    render(){

        const { notification } = this.props;

        return <Animation
            pose={notification.show ? 'visible' : 'hidden'}
        >
            <StyledNotification
                color={this.colorMap[notification.type]}
            >
                {notification.message}
            </StyledNotification>
        </Animation>;
    }
}

const mapDispatchToProps = {
    removeNotification
}

export default connect(null, mapDispatchToProps)(Notification);