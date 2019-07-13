import * as AlertActionTypes from '../actionTypes/alerts';
import update from 'immutability-helper';
import has from 'lodash/has';

const makeViews = (acc, view) => {
    acc[view] = {
        originalAlerts: [],
        alerts: [],
        status: null,
        message: null,
    };

    return acc;
};

const initial = {
    views: ['product', 'all'].reduce(makeViews, {})
};

export default function Alerts(state=initial, action){
    switch(action.type){
        case AlertActionTypes.LOAD_ALERTS_PROGRESS:
            return update(state, {
                views: {
                    [action.payload.view]: {
                        status: { $set: 'PROGRESS' },
                    }
                }
            });
        case AlertActionTypes.LOAD_ALERTS_SUCCESS:
            
            const alerts = action.payload.data.map(alert => ({
                ...alert,
                status: null,
                message: null,
            }));

            return update(state, {
                views: {
                    [action.payload.view]: {
                        originalAlerts: { $set: alerts },
                        alerts: { $set: alerts },
                        status: { $set: 'SUCCESS' },
                    }
                }
            });
        case AlertActionTypes.LOAD_ALERTS_ERROR:
            return update(state, {
                views: {
                    [action.payload.view]: {
                        message: { $set: has(action, 'payload.error.response.data.errors')
                            ? Object.values(action.payload.error.response.data.errors)[0]
                            : "Couldn't load alerts", 
                        },
                        status: { $set: 'ERROR' },
                    }
                }
            });
        case AlertActionTypes.NEW_ALERT:
            return update(state, {
                views: {
                    [action.payload.view]: {
                        alerts: { $push: [{
                            alert_method: 'email',
                            product_sku: action.payload.sku,
                            event: 'less_than',
                            threshold_unit: 'percent',
                            threshold_value: 20,
                            status: null,
                            message: null,
                        }]}
                    }
                }
            });
        case AlertActionTypes.UPDATE_ALERT:
            return update(state, {
                views: {
                    [action.payload.view]: {
                        alerts: {
                            [action.payload.alertKey]: {
                                [action.payload.key]: { $set: action.payload.value }
                            }
                        }
                    }
                }
            });
        case AlertActionTypes.DELETE_ALERT_PROGRESS:
            return update(state, {
                views: {
                    [action.payload.view]: {
                        alerts: {
                            [action.payload.alertKey]: {
                                status: { $set: 'DELETING' }
                            }
                        }
                    }
                }
            });
        case AlertActionTypes.DELETE_ALERT_SUCCESS:
            return update(state, {
                views: {
                    [action.payload.view]: {
                        alerts: { $unset: [action.payload.alertKey] }
                    }
                }
            });
        case AlertActionTypes.DELETE_ALERT_ERROR:
            return update(state, {
                views: {
                    [action.payload.view]: {
                        alerts: {
                            [action.payload.alertKey]: {
                                status: { $set: 'DELETE_ERROR' },
                                message: { $set: as(action, 'payload.error.response.data.errors')
                                ? Object.values(action.payload.error.response.data.errors)[0]
                                : "Couldn't delete alert" },
                            }
                        }
                    }
                }
            });
        case AlertActionTypes.UPSERT_ALERT_PROGRESS:
            return update(state, {
                views: {
                    [action.payload.view]: {
                        alerts: {
                            [action.payload.alertKey]: {
                                status: { $set: 'UPDATING' }
                            }
                        }
                    }
                }
            });
        case AlertActionTypes.UPSERT_ALERT_SUCCESS:
            const orgAlertId = state.views[action.payload.view].originalAlerts.find(alert => alert.id === action.payload.newAlert.id);

            const orgAlertUpdate = orgAlertId
            ? { 
                [orgAlertId]: { $set: {
                    ...action.payload.newAlert
                }}
            }
            : { $push: [{
                    ...action.payload.newAlert
                }]
            };

            return update(state, {
                views: {
                    [action.payload.view]: {
                        alerts: {
                            [action.payload.alertKey]: { $set: {
                                ...action.payload.newAlert,
                                status: 'UPDATED'
                            }}
                        },
                        originalAlerts: orgAlertUpdate,
                    }
                }
            }); 
        case AlertActionTypes.UPSERT_ALERT_ERROR:
            return update(state, {
                views: {
                    [action.payload.view]: {
                        alerts: {
                            [action.payload.alertKey]: {
                                status: { $set: 'UPDATE_ERROR' },
                                message: { $set: has(action, 'payload.error.response.data.errors')
                                ? Object.values(action.payload.error.response.data.errors)[0]
                                : "Couldn't save alert" }
                            }
                        }
                    }
                }
            }); 
        default:
            return state;
    }
}