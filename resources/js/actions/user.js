import * as UserActionTypes from '../actionTypes/user';

import React from 'react';

import { createNotification, NOTIFICATION_TYPE_SUCCESS, NOTIFICATION_TYPE_ERROR } from 'react-redux-notify';

import axios from 'axios';
import { NOTIFICATION_TYPE_INFO } from 'react-redux-notify/lib/modules/Notifications';

export const login = ({ email, password }) => {
    return (dispatch) => {
        
        dispatch({
            type: UserActionTypes.LOGIN_PROGRESS
        });

        axios({
            method: 'post',
            url: '/api/auth/login',
            data: {
                email,
                password
            }
        }).then(response => {

            const data = response.data;

            localStorage.setItem('accessToken', data.access_token);
            localStorage.setItem('accessTokenType', data.token_type);
            localStorage.setItem('accessExpiresIn', data.expires_in);

            dispatch({
                type: UserActionTypes.LOGIN_SUCCESS,
                payload: {
                    data
                }
            });

            dispatch(getMe());

            dispatch(createNotification({
                message: "You're logged in!",
                type: NOTIFICATION_TYPE_SUCCESS,
                duration: 7500,
                canDismiss: true
            }));

        }).catch(error => {
            console.log(error);
            dispatch({
                type: UserActionTypes.LOGIN_ERROR,
                payload: {
                    error
                }
            });
        });
    };
};

export const logout = () => {
    return dispatch => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('accessTokenType');
        localStorage.removeItem('accessExpiresIn');
        
        dispatch({
            type: UserActionTypes.LOGOUT
        });

        dispatch(createNotification({
            message: 'Logged out!',
            type: NOTIFICATION_TYPE_INFO,
            duration: 7500,
            canDismiss: true
        }));
    }
}

export const getMe = () => {
    return dispatch => {
        if(localStorage.getItem('accessToken')){
            axios({
                method: 'get',
                url: '/api/auth/me',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            }).then(response => {
                dispatch({
                    type: UserActionTypes.UPDATE_SUCCESS,
                    payload: {
                        data: response.data
                    }
                });
            }).catch(error => {
                console.log(error);
                dispatch({
                    type: UserActionTypes.UPDATE_ERROR,
                    payload: {
                        error
                    }
                });
            });
        }
    }
}

export const toggleLoginModal = (open) => {
    return (dispatch) => {
        dispatch({
            type: UserActionTypes.TOGGLE_LOGIN_MODAL,
            payload: {
                open
            }
        });
    }
}