import * as AccountActionTypes from '../actionTypes/account';

const initial = {
    tab: null
};

export default function Account(state=initial, action){
    switch(action.type){
        case AccountActionTypes.CHANGE_TAB:
            return {
                ...state,
                tab: action.payload.newTab
            }
        default:
            return state;
    }
}