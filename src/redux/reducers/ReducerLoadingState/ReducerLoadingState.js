import {ACTION_SET_LOADING_STATE} from 'constants/constants';
let initialState = {loadingState: true};

export default ReducerLoadingState = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_SET_LOADING_STATE:
      return {loadingState: action.payload};
    default:
      return state;
  }
};
