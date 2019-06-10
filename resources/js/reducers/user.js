import * as UserActionTypes from '../actionTypes/user';

import update from 'immutability-helper';

const initial = {
    me: {},
    status: 'GUEST',
    message: null,
    loginOpen: false
};

export default function User(state=initial, action){
    switch(action.type){
        case UserActionTypes.LOGIN_PROGRESS:
            return update(state, {
                status: { $set: 'PROGRESS' }
            }); 
        case UserActionTypes.LOGIN_SUCCESS:
            return update(state, {
                status: { $set: 'LOGGED_IN' },
                message: { $set: null },
                loginOpen: { $set: false }
            });
        case UserActionTypes.LOGIN_ERROR:
            return update(state, {
                status: { $set: 'ERROR' },
                message: { $set: 'Could not log in' }
            });
        case UserActionTypes.TOGGLE_LOGIN_MODAL:
            return update(state, {
                loginOpen: { $set: action.payload.open }
            });
        case UserActionTypes.UPDATE_SUCCESS:
            return update(state, {
                me: { $set: action.payload.data },
                status: { $set: 'LOGGED_IN' },
            });
        case UserActionTypes.UPDATE_ERROR:
        
        case UserActionTypes.LOGOUT:
            return initial;
        default:
            return state;
    }
}