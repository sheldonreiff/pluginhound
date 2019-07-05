import * as ProductsActionTypes from '../actionTypes/products';
import has from 'lodash/has';


const initial = {
    products: [],
    query: null,
    loadStatus: null,
    message: null,
};

export default function Products(state=initial, action){
    switch(action.type){
        case ProductsActionTypes.SET_QUERY:
            return {
                ...state,
                query: action.payload.query
            };
        case ProductsActionTypes.LOAD_PRODUCTS_PROGRESS:
            return {
                ...state,
                loadStatus: 'PROGRESS',
                message: null,
            };
        case ProductsActionTypes.LOAD_PRODUCTS_ERROR:
            return {
                ...state,
                loadStatus: 'ERROR',
                message: 'Error loading products',
            };
        case ProductsActionTypes.LOAD_PRODUCTS_SUCCESS:
            return {
                ...state,
                loadStatus: 'SUCCESS',
                message: null,
                products: action.payload.products,
            };
        default:
            return state;
    }
}