import * as AccountActionTypes from '../actionTypes/account';

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