import * as ProductActionTypes from '../actionTypes/product';
import axios from 'axios';

export const getProduct = (sku) => {
    return dispatch => {
        axios({
            method: 'get',
            url: `/api/product/${sku}`,
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

export const getProductHistory = (sku) => {
    return dispatch => {
        axios({
            method: 'get',
            url: `/api/product/${sku}/history`,
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