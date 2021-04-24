import React, {useRef, useEffect} from 'react';
import {AppState, NativeModules, NativeEventEmitter} from 'react-native';

import {CurrentTrack} from 'constants/constants';
import ActionSetCurrentTrack from 'ActionSetCurrentTrack/ActionSetCurrentTrack';
const {SpotifyModule} = NativeModules;
import {connect} from 'react-redux';

const AppStateContainer = (props) => {
  const appRemoteSubscription = useRef(null);
  const playerStateListener = useRef(null);
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
      _subscribeToAppRemote().then(() => _attachPlayerStateListener());
    }
    if (nextAppState === 'background') {
      _disconnectFromAppRemote().then(() => _detachPlayerStateListener());
    }
  };

  const _subscribeToAppRemote = async () => {
    appRemoteSubscription.current = await SpotifyModule.subscribeToAppRemote();
  };

  const _disconnectFromAppRemote = async () => {
    if (appRemoteSubscription == null) return;
    await SpotifyModule.disconnect();
  };

  const _attachPlayerStateListener = () => {
    const eventEmitter = new NativeEventEmitter(SpotifyModule);
    playerStateListener.current = eventEmitter.addListener(
      'playerState',
      (event) => {
        /*
        event:{
          isPaused,
          nameame,
          uri,
          playbackPosition
        }
        */
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

  return null;
};
const mapStateToProps = (state) => {
  return {};
};
export default connect(mapStateToProps, {ActionSetCurrentTrack})(
  AppStateContainer,
);
