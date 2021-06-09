import {ACTION_SET_VIDEO_PLAYBACK_STATE} from 'constants/constants';
let initialState = {videoPlaybackState: false};

//Currently not in use

export default ReducerVideoPlaybackState = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_SET_VIDEO_PLAYBACK_STATE:
      return {videoPlaybackState: action.payload};
    default:
      return state;
  }
};
