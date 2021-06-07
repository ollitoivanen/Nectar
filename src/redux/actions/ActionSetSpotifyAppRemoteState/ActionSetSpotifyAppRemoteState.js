import {ACTION_SET_SPOTIFY_APP_REMOTE_STATE} from 'constants/constants';
export default ActionSetSpotifyAppRemoteState = (content) => ({
  type: ACTION_SET_SPOTIFY_APP_REMOTE_STATE,
  payload: content,
});
