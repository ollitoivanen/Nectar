import {ACTION_SET_APP_REMOTE_STATE} from 'constants/constants';
let initialState = {spotifyAppRemoteState: false};

export default ReducerSpotifyAppRemoteState = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case ACTION_SET_APP_REMOTE_STATE:
      return {spotifyAppRemoteState: action.payload};
    default:
      return state;
  }
};
