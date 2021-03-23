import * as actionTypes from '../actions/actionTypes';

const initialState = {
  dataFetched: false,
  error: undefined,
  loading: false,
  data: undefined
}

const courseReducer = (state = initialState, action) => {
  switch(action.type) {
    case actionTypes.COURSE_FETCH_START :
      return { error: undefined, loading: true, dataFetched: false, data: undefined };
    case actionTypes.COURSE_FETCH_FAILED :
      return { error: action.payload, loading: false, dataFetched: false, data: undefined };
    case actionTypes.COURSE_FETCH_SUCCESS :
      return { error: undefined, loading: false, dataFetched: true, data: action.payload };
    default:
      return {
        ...state
      }
  }
};

export default courseReducer;