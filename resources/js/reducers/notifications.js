import * as NotificationActionTypes from '../actionTypes/notifications';
import update from 'immutability-helper';

const initial = [];

export default function Notifications(state=initial, action){
    switch(action.type){
        case NotificationActionTypes.ADD_NOTIFICATION:
            let newNotifications = state;

            // allow only one notification at a time for topBar notifications
            if(action.payload.displayType === 'topBar'){
                newNotifications = state.filter(notification => notification.displayType !== 'topBar');
            }

            return update(newNotifications, {
                $push: [{
                    ...action.payload,
                    show: true,
                }]
            });
        case NotificationActionTypes.HIDE_NOTIFICATION:
            const notificationToHide = state.findIndex(notification => notification.id === action.payload.id);

            if(notificationToHide !== undefined){
                return update(state, {
                    [notificationToHide]: {
                        show: { $set: false }
                    }
                });
            }
        case NotificationActionTypes.REMOVE_NOTIFICATION:
            const notificationToRemove = state.findIndex(notification => notification.id === action.payload.id);

            if(notificationToRemove !== undefined){
                return update(state, {
                    $unset: [notificationToRemove]
                });
            }
        default:
            return state;
    }
}