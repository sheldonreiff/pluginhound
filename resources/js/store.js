import { applyMiddleware, createStore, combineReducers } from 'redux';
import thunk from 'redux-thunk';

import notifyReducer from 'react-redux-notify';
import accountReducer from './reducers/account';
import userReducer from './reducers/user';

const combinedReducers = combineReducers({
    account: accountReducer,
    user: userReducer,
    notifications: notifyReducer
});

const middleware = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(applyMiddleware(thunk)) || compose : applyMiddleware(thunk);

const store = createStore(
    combinedReducers,
    middleware
);

export default store;