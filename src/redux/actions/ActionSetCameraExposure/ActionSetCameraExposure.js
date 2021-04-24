import {ACTION_SET_CAMERA_EXPOSURE} from 'constants/constants';
export default ActionSetCameraExposure = (content) => ({
  type: ACTION_SET_CAMERA_EXPOSURE,
  payload: content,
});
