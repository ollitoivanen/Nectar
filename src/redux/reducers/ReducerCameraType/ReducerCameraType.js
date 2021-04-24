import {ACTION_SET_CAMERA_TYPE} from 'constants/constants';
import {RNCamera} from 'react-native-camera';
let initialState = {cameraType: RNCamera.Constants.Type.back};

export default ReducerCameraType = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_SET_CAMERA_TYPE:
      return {cameraType: action.payload};
    default:
      return state;
  }
};
