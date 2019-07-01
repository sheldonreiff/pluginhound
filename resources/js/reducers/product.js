import * as ProductActionTypes from '../actionTypes/product';
import has from 'lodash/has';


const initial = {
    product: {},
    productLoadStatus: null,
    productMessage: null,
    productHistory: [],
    productHistoryLoadStatus: null,
    productHistoryMessage: null,
};

export default function Product(state=initial, action){
    switch(action.type){
        case ProductActionTypes.LOAD_PRODUCT_SUCCESS:
            return {
                ...state,
                productLoadStatus: 'DONE',
                product: action.payload.data.data
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
        case ProductActionTypes.LOAD_PRODUCT_HISTORY_ERROR:
            return {
                ...state,
                productHistoryLoadStatus: 'ERROR',
                productHistoryMessage: has(action, 'payload.error.response.data.errors')
                ? Object.values(action.payload.error.response.data.errors)
                : ['Error getting product history'],
            }
        default:
            return state;
    }
}