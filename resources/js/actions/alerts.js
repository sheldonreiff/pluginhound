import * as AlertActionTypes from '../actionTypes/alerts';
import axios from 'axios';

export const loadAlerts = ({ view, sku=null }) => {
    return dispatch => {
        dispatch({
            type: AlertActionTypes.LOAD_ALERTS_PROGRESS,
            payload: {
                view,
            }
        });

        axios({
            method: 'get',
            url: sku ? `/api/product/${sku}/alerts` : `/api/alerts`,
            headers: {
                authorization: `Bearer ${localStorage.getItem('accessToken')}`
            },
            responseType: 'json'
        }).then(result => {
            dispatch({
                type: AlertActionTypes.LOAD_ALERTS_SUCCESS,
                payload: {
                    view,
                    data: result.data.data
                }
            });
        }).catch(error => {
            console.log(error);
            dispatch({
                type: AlertActionTypes.LOAD_ALERTS_ERROR,
                payload: {
                    view,
                    error
                }
            });
        });
    }
}

export const newAlert = ({ view, sku }) => {
    return dispatch => {
        dispatch({
            type: AlertActionTypes.NEW_ALERT,
            payload: {
                sku,
                view,
            }
        });
    };
}

export const updateAlert = ({ view, alertKey, key, value }) => {
    return dispatch => {
        dispatch({
            type: AlertActionTypes.UPDATE_ALERT,
            payload: {
                alertKey,
                key,
                value,
                view,
            }
        });
    }
}

export const deleteAlert = ({ view, alertKey }) => {
    return (dispatch, getState) => {
        dispatch({
            type: AlertActionTypes.DELETE_ALERT_PROGRESS,
            payload: {
                alertKey,
                view,
            }
        });

        const alert = getState().alerts.views[view].alerts[alertKey];

        if(alert.id){
            axios({
                method: 'delete',
                url: `/api/alert/${alert.id}`,
                headers: {
                    authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
                responseType: 'json',
            }).then(result => {
                dispatch({
                    type: AlertActionTypes.DELETE_ALERT_SUCCESS,
                    payload: {
                        alertKey,
                        view,
                    }
                });
            }).catch(error => {
                dispatch({
                    type: AlertActionTypes.DELETE_ALERT_ERROR,
                    payload: {
                        alertKey,
                        error,
                        view,
                    }
                });
            })
        }else{
            dispatch({
                type: AlertActionTypes.DELETE_ALERT_SUCCESS,
                payload: {
                    alertKey,
                    view,
                }
            });
        }
    }
}

export const upsertAlert = ({ view, alertKey }) => {
    return (dispatch, getState) => {
        dispatch({
            type: AlertActionTypes.UPSERT_ALERT_PROGRESS,
            payload: {
                alertKey,
                view,
            }
        });

        const alert = getState().alerts.views[view].alerts[alertKey];

        const { alert_method, event, threshold_unit, threshold_value, product_sku } = alert;

        const request = alert.id 
        ? { method: 'patch', url: `/api/alert/${alert.id}` }
        : { method: 'post', url: `/api/product/${product_sku}/alert` };

        axios({
            ...request,
            data: {
                alert_method,
                event,
                threshold_unit,
                threshold_value,
            },
            headers: {
                authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
            responseType: 'json',
        }).then(results => {
            dispatch({
                type: AlertActionTypes.UPSERT_ALERT_SUCCESS,
                payload: {
                    alertKey,
                    newAlert: results.data.data,
                    view,
                }
            });
        }).catch(error => {
            console.log(error);
            dispatch({
                type: AlertActionTypes.UPSERT_ALERT_ERROR,
                payload: {
                    alertKey,
                    error,
                    view,
                }
            });
        })
    }
}