import * as actionTypes from '../actions/actionTypes';

const initialState = {
    loggedIn: false
}

const loginReducer = (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.LOGIN :
            return { loggedIn: true }
        case actionTypes.LOGOUT :
            return { loggedIn: false }
        default:
            return state;
    }
};

export default loginReducer;