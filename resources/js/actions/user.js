import * as UserActionTypes from '../actionTypes/user';
import has from 'lodash/has';
import { createNotification } from '../actions/notifications';
import axios from 'axios';
import history from '../history';
import React from 'react';
import { ClipLoader } from 'react-spinners';
const queryString = require('query-string');
import jwt_decode from 'jwt-decode';
import * as Sentry from '@sentry/browser';


import { loadProducts } from './products';

export const register = ({ firstName, lastName, email, password, confirmPassword }) => {
    return dispatch => {

        dispatch({
            type: UserActionTypes.REGISTER_PROGRESS
        });
        axios({
            method: 'post',
            url: '/api/auth/register',
            data: {
                first_name: firstName,
                last_name: lastName,
                email,
                password,
                password_confirmation: confirmPassword,
            }
        }).then(response => {

            dispatch({
                type: UserActionTypes.REGISTER_SUCCESS
            });

        }).catch(error => {
            dispatch({
                type: UserActionTypes.REGISTER_ERROR,
                payload: {
                    error
                }
            });
        });
    }
}

export const toggleRegisterModal = (open) => {
    return (dispatch) => {
        dispatch({
            type: UserActionTypes.TOGGLE_REGISTER_MODAL,
            payload: {
                open
            }
        });
    }
}




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

            dispatch(toggleLoginModal(false));

            dispatch(getMe());

            dispatch(createNotification({
                message: "You're logged in!",
                type: 'SUCCESS',
                duration: 3000,
            }));

        }).catch(error => {
            dispatch({
                type: UserActionTypes.LOGIN_ERROR,
                payload: {
                    error
                }
            });
        });

        const intervalId = setInterval( () => {
            if(!validateUser()){
                clearInterval(intervalId);
                dispatch(logout());   
            }
        }, 10000);
    };
};

export const logout = () => {
    return dispatch => {
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('accessTokenType');
        localStorage.removeItem('accessExpiresIn');

        dispatch({
            type: UserActionTypes.LOGOUT
        });

        dispatch(createNotification({
            message: 'Logged out!',
            type: 'INFO',
            duration: 3000,
        }));

        history.push('/');

        dispatch(loadProducts({ view: 'bestDeals', reload: true }));
    }
}

const validateUser = () => {
    const token = localStorage.getItem('accessToken');

    if(!token){
        return false;
    }

    const decoded = jwt_decode(token);

    return new Date().getTime() / 1000 < decoded.exp;
}

export const getMe = () => {
    return dispatch => {
        if(localStorage.getItem('accessToken')){

            if(!validateUser()){
                dispatch(logout());
                return;
            }

            axios({
                method: 'get',
                url: '/api/auth/me',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            }).then(response => {

                const user = response.data;

                Sentry.setUser(user);

                localStorage.setItem('user', JSON.stringify(user));

                dispatch({
                    type: UserActionTypes.UPDATE_SUCCESS,
                    payload: {
                        data: user
                    }
                });
            }).catch(error => {
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

export const toggleResetMode = (open) => {
    return dispatch => {
        dispatch({
            type: UserActionTypes.TOGGLE_RESET_MODE,
            payload: {
                open,
                messages: [],
            }
        });
    }
}

export const verifyEmail = () => {
    return (dispatch, getState) => {
        dispatch(createNotification({
            type: 'INFO', 
            message: <span>
                Verifying email...  
                <ClipLoader
                    sizeUnit={'px'}
                    size={15}
                    color='white'
                    loading={true}
                />
            </span>,
        }));

        const urlParams = new URLSearchParams(window.location.search);

        const signedUrl = urlParams.get('signedRoute');

        history.replace('/');

        axios({
            method: 'get',
            url: decodeURI(signedUrl),
            headers:{
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
            responseType: 'json',
        }).then(res => {
            dispatch(createNotification({
                type: 'SUCCESS', 
                message: 'Email verified!', 
                duration: 10000, 
            }));
            dispatch(getMe());
        }).catch(error => {
            dispatch(createNotification({
                type: 'ERROR', 
                message: has(error, 'response.data.errors') 
                ? Object.values(error.response.data.errors).flat(1)[0]
                : 'There was a problem verifying your email. Please try again.', 
                duration: 10000, 
            }));
        });
    }
}

export const updateUser = (field, value) => {
    return dispatch => {
        dispatch({
            type: UserActionTypes.UPDATE_USER,
            payload: {
                field,
                value
            }
        });
    }
}

export const sendPasswordReset = (email) => {
    return dispatch => {
        dispatch({
            type: UserActionTypes.SEND_RESET_PROGRESS,
        });

        axios({
            method: 'post',
            url: '/api/password/send',
            data: {
                email,
            },
            responseType: 'json'
        }).then(res => {
            dispatch({
                type: UserActionTypes.SEND_RESET_SUCCESS,
            });
        }).catch(error => {
            dispatch({
                type: UserActionTypes.SEND_RESET_ERROR,
            });
        })
    }
}

export const resetPassword = ({ password, password_confirmation, signature }) => {
    return dispatch => {
        dispatch({
            type: UserActionTypes.RESET_PASSWORD_PROGRESS,
        });

        const signatureParsed = queryString.parse(signature);

        axios({
            method: 'post',
            url: `/api/password/reset`,
            data: {
                password,
                password_confirmation,
                ...signatureParsed,
            },
            responseType: 'json'
        }).then(res => {
            history.push('/');
            dispatch({
                type: UserActionTypes.RESET_PASSWORD_SUCCESS,
            });
        }).catch(error => {
            dispatch({
                type: UserActionTypes.RESET_PASSWORD_ERROR,
                payload: {
                    error
                },
            });
        });
    }
}