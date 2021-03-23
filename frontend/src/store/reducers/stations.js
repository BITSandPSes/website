import * as actionTypes from '../actions/actionTypes';

const initialState = {
  dataFetched: false,
  error: undefined,
  loading: false,
  data: undefined,
  index: undefined
}

const stationReducer = (state = initialState, action) => {
  switch(action.type) {
    case actionTypes.STATION_FETCH_START :
      return { index: undefined, error: undefined, loading: true, dataFetched: false, data: undefined };
    case actionTypes.STATION_FETCH_FAILED :
      return { index: undefined, error: action.payload, loading: false, dataFetched: false, data: undefined };
    case actionTypes.STATION_FETCH_SUCCESS :
      return { index: action.index, error: undefined, loading: false, dataFetched: true, data: action.payload };
    default:
      return {
        ...state
      }
  }
};

export default stationReducer;