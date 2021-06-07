import React, {useRef, useEffect} from 'react';
import {AppState, NativeModules, NativeEventEmitter} from 'react-native';

import {CurrentTrack} from 'constants/constants';
import ActionSetCurrentTrack from 'ActionSetCurrentTrack/ActionSetCurrentTrack';
import ActionSetLoadingState from 'ActionSetLoadingState/ActionSetLoadingState';
import ActionSetSpotifyAppRemoteState from 'ActionSetSpotifyAppRemoteState/ActionSetSpotifyAppRemoteState';
import AsyncStorage from '@react-native-async-storage/async-storage';
const {SpotifyModule} = NativeModules;
import {connect} from 'react-redux';

const AppStateContainer = (props) => {
  const {
    spotifyAppRemoteState,
    ActionSetLoadingState,
    ActionSetSpotifyAppRemoteState,
  } = props;
  const appStateListener = useRef(null);

  useEffect(() => {
    _attachAppStateListener();

    return () => {
      _detachAppStateListener();
    };
  }, []);

  const _attachAppStateListener = () => {
    appStateListener.current = AppState.addEventListener(
      'change',
      _handleAppStateChange,
    );
  };

  const _detachAppStateListener = () => {
    if (appStateListener == null) return;
    appStateListener.current.removeEventListener(
      'change',
      _handleAppStateChange,
    );
  };

  const _handleAppStateChange = (nextAppState) => {
    if (nextAppState == null) return;
    if (nextAppState === 'active') {
      ActionSetLoadingState(false);
      //_subscribeToAppRemote();
    }
    if (nextAppState === 'background') {
      _disconnectFromAppRemote();
    }
  };

  const _disconnectFromAppRemote = async () => {
    if (spotifyAppRemoteState == false) return;
    ActionSetSpotifyAppRemoteState(false);
    await SpotifyModule.disconnectFromAppRemote();
  };

  /* not in use at 1.0 

  

  const _attachPlayerStateListener = () => {
    const eventEmitter = new NativeEventEmitter(SpotifyModule);
    playerStateListener.current = eventEmitter.addListener(
      'playerState',
      (event) => {
        
       /**  event:{
          isPaused,
          nameame,
          uri,
          playbackPosition
        }
        
        if (event?.uri == null) return;
        _setCurrentTrack(event);
      },
    );
  };

  const _detachPlayerStateListener = () => {
    if (playerStateListener.current == null) return;
    playerStateListener.current.remove();
  };

  const _setCurrentTrack = (event) => {
    let {name, uri, artists, imageUri, isPaused} = event;
    let currentTrack = new CurrentTrack(name, uri, artists, imageUri, isPaused);
    props.ActionSetCurrentTrack(currentTrack);
  };

  */

  return null;
};
const mapStateToProps = (state) => {
  return {
    spotifyAppRemoteState:
      state.ReducerSpotifyAppRemoteState.spotifyAppRemoteState,
  };
};
export default connect(mapStateToProps, {
  ActionSetCurrentTrack,
  ActionSetLoadingState,
  ActionSetSpotifyAppRemoteState,
})(AppStateContainer);
