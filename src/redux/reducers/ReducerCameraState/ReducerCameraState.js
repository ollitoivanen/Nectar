import {
  ACTION_SET_CAMERA_STATE,
  CAMERA_STATE_VIEW_FINDER,
} from 'constants/constants';
let initialState = {cameraState: CAMERA_STATE_VIEW_FINDER};

export default ReducerCameraState = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_SET_CAMERA_STATE:
      return {cameraState: action.payload};
    default:
      return state;
  }
};
