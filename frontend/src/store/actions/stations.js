import * as actionTypes from './actionTypes';
import axios from 'axios';
import baseUrl from '../../baseUrl';

export const stationStart = () => {
  return {
    type: actionTypes.STATION_FETCH_START
  };
}

export const stationSuccess = (data, index) => {
  return {
    type: actionTypes.STATION_FETCH_SUCCESS,
    payload: data,
    index: index
  };
}

export const stationFail = (error) => {
  return {
    type: actionTypes.STATION_FETCH_FAILED,
    payload: error
  };
}

const fetching = async(index,dispatch) => {
  try {
    const response = await axios('/api/'+ index);
    if(response.status === 200) {
      console.log(response.data);
      dispatch(stationSuccess(response.data,index));
    }
    else {
      var err = new Error(response.status + ': ' + response.statusText);
      throw err;
    }
  } catch(error) {
    dispatch(stationFail(error));
    // alert("could not fetch search results.\nError: "+ error.message);
  }
}

export const stationFetch = (index) => {
  return (dispatch) => {
    dispatch(stationStart());
    fetching(index,dispatch);
  }
}
