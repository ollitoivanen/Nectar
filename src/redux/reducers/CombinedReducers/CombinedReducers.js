import {combineReducers} from 'redux';
import ReducerCurrentTrack from 'ReducerCurrentTrack/ReducerCurrentTrack';
import ReducerCameraExposure from 'ReducerCameraExposure/ReducerCameraExposure';
import ReducerCameraState from 'ReducerCameraState/ReducerCameraState';
import ReducerCameraType from 'ReducerCameraType/ReducerCameraType';
import ReducerFocusMarkerLocation from 'ReducerFocusMarkerLocation/ReducerFocusMarkerLocation';
export default combineReducers({
  ReducerCurrentTrack,
  ReducerCameraExposure,
  ReducerCameraState,
  ReducerCameraType,
  ReducerFocusMarkerLocation,
});
