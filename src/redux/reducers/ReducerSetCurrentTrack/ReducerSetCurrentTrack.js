import {ACTION_SET_CURRENT_TRACK} from 'constants/constants';
let initialState = {currentTrack: null};

export default ReducerSetCurrentTrack = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_SET_CURRENT_TRACK:
      return {currentTrack: action.payload};
    default:
      return state;
  }
};
