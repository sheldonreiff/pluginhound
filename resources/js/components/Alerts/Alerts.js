import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ClipLoader } from 'react-spinners';
import { Notification } from 'react-bulma-components';
import AlertsDisabled from './AlertsDisabled';

import Alert from './Alert';

import { loadAlerts } from '../../actions/alerts';

class Alerts extends React.Component{

    static defaultProps = {
        extendedAlertView: false,
        sku: null,
    }

    static propTypes = {
        view: PropTypes.string.isRequired,
        extendedAlertView: PropTypes.bool,
        sku: PropTypes.string,
    }

    componentDidMount(){
        const { view, sku } = this.props;
        this.props.loadAlerts({ view, sku });
    }

    render(){

        const { alerts, status, view, extendedAlertView } = this.props;

        return <React.Fragment>
            {alerts.length > 0 &&
                <AlertsDisabled />
            }
            {alerts.map((alert, index) => {
                return <Alert
                    view={view}
                    key={`alert-${index}`}
                    alertKey={index}
                    isExtended={extendedAlertView}
                />;
            })}

            {status === 'ERROR' &&
                <div>
                    <Notification color='danger' style={{display: 'inline-block'}}>
                        Error loading alerts
                    </Notification>
                </div>
            }

            {status === 'PROGRESS' &&
                <ClipLoader
                    sizeUnit={"px"}
                    size={40}
                    color='lightgray'
                    loading={true}
                />
            }
        </React.Fragment>;
    }
}

const mapStateToProps = (state, ownProps) => ({
    alerts: state.alerts.views[ownProps.view].alerts,
    status: state.alerts.views[ownProps.view].status,
});

const mapDispatchToProps = {
    loadAlerts
};

export default connect(mapStateToProps, mapDispatchToProps)(Alerts);