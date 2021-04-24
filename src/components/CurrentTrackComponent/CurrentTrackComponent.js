import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  NativeModules,
  Text,
} from 'react-native';
const {SpotifyModule} = NativeModules;
import {connect} from 'react-redux';
import {_concatArtists} from 'constants/constants';
import ImageTrackComponent from 'ImageTrackComponent/ImageTrackComponent';

const CurrentTrackComponent = (props) => {
  const {currentTrack} = props;
  const {isPaused} = currentTrack;

  const _changePlaybackState = () => {
    isPaused ? SpotifyModule.resume() : SpotifyModule.pause();
  };
  return (
    <View style={styles.view_container}>
      <TouchableOpacity onPress={() => _changePlaybackState()}>
        <Image
          source={
            isPaused
              ? require('Nectar/src/images/image_play_icon.png')
              : require('Nectar/src/images/image_pause_icon.png')
          }
          style={styles.image_playback_state}></Image>
      </TouchableOpacity>
      <ImageTrackComponent track={currentTrack} />
    </View>
  );
};
const styles = StyleSheet.create({
  view_container: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'center',
  },
  view_current_track: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
    maxWidth: '90%',
  },

  image_playback_state: {
    height: 32,
    width: 32,
    opacity: 0.5,
    marginStart: 4,
  },

  image_spotify_icon: {height: 18, width: 18, marginStart: 4},

  text_track_name: {
    marginStart: 8,
    marginEnd: 16,
    fontSize: 14,
    flexShrink: 1,
    fontFamily: 'Merriweather-Bold',
  },

  text_artist_name: {
    marginStart: 8,
    marginEnd: 16,
    fontSize: 10,
    flexShrink: 1,
    color: 'gray',
    fontFamily: 'Merriweather-Bold',
  },
});
const mapStateToProps = (state) => {
  return {
    currentTrack: state.ReducerCurrentTrack.currentTrack,
  };
};

export default connect(mapStateToProps, {})(CurrentTrackComponent);
/*
import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  NativeModules,
  Text,
} from 'react-native';
const {SpotifyModule} = NativeModules;

import {connect} from 'react-redux';

const CurrentTrackComponent = (props) => {
  const {currentTrack} = props;

  const _changePlaybackState = () => {
    currentTrack.isPaused ? SpotifyModule.resume() : SpotifyModule.pause();
  };
  return (
    <View style={styles.view_current_track}>
      <TouchableOpacity onPress={() => _changePlaybackState()}>
        <Image
          source={
            currentTrack.isPaused
              ? require('Nectar/src/images/image_play_icon.png')
              : require('Nectar/src/images/image_pause_icon.png')
          }
          style={styles.image_playback_state}></Image>
      </TouchableOpacity>
      <Image
        source={require('Nectar/src/images/image_spotify_icon.png')}
        style={styles.image_spotify_icon}></Image>
      <Text numberOfLines={1} style={styles.text_track_name}>
        {currentTrack.name}
      </Text>
    </View>
  );
};
const styles = StyleSheet.create({
  view_current_track: {
    alignSelf: 'center',
    borderWidth: 1.5,
    borderColor: '#f0f0f0',
    borderRadius: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    maxWidth: '90%',
  },

  image_playback_state: {
    height: 32,
    width: 32,
    opacity: 0.6,
    marginStart: 12,
  },

  image_spotify_icon: {height: 16, width: 16, marginStart: 4},

  text_track_name: {
    marginStart: 8,
    marginEnd: 16,
    marginVertical: 4,
    fontWeight: 'bold',
    fontSize: 12,
    flexShrink: 1,
  },
});
const mapStateToProps = (state) => {
  return {
    currentTrack: state.ReducerCurrentTrack.currentTrack,
  };
};

export default connect(mapStateToProps, {})(CurrentTrackComponent);

*/
