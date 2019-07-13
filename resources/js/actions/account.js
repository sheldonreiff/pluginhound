import * as AccountActionTypes from '../actionTypes/account';
import Axios from 'axios';

import { getMe } from './user';

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

export const updatePassword = ({ currentPassword, newPassword, confirmNewPassword }) => {
    return dispatch => {

        dispatch({
            type: AccountActionTypes.UPDATE_USER_PROGRESS,
        });

        Axios({
            method: 'post',
            url: '/api/password/update',
            headers:{
                authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
            responseType: 'json',
            data: {
                current_password: currentPassword,
                new_password: newPassword,
                new_password_confirmation: confirmNewPassword,
            },
        }).then(res => {
            dispatch({
                type: AccountActionTypes.UPDATE_USER_SUCCESS
            });
        }).catch(error => {
            dispatch({
                type: AccountActionTypes.UPDATE_USER_ERROR,
                payload: {
                    error
                }
            });
        })
    }
}

export const updateUser = (data = {}) => {
    return dispatch => {

        dispatch({
            type: AccountActionTypes.UPDATE_USER_PROGRESS,
        });

        Axios({
            method: 'patch',
            url: '/api/me',
            headers:{
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
            responseType: 'json',
            data: {
                current_password: data.currentPassword,
                new_password: data.newPassword,
                new_password_confirmation: data.confirmNewPassword,
                email: data.email,
                first_name: data.firstName,
                last_name: data.lastName,
            },
        }).then(res => {
            dispatch({
                type: AccountActionTypes.UPDATE_USER_SUCCESS
            });
            dispatch(getMe());
        }).catch(error => {
            dispatch({
                type: AccountActionTypes.UPDATE_USER_ERROR,
                payload: {
                    error
                }
            });
        })
    }
}

export const clearResults = () => {
    return dispatch => {
        dispatch({
            type: AccountActionTypes.CLEAR_RESULTS
        });
    }
}

export const sendEmailVerification = () => {
    return dispatch => {
        dispatch({
            type: AccountActionTypes.SEND_VERIFY_PROGRESS
        });

        Axios({
            method: 'post',
            url: '/api/email/resend',
            headers:{
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
            responseType: 'json',
        }).then(res => {
            dispatch({
                type: AccountActionTypes.SEND_VERIFY_SUCCESS
            });
        }).catch(error => {
            dispatch({
                type: AccountActionTypes.SEND_VERIFY_ERROR,
                payload: {
                    error
                }
            });
        })
    }
}