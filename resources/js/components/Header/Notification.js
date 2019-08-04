import React from 'react';
import { Notification as BulmaNotification } from 'react-bulma-components';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import posed from 'react-pose';

import { removeNotification } from '../../actions/notifications';

const StyledNotification = styled(BulmaNotification)`
    border-radius: 0;
    height: 50px;
    padding: 0;
    display: grid;
    justify-content: center;
    align-items: center;
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

    render(){

        const { notification } = this.props;

        return <Animation
            pose={notification.show ? 'visible' : 'hidden'}
        >
            <StyledNotification
                color={this.colorMap[notification.type]}
            >
                <span className='app-notification'>{notification.message}</span>
            </StyledNotification>
        </Animation>;
    }
}

const mapDispatchToProps = {
    removeNotification
}

export default connect(null, mapDispatchToProps)(Notification);