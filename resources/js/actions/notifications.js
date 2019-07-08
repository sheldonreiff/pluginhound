import * as NotificationActionTypes from '../actionTypes/notifications';
const uuidv4 = require('uuid/v4');

export const createNotification = ({ type, message, duration, displayType }) => {
    return dispatch => {
        dispatch({
            type: NotificationActionTypes.ADD_NOTIFICATION,
            payload: {
                type,
                message,
                duration,
                displayType,
                id: uuidv4(),
            }
        })
    }
}

export const removeNotification = (id) => {
    return dispatch => {
        dispatch({
            type: NotificationActionTypes.HIDE_NOTIFICATION,
            payload: {
                id
            }
        });

        setTimeout(() => {
            dispatch({
                type: NotificationActionTypes.REMOVE_NOTIFICATION,
                payload: {
                    id
                }
            });
        }, 1000);
    }
}