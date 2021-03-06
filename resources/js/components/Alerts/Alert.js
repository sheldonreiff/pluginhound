import React from 'react';
import { Form } from 'react-bulma-components';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Notification, Box, Image } from 'react-bulma-components';
import { Link } from 'react-router-dom';

import { updateAlert, deleteAlert, upsertAlert } from '../../actions/alerts';

const AlertsForm = styled.form`
    display: flex;
    @media (max-width: 850px) {
        flex-wrap: wrap;
        background: #eee;
        padding: 20px;
        border-radius: 5px;
    }
`;

const ContolsContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    margin: 20px -10px;
    align-items: center;
    margin: 5px;
    & > * {
        margin: 10px;
    }
    @media (max-width: 850px) {
        flex-direction: column;
        flex-wrap: nowrap;
        align-items: unset;
    }
`;

const SiblingContainer = styled.div`
    display: flex;
    margin: 0;
    & > * {
        margin: 10px;
    }
    align-items: center;
`;

const StyledBox = styled(Box)`
    display: flex;
    margin: -10px;
    max-width: 250px;
    & > *{
        margin: 10px;
    }
    margin: 10px!important;
`;

class Alert extends React.Component{

    static defaultProps = {
        isExtended: false,
    }

    static propTypes = {
        isExtended: PropTypes.bool,
        view: PropTypes.string.isRequired,
        alertKey: PropTypes.number.isRequired,
    }

    saveAlert = (e) => {
        e.preventDefault();

        const { view, alertKey } = this.props;

        this.props.upsertAlert({ view, alertKey });
    }

    getFillable = (alert) => {
        return {
            alert_method: alert.alert_method,
            event: alert.event,
            threshold_unit: alert.threshold_unit,
            threshold_value: alert.threshold_value,
        };
    }

    render(){

        const { updateAlert, alertKey, alert, originalAlert, deleteAlert, view, isExtended } = this.props;

        const changed = originalAlert && JSON.stringify(this.getFillable(originalAlert)) === JSON.stringify(this.getFillable(alert));

        const disabled = alert.status === 'DELETING';

        return <AlertsForm onSubmit={(e) => this.saveAlert(e)}>

            {alert.product && isExtended &&
                <Link to={`/product/${alert.product.sku}`}>
                    <StyledBox>
                        <Image size={48} style={{gridArea: 'thumbnail'}} src={alert.product.thumbnail_url} />
                        {alert.product.name}
                    </StyledBox>
                </Link>
            }

            <ContolsContainer>
                <span>Alert me by email when</span>

                <div>
                    <Form.Select
                        value={alert.event}
                        onChange={(e) => updateAlert({ view, alertKey, key: 'event', value: e.target.value })}
                        disabled={disabled}
                    >
                        <option />
                        <option value='decrease_by'>the price drops by</option>
                        <option value='less_than'>the price drops to less than or equal to</option>
                        <option value='any_change'>the price changes at all</option>
                    </Form.Select>
                </div>

                {alert.event !== 'any_change' && 
                    <SiblingContainer>
                        <Form.Field>
                            <Form.Input
                                type='number'
                                style={{ maxWidth: '100px' }} 
                                value={alert.threshold_value}
                                onChange={(e) => updateAlert({ view, alertKey, key: 'threshold_value', value: e.target.value })}
                                disabled={disabled}
                            />
                        </Form.Field>
                        {alert.event === 'less_than' &&
                            <span>dollars</span>
                        }

                        {alert.event !== 'less_than' &&
                            <Form.Select
                                value={alert.threshold_unit}
                                onChange={(e) => updateAlert({ view, alertKey, key: 'threshold_unit', value: e.target.value })}
                                disabled={disabled}
                            >
                                <option />
                                <option value='currency'>dollars</option>
                                <option value='percent'>percent</option>
                            </Form.Select>
                        }
                    </SiblingContainer>
                }

                <SiblingContainer>
                    <Form.Field>
                        <Form.Control>
                            <Button
                                color='primary'
                                loading={alert.status === 'UPDATING'}
                                disabled={changed}
                            >
                                Save
                            </Button>
                        </Form.Control>
                    </Form.Field>

                    <Form.Field>
                        <button
                            type='button'
                            className='delete'
                            onClick={() => deleteAlert({ view, alertKey })} 
                            disabled={disabled}
                        />
                    </Form.Field>
                </SiblingContainer>

                {alert.status === 'DELETE_ERROR' &&
                    <Form.Field>
                        <Notification
                            color='danger'
                        >
                            Couldn't delete alert
                        </Notification>
                    </Form.Field>
                }

                {alert.status === 'UPDATE_ERROR' &&
                    <Form.Field>
                        <Notification
                            color='danger'
                        >
                            {alert.message}
                        </Notification>
                    </Form.Field>
                }

                {alert.status === 'UPDATED' &&
                    <Form.Field>
                        <Notification
                            color='success'
                        >
                            Successfully saved alert!
                        </Notification>
                    </Form.Field>
                }
            </ContolsContainer>
            
            
        </AlertsForm>;
    }
}

const mapDispatchToProps = {
    updateAlert,
    deleteAlert,
    upsertAlert,
}

const mapStateToProps = (state, ownProps) => ({
    originalAlert: state.alerts.views[ownProps.view].originalAlerts.find(orgAlert => orgAlert.id === state.alerts.views[ownProps.view].alerts[ownProps.alertKey].id),
    alert: state.alerts.views[ownProps.view].alerts[ownProps.alertKey]
});

export default connect(mapStateToProps, mapDispatchToProps)(Alert);