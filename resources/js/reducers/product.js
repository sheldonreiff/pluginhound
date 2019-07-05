import * as ProductActionTypes from '../actionTypes/product';
import has from 'lodash/has';


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
        default:
            return state;
    }
}