import * as ProductsActionTypes from '../actionTypes/products';
import update from 'immutability-helper';

const defaultFields = {
    products: [],
    loadStatus: null,
    message: null,
    page: 1,
    pages: 1,
};

const customFields = {
    all: {
        title: 'All Products',
    },
    search: {
        query: '',
        title: 'Search',
    },
    bestDeals: {
        title: 'Top Deals',
    }
};

const makeViews = (acc, view) => {
    const fields = {
        ...defaultFields,
        ...customFields[view],
    };

    acc[view] = fields;

    return acc;
};

const initial = {
    views: ['all', 'search', 'bestDeals'].reduce(makeViews, {}),
};

export default function Products(state=initial, action){
    switch(action.type){
        case ProductsActionTypes.SET_QUERY:
            return update(state, {
                views: {
                    [action.payload.view]: {
                        query: { $set: action.payload.query }
                    }
                }
            });
        case ProductsActionTypes.LOAD_PRODUCTS_PROGRESS:
            return update(state, {
                views: {
                    [action.payload.view]: {
                        loadStatus: { $set: 'PROGRESS' },
                        message: { $set: null },
                    }
                }
            });
        case ProductsActionTypes.LOAD_PRODUCTS_ERROR:
            return update(state, {
                views: {
                    [action.payload.view]: {
                        loadStatus: { $set: 'ERROR' },
                        message: { $set: 'Error loading products' },
                    }
                }
            });
        case ProductsActionTypes.LOAD_PRODUCTS_SUCCESS:
            return update(state, {
                views: {
                    [action.payload.view]: {
                        products: { $set: action.payload.products },
                        page: { $set: action.payload.page },
                        pages: { $set: action.payload.pages },
                        loadStatus: { $set: 'DONE' },
                        message: { $set: null },
                    }
                }
            });
        default:
            return state;
    }
}