import * as ProductsActionTypes from '../actionTypes/products';
import axios from 'axios';

export const search = (query) => {
    return dispatch => {
        dispatch({
            type: ProductsActionTypes.SET_QUERY,
            payload: {
                query
            }
        });

        dispatch(loadProducts());
    }
}

export const loadAllProducts = () => {
    return dispatch => {
        dispatch({
            type: ProductsActionTypes.SET_QUERY,
            payload: {}
        });
    
        dispatch(loadProducts());
    }
}

export const loadProducts = () => {
    return (dispatch, getState) => {
        dispatch({
            type: ProductsActionTypes.LOAD_PRODUCTS_PROGRESS
        });

        const q = getState().products.query;

        axios({
            method: 'get',
            url: `/api/products`,
            params: {
                q
            },
            header: {
                accept: 'application/json'
            }
        }).then(results => {
            dispatch({
                type: ProductsActionTypes.LOAD_PRODUCTS_SUCCESS,
                payload: {
                    products: results.data.data
                }
            });
        }).catch(error => {
            dispatch({
                type: ProductsActionTypes.LOAD_PRODUCTS_ERROR,
                payload: {
                    error
                }
            });
        })
    }
}