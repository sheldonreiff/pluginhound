import * as ProductActionTypes from '../actionTypes/product';
import has from 'lodash/has';
import update from 'immutability-helper';

const initial = {
    product: {},
    historyParams: {
        start: null,
        end: null,
    },
    productLoadStatus: null,
    productMessage: null,
    productHistory: [],
    productHistoryLoadStatus: null,
    productHistoryMessage: null,
    alertsLoadStatus: null,
    originalAlerts: [],
    alerts: [],
};

export default function Product(state=initial, action){
    switch(action.type){
        case ProductActionTypes.SET_PRODUCT:
            return {
                ...state,
                product: {
                    sku: action.payload.sku
                }
            };
        case ProductActionTypes.SET_HISTORY_PARAMS:
            return {
                ...state,
                historyParams: {
                    ...state.historyParams,
                    start: action.payload.start,
                    end: action.payload.end,
                }
            }
        case ProductActionTypes.LOAD_PRODUCT_SUCCESS:
            return {
                ...state,
                productLoadStatus: 'DONE',
                product: action.payload.data.data
            };
        case ProductActionTypes.LOAD_PRODUCT_PROGRESS:
            return {
                ...state,
                productLoadStatus: 'PROGRESS',
            };
        case ProductActionTypes.LOAD_PRODUCT_ERROR:
            return {
                ...state,
                productLoadStatus: 'ERROR',
                productMessage: has(action, 'payload.error.response.data.errors')
                ? Object.values(action.payload.error.response.data.errors)
                : ['Error getting product'],
            }
        case ProductActionTypes.LOAD_PRODUCT_HISTORY_SUCCESS:
            return {
                ...state,
                productHistoryLoadStatus: 'DONE',
                productHistory: action.payload.data.data
            };
        case ProductActionTypes.LOAD_PRODUCT_HISTORY_PROGRESS:
            return {
                ...state,
                productHistoryLoadStatus: 'PROGRESS',
            };
        case ProductActionTypes.LOAD_PRODUCT_HISTORY_ERROR:
            return {
                ...state,
                productHistoryLoadStatus: 'ERROR',
                productHistoryMessage: has(action, 'payload.error.response.data.errors')
                ? Object.values(action.payload.error.response.data.errors)
                : ['Error getting product history'],
            }
        case ProductActionTypes.LOAD_ALERTS_PROGRESS:
            return {
                ...state,
                alertsLoadStatus: 'PROGRESS'
            };
        case ProductActionTypes.LOAD_ALERTS_SUCCESS:
            return {
                ...state,
                alertsLoadStatus: 'SUCCESS',
                originalAlerts: action.payload.alerts,
                alerts: action.payload.alerts,
            };
        case ProductActionTypes.LOAD_ALERTS_ERROR:
            return {
                ...state,
                alertsLoadStatus: 'ERROR'
            };
        case ProductActionTypes.NEW_ALERT:
            return update(state, {
                alerts: { $push: [{
                    alert_method: 'email',
                    product_sku: state.product.sku,
                    event: 'less_than',
                    threshold_unit: 'percent',
                    threshold_value: 20,
                    status: null,
                    message: null,
                }]}
            });
        case ProductActionTypes.UPDATE_ALERT:
            return update(state, {
                alerts: {
                    [action.payload.alertKey]: {
                        [action.payload.key]: { $set: action.payload.value }
                    }
                }
            });
        case ProductActionTypes.DELETE_ALERT_PROGRESS:
            return update(state, {
                alerts: {
                    [action.payload.alertKey]: {
                        status: { $set: 'DELETING' }
                    }
                }
            });
        case ProductActionTypes.DELETE_ALERT_SUCCESS:
            return update(state, {
                alerts: { $unset: [action.payload.alertKey] }
            });
        case ProductActionTypes.DELETE_ALERT_ERROR:
            return update(state, {
                alerts: {
                    [action.payload.alertKey]: {
                        status: { $set: 'DELETE_ERROR' },
                        message: { $set: as(action, 'payload.error.response.data.errors')
                        ? Object.values(action.payload.error.response.data.errors)[0]
                        : "Couldn't delete alert" },
                    }
                }
            });
        case ProductActionTypes.UPSERT_ALERT_PROGRESS:
            return update(state, {
                alerts: {
                    [action.payload.alertKey]: {
                        status: { $set: 'UPDATING' }
                    }
                }
            });
        case ProductActionTypes.UPSERT_ALERT_SUCCESS:
            const orgAlertId = state.originalAlerts.find(alert => alert.id === action.payload.newAlert.id);

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
                alerts: {
                    [action.payload.alertKey]: { $set: {
                        ...action.payload.newAlert,
                        status: 'UPDATED'
                    }}
                },
                originalAlerts: orgAlertUpdate,
            }); 
        case ProductActionTypes.UPSERT_ALERT_ERROR:
            return update(state, {
                alerts: {
                    [action.payload.alertKey]: {
                        status: { $set: 'UPDATE_ERROR' },
                        message: { $set: has(action, 'payload.error.response.data.errors')
                        ? Object.values(action.payload.error.response.data.errors)[0]
                        : "Couldn't update alert" }
                    }
                }
            }); 
        default:
            return state;
    }
}