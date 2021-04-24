import {ACTION_SET_FOCUS_MARKER_LOCATION} from 'constants/constants';
let initialState = {focusMarkerLocation: {x: null, y: null}};

export default ReducerFocusMarkerLocation = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_SET_FOCUS_MARKER_LOCATION:
      return {focusMarkerLocation: action.payload};
    default:
      return state;
  }
};
