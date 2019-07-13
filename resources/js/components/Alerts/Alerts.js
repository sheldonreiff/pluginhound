import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ClipLoader } from 'react-spinners';
import { Notification } from 'react-bulma-components';

import Alert from './Alert';

class Alerts extends React.Component{

    static defaultProps = {
        extendedAlertView: false,
    }

    static propTypes = {
        view: PropTypes.string.isRequired,
        extendedAlertView: PropTypes.bool,
    }

    render(){

        const { alerts, status, view, extendedAlertView } = this.props;

        return <React.Fragment>
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

export default connect(mapStateToProps)(Alerts);