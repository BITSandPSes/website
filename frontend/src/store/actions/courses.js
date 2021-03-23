import * as actionTypes from './actionTypes';
import axios from 'axios';
import baseUrl from '../../baseUrl';

export const courseStart = () => {
  return {
    type: actionTypes.COURSE_FETCH_START
  };
}

export const courseSuccess = (data) => {
  return {
    type: actionTypes.COURSE_FETCH_SUCCESS,
    payload: data
  };
}

export const courseFail = (error) => {
  return {
    type: actionTypes.COURSE_FETCH_FAILED,
    payload: error
  };
}

const fetching = async(dispatch) => {
  try {
    const response = await axios('/api/course');
    if(response.status === 200) {
      dispatch(courseSuccess(response.data));
    }
    else {
      var err = new Error(response.status + ': ' + response.statusText);
      throw err;
    }
  } catch(error) {
    dispatch(courseFail(error));
    // alert("could not fetch search results.\nError: "+ error.message);
  }
}

export const courseFetch = () => {
  return (dispatch) => {
    dispatch(courseStart());
    fetching(dispatch);
  }
}