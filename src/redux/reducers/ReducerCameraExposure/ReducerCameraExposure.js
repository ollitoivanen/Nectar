import {ACTION_SET_CAMERA_EXPOSURE} from 'constants/constants';
let initialState = {exposure: 0.5};

export default ReducerCameraExposure = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_SET_CAMERA_EXPOSURE:
      return {exposure: action.payload};
    default:
      return state;
  }
};
