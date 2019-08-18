import * as ProductsActionTypes from '../actionTypes/products';
import axios from 'axios';

export const updateQuery = (query) => {
    return dispatch => {
        dispatch({
            type: ProductsActionTypes.SET_QUERY,
            payload: {
                view: 'search',
                query,
            }
        });
    }
}

export const loadProducts = (view, reload=false) => {
    return (dispatch, getState) => {

        const viewData = getState().products.views[view];

        const q = viewData.query;
        const bestDeals = view === 'bestDeals';

        const emptySearchQuery = view === 'search' && q.length === 0;

        if((viewData.loadStatus !== 'DONE' || reload) && !emptySearchQuery){
            
            dispatch({
                type: ProductsActionTypes.LOAD_PRODUCTS_PROGRESS,
                payload: {
                    view,
                }
            });

            axios({
                method: 'get',
                url: `/api/products`,
                params: {
                    q,
                    bestDeals,
                },
                header: {
                    accept: 'application/json'
                }
            }).then(results => {
                dispatch({
                    type: ProductsActionTypes.LOAD_PRODUCTS_SUCCESS,
                    payload: {
                        products: results.data.data,
                        view,
                    }
                });
            }).catch(error => {
                console.log(error);
                dispatch({
                    type: ProductsActionTypes.LOAD_PRODUCTS_ERROR,
                    payload: {
                        error,
                        view,
                    }
                });
            });
        }
    }
}