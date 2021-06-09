import {ACTION_SET_VIDEO_PLAYBACK_STATE} from 'constants/constants';
export default ActionSetVideoPlaybackState = (content) => ({
  type: ACTION_SET_VIDEO_PLAYBACK_STATE,
  payload: content,
});
