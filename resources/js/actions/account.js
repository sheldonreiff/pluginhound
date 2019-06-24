import * as AccountActionTypes from '../actionTypes/account';
import Axios from 'axios';

export const changeTab = (newTab) => {
    return dispatch => {
        dispatch({
            type: AccountActionTypes.CHANGE_TAB,
            payload: {
                newTab
            }
        });
    };
}

export const updatePassword = (newPassword) => {
    return dispatch => {
        Axios({
            method: 'post',
            url: '/api/'
        })
    }
}