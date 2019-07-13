import { applyMiddleware, createStore, combineReducers } from 'redux';
import thunk from 'redux-thunk';

import notificationReducer from './reducers/notifications';
import accountReducer from './reducers/account';
import userReducer from './reducers/user';
import productReducer from './reducers/product';
import productsReducer from './reducers/products';
import alertsReducer from './reducers/alerts';

const combinedReducers = combineReducers({
    account: accountReducer,
    user: userReducer,
    product: productReducer,
    products: productsReducer,
    alerts: alertsReducer,
    notifications: notificationReducer,
});

const middleware = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(applyMiddleware(thunk)) || compose : applyMiddleware(thunk);

const store = createStore(
    combinedReducers,
    middleware
);

export default store;