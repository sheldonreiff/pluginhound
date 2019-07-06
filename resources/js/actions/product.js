import * as ProductActionTypes from '../actionTypes/product';
import axios from 'axios';

export const setProduct = (sku) => {
    return dispatch => {
        dispatch({
            type: ProductActionTypes.SET_PRODUCT,
            payload: {
                sku
            }
        });
    }
}

export const getProduct = () => {
    return (dispatch, getState) => {
        dispatch({
            type: ProductActionTypes.LOAD_PRODUCT_PROGRESS
        });

        axios({
            method: 'get',
            url: `/api/product/${getState().product.product.sku}`,
            headers: {
                accept: 'application/json'
            }
        }).then(result => {
            dispatch({
                type: ProductActionTypes.LOAD_PRODUCT_SUCCESS,
                payload: {
                    data: result.data
                }
            });
        }).catch(error => {
            console.log(error);
            dispatch({
                type: ProductActionTypes.LOAD_PRODUCT_ERROR,
                payload: {
                    error
                }
            });
        });
    }
}

export const getProductHistory = ({ start=null, end=null} = {startDate: null, endDate: null}) => {
    return (dispatch, getState) => {
        dispatch({
            type: ProductActionTypes.LOAD_PRODUCT_HISTORY_PROGRESS
        });

        dispatch({
            type: ProductActionTypes.SET_HISTORY_PARAMS,
            payload: {
                start,
                end,
            }
        });
        
        axios({
            method: 'get',
            url: `/api/product/${getState().product.product.sku}/history`,
            params: {
                start: start ? start.format('YYYY-MM-DD') : undefined,
                end: end ? end.format('YYYY-MM-DD') : undefined,
            },
            headers: {
                accept: 'application/json'
            }
        }).then(result => {
            dispatch({
                type: ProductActionTypes.LOAD_PRODUCT_HISTORY_SUCCESS,
                payload: {
                    data: result.data
                }
            });
        }).catch(error => {
            console.log(error);
            dispatch({
                type: ProductActionTypes.LOAD_PRODUCT_HISTORY_ERROR,
                payload: {
                    error
                }
            });
        })
    }
}

export const loadAlerts = () => {
    return (dispatch, getState) => {
        dispatch({
            type: ProductActionTypes.LOAD_ALERTS_PROGRESS
        });

        axios({
            method: 'get',
            url: `/api/product/${getState().product.sku}/alerts`,
            headers: {
                authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
            responseType: 'json',
        }).then(result => {
            dispatch({
                type: ProductActionTypes.LOAD_ALERTS_SUCCESS,
                payload: {
                    alerts: result.data.data
                }
            });
        }).catch(error => {
            console.log(error);
            dispatch({
                type: ProductActionTypes.LOAD_ALERTS_ERROR,
                payload: {
                    error
                }
            });
        })
    }
}

export const upsertAlert = (alertKey) => {
    return (dispatch, getState) => {
        dispatch({
            type: ProductActionTypes.UPSERT_ALERT_PROGRESS,
        });

        const sku = getState().product.sku;
        const alert = getState().product.alerts[alertKey];

        const request = alert.id 
        ? { method: 'patch', url: `/api/product/${sku}/alert/${alert.id}` }
        : { method: 'post', url: `/api/product/${sku}/alert` };

        axios({
            ...request,
            headers: {
                authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
            responseType: 'json',
        }).then(results => {
            dispatch({
                type: ProductActionTypes.UPSERT_ALERT_SUCCESS,
            });
        }).catch(error => {
            dispatch({
                type: ProductActionTypes.UPSERT_ALERT_ERROR,
            });
        })
    }
}