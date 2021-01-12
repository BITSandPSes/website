import * as actionTypes from './actionTypes';
import axios from 'axios';
import baseUrl from '../../baseUrl';

const logThemIn = () => {
    return {
        type: actionTypes.LOGIN
    };
}

export const login = () => {
    return (dispatch) => {
        dispatch(logThemIn());
    }
}

export const logout = () => {
    return (dispatch) => {
        const cookies = document.cookie.split('; ');
        const value = cookies.find(item => item.startsWith('jwt')).split('=')[1];
        axios({
            url: baseUrl + '/auth/logout',
            method: 'post',
            headers: {
            Authorization: `Bearer ${value}`
            }
        }).then( response => {
            if(response.status === 200) {
                document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
                alert("you have been logged out");
                dispatch({ type: actionTypes.LOGOUT });
            } else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;
            }
        }).catch(error => {
            alert("Could not logout.\nError: "+ error.message);
        });
    };
}
