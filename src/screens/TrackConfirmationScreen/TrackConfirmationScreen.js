import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  NativeModules,
} from 'react-native';
const {SpotifyModule} = NativeModules;
import AsyncStorage from '@react-native-async-storage/async-storage';
import {connect} from 'react-redux';

import ActionSetSpotifyAppRemoteState from 'ActionSetSpotifyAppRemoteState/ActionSetSpotifyAppRemoteState';

const TrackConfirmationScreen = (props) => {
  const {
    spotifyAppRemoteState,
    ActionSetSpotifyAppRemoteState,
    route,
    navigation,
  } = props;
  const {track, token} = route.params;
  const {artists} = track;

  const [playing, setPlaying] = useState(null);

  const _changePlaybackState = async () => {
    switch (playing) {
      case null:
        await _connectToSpotifyAppRemote().then(async () => {
          _playTrack();
        });
        break;
      case false:
        _resumeTrack();
        break;
      case true:
        _pauseTrack();
        break;
      default:
        break;
    }
  };

  const _connectToSpotifyAppRemote = async () => {
    if (spotifyAppRemoteState == true) return;
    await SpotifyModule.subscribeToAppRemote();
    ActionSetSpotifyAppRemoteState(true);
  };

  const _playTrack = () => {
    setPlaying(true);
    SpotifyModule.playTrack(track.uri);
  };

  const _resumeTrack = () => {
    setPlaying(true);
    SpotifyModule.resume();
  };

  const _pauseTrack = () => {
    setPlaying(false);
    SpotifyModule.pause();
  };

  const _saveTrack = async () => {
    try {
      const value = await AsyncStorage.getItem('tracks');
      let oldTracks;
      if (value !== null) {
        oldTracks = JSON.parse(value);
      } else {
        oldTracks = [];
      }
      try {
        let ts = Math.round(new Date().getTime() / 1000);
        oldTracks.push({
          node: {
            timestamp: ts,
            track: {
              id: track.id,
              uri: track.uri,
              name: track.name,
              length: track.durationms,
              artist: _concatArtists(artists),
              album: track.album.name,
              albumImage: track.album.images[0].url,
            },
            type: 'track',
          },
        });
        await AsyncStorage.setItem('tracks', JSON.stringify(oldTracks)).then(
          () => {
            navigation.popToTop();
          },
        );
      } catch (e) {
        // saving error
      }
    } catch (e) {
      // error reading value
    }
  };

  const _concatArtists = () => {
    return track.artists.map((artist, index, array) => {
      if (index < array.length - 1) {
        return artist.name + ', ';
      } else {
        return artist.name;
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={{flex: 1, alignItems: 'center', width: '80%'}}>
        <Image
          source={{uri: track.album.images[0].url}}
          style={{
            width: '100%',
            aspectRatio: 1,
            marginTop: 64,
            borderRadius: 0,
          }}></Image>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 22,
            marginTop: 32,
            textAlign: 'center',
          }}>
          {track.name}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 8,
          }}>
          <Image
            source={require('Nectar/src/images/image_spotify_icon.png')}
            style={{height: 24, width: 24}}></Image>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 18,
              color: 'gray',
              marginStart: 6,
              textAlign: 'center',
            }}>
            {_concatArtists()}
          </Text>
        </View>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 14,
            marginTop: 16,
            textAlign: 'center',
          }}>
          {track.album.name}
        </Text>

        <TouchableOpacity onPress={() => _changePlaybackState()}>
          <Image
            source={
              playing == true
                ? require('Nectar/src/images/image_pause_icon.png')
                : require('Nectar/src/images/image_play_icon.png')
            }
            style={{
              height: 32,
              width: 32,
              margin: 8,
              marginStart: 0,
              opacity: 0.6,
            }}></Image>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          alignItems: 'center',
          marginBottom: 8,
        }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.view_back_button_container}>
          <Image
            style={styles.image_backarrow}
            source={require('Nectar/src/images/image_downarrow.png')}></Image>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => _saveTrack()}
          style={{
            borderWidth: 2,
            borderRadius: 50,
            borderColor: 'black',
            alignItems: 'center',
            justifyContent: 'center',
            marginHorizontal: 8,
            marginVertical: 8,
            flex: 1,
          }}>
          <Text
            numberOfLines={1}
            style={{
              fontFamily: 'Merriweather-Bold',
              fontSize: 14,
              color: 'black',
              margin: 8,
            }}>
            Save to Journal
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },

  view_back_button_container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  image_backarrow: {
    height: 26,
    width: 26,
    transform: [{rotate: '90deg'}],
    margin: 16,
  },
});
const mapStateToProps = (state) => {
  return {
    spotifyAppRemoteState:
      state.ReducerSpotifyAppRemoteState.spotifyAppRemoteState,
  };
};

export default connect(mapStateToProps, {ActionSetSpotifyAppRemoteState})(
  TrackConfirmationScreen,
);
