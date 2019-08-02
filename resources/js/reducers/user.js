import * as UserActionTypes from '../actionTypes/user';

import update from 'immutability-helper';
import has from 'lodash/has';

const initial = {
    me: {},
    originalMe: {},
    status: 'GUEST',
    messages: [],
    loginOpen: false,
    resetMode: false,
    registerOpen: false,
    verifyEmailStatus: null,
    verifyEmailMessage: null,
    sendResetStatus: null,
    passwordResetStatus: null,
    passwordResetMessages: null,
};

export default function User(state=initial, action){
    switch(action.type){
        case UserActionTypes.LOGIN_PROGRESS:
            return update(state, {
                status: { $set: 'PROGRESS' },
            }); 
        case UserActionTypes.LOGIN_SUCCESS:
            return update(state, {
                status: { $set: 'LOGGED_IN' },
                messages: { $set: [] },
                loginOpen: { $set: false },
            });
        case UserActionTypes.LOGIN_ERROR:
            return update(state, {
                status: { $set: 'ERROR' },
                messages: { $set: ['Could not log in. Check your email or password of reset your password'] },
            });
        case UserActionTypes.TOGGLE_LOGIN_MODAL:
            return update(state, {
                loginOpen: { $set: action.payload.open }
            });
        case UserActionTypes.UPDATE_SUCCESS:
            return update(state, {
                me: { $set: action.payload.data },
                originalMe: { $set: action.payload.data },
                status: { $set: 'LOGGED_IN' },
            });
        case UserActionTypes.UPDATE_ERROR:
            return state;
        case UserActionTypes.UPDATE_VERIFYING:
            return update(state, {
                status: { $set: 'VERIFYING' },
            }); 
        case UserActionTypes.LOGOUT:
            return initial;
        case UserActionTypes.REGISTER_PROGRESS:
            return update(state, {
                status: { $set: 'REGISTER_PROGRESS' },
            });
        case UserActionTypes.REGISTER_SUCCESS:
            return update(state, {
                status: { $set: 'REGISTERED' },
                loginOpen: { $set: true },
                registerOpen: { $set: false },
            });
        case UserActionTypes.REGISTER_ERROR:
            return update(state, {
                status: { $set: 'REGISTER_ERROR' },
                messages: { $set: has(action, 'payload.error.response.data.errors') 
                ? Object.values(action.payload.error.response.data.errors).flat(1)
                : ['There was a problem gettng you registered. Please try again.'] },
            });
        case UserActionTypes.TOGGLE_REGISTER_MODAL:
            return update(state, {
                registerOpen: { $set: action.payload.open },
            });
        case UserActionTypes.UPDATE_USER:
            return update(state, {
                me: { 
                    [action.payload.field]: { $set: action.payload.value }
                }
            });
        case UserActionTypes.TOGGLE_RESET_MODE:
            return update(state, {
                resetMode: { $set: action.payload.open },
            }); 
        case UserActionTypes.SEND_RESET_PROGRESS:
            return update(state, {
                sendResetStatus: { $set: 'PROGRESS' },
            });
        case UserActionTypes.SEND_RESET_SUCCESS:
            return update(state, {
                sendResetStatus: { $set: 'SUCCESS' },
            });
        case UserActionTypes.SEND_RESET_ERROR:
            return update(state, {
                sendResetStatus: { $set: 'ERROR' },
            });
        case UserActionTypes.RESET_PASSWORD_PROGRESS:
            return update(state, {
                passwordResetStatus: { $set: 'PROGRESS' },
                passwordResetMessages: { $set: null },
            });
        case UserActionTypes.RESET_PASSWORD_SUCCESS:
            return update(state, {
                loginOpen: { $set: true },
                passwordResetStatus: { $set: 'SUCCESS' },
                passwordResetMessages: { $set: null },
            });
        case UserActionTypes.RESET_PASSWORD_ERROR:
            return update(state, {
                passwordResetStatus: { $set: 'ERROR' },
                passwordResetMessages: { $set: has(action, 'payload.error.response.data.errors') 
                ? Object.values(action.payload.error.response.data.errors).flat(1)
                : ["Couldn't reset password"] },
            });
        default:
            return state;
    }
}