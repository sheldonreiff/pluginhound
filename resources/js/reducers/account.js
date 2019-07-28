import * as AccountActionTypes from '../actionTypes/account';
import has from 'lodash/has';


const initial = {
    tab: null,
    sendEmailVerificationStatus: null,
    sendEmailVerificationMessage: null,
    userUpdateStatus: null,
    userUpdateMessage: null,
};

export default function Account(state=initial, action){
    switch(action.type){
        case AccountActionTypes.CHANGE_TAB:
            return {
                ...state,
                tab: action.payload.newTab
            }
        case AccountActionTypes.UPDATE_USER_SUCCESS:
            return {
                ...state,
                userUpdateStatus: 'SUCCESS'
            }
        case AccountActionTypes.UPDATE_USER_PROGRESS:
            return {
                ...state,
                userUpdateStatus: 'PROGRESS'
            }
        case AccountActionTypes.UPDATE_USER_ERROR:
            return {
                ...state,
                userUpdateStatus: 'ERROR',
                userUpdateMessage: has(action, 'payload.error.response.data.errors')
                ? Object.values(action.payload.error.response.data.errors)
                : ["Couldn't update user"],
            }
        case AccountActionTypes.CLEAR_RESULTS:
            return {
                ...state,
                userUpdateStatus: initial.userUpdateStatus,
                userUpdateMessage: initial.userUpdateMessage,
                sendEmailVerificationStatus: initial.sendEmailVerificationStatus,
                sendEmailVerificationMessage: initial.sendEmailVerificationMessage,
            }
        case AccountActionTypes.SEND_VERIFY_PROGRESS:
            return {
                ...state,
                sendEmailVerificationStatus: 'PROGRESS',
                sendEmailVerificationMessage: null,
            };
        case AccountActionTypes.SEND_VERIFY_SUCCESS:
            return {
                ...state,
                sendEmailVerificationStatus: 'SUCCESS',
                sendEmailVerificationMessage: null,
            };
        case AccountActionTypes.SEND_VERIFY_ERROR:
            return {
                ...state,
                sendEmailVerificationStatus: 'ERROR',
                sendEmailVerificationMessage: has(action, 'payload.error.response.data.errors')
                ? Object.values(action.payload.error.response.data.errors)
                : ["Couldn't send email verification"],
            };
        default:
            return state;
    }
}