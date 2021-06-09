import {combineReducers} from 'redux';
import ReducerCurrentTrack from 'ReducerCurrentTrack/ReducerCurrentTrack';
import ReducerCameraExposure from 'ReducerCameraExposure/ReducerCameraExposure';
import ReducerCameraState from 'ReducerCameraState/ReducerCameraState';
import ReducerCameraType from 'ReducerCameraType/ReducerCameraType';
import ReducerFocusMarkerLocation from 'ReducerFocusMarkerLocation/ReducerFocusMarkerLocation';
import ReducerLoadingState from 'ReducerLoadingState/ReducerLoadingState';
import ReducerSpotifyAppRemoteState from 'ReducerSpotifyAppRemoteState/ReducerSpotifyAppRemoteState';
import ReducerVideoPlaybackState from 'ReducerVideoPlaybackState/ReducerVideoPlaybackState';
export default combineReducers({
  ReducerCurrentTrack,
  ReducerCameraExposure,
  ReducerCameraState,
  ReducerCameraType,
  ReducerFocusMarkerLocation,
  ReducerLoadingState,
  ReducerSpotifyAppRemoteState,
  ReducerVideoPlaybackState,
});
