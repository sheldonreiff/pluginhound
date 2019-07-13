import React from 'react';
import { connect } from 'react-redux';
import { ClipLoader } from 'react-spinners';
import { Notification, Heading } from 'react-bulma-components';

import Alerts from '../Alerts/Alerts';

import { loadAlerts } from '../../actions/alerts';

class MyAlerts extends React.Component{

    componentDidMount(){
        this.props.loadAlerts({ view: 'all' });
    }

    render(){

        const { alerts, status, message } = this.props;

        return <div>
            <Heading size={3}>My Alerts</Heading>

            <Alerts
                view='all'
                extendedAlertView={true}
            />
            
            {/* {status === 'SUCCESS' && alerts.length > 0 &&
                <React.Fragment>
                    {alerts.map((alert, index) => {
                        return <Alert
                            view='all'
                            key={alert.id}
                            alertKey={index}
                        />
                    })}
                </React.Fragment>
            } */}

            {status === 'SUCCESS' && alerts.length === 0 &&
                <p>You don't have any alerts. You create an alert by viewing a product and looking for the <b>Alerts</b> section</p>
            }

            {/* {status === 'PROGRESS' &&
                <ClipLoader
                    sizeUnit={"px"}
                    size={40}
                    color='lightgray'
                    loading={true}
                />
            }

            {status === 'ERROR' &&
                <Notification
                    color='danger'
                >{message}</Notification>
            } */}
        </div>
    }
}

const mapStateToProps = state => ({
    alerts: state.alerts.views.all.alerts,
    status: state.alerts.views.all.status,
    message: state.alerts.views.all.message,
});

const mapDispatchToProps = {
    loadAlerts
};


export default connect(mapStateToProps, mapDispatchToProps)(MyAlerts);