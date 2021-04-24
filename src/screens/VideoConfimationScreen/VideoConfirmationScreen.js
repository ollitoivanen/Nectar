import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  NativeModules,
  Image,
} from 'react-native';
const {SpotifyModule} = NativeModules;
import Video from 'react-native-video';
import CameraRoll from '@react-native-community/cameraroll';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {CAMERA_STATE_VIEW_FINDER} from 'constants/constants';

import {connect} from 'react-redux';
import ActionSetCameraState from 'ActionSetCameraState/ActionSetCameraState';

const VideoConfirmationScreen = ({route, navigation}) => {
  const [beginning, setBeginning] = useState(true);
  const [paused, setPaused] = useState(false);
  const [token, setToken] = useState(null);
  const {video, track, trackPlaybackPositionAtStart} = route.params;

  useEffect(() => {
    const _authenticate = async () => {
      await SpotifyModule.authenticate().then(async (token) => {
        setToken(token);
      });
    };
    _authenticate();
  }, []);

  const _searchTrackWeb = async () => {
    const trackUriLength = track.uri.length;
    const trackId = track.uri.substring(14, trackUriLength);

    return fetch('https://api.spotify.com/v1/tracks/' + trackId, {
      headers: {
        'Content-Type': 'application/json',

        Authorization: 'Bearer ' + token,
      },
      method: 'GET',
    })
      .then((response) => response.json())
      .then((json) => {
        //track
        return json;
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const _playTrackWeb = async () => {
    return fetch('https://api.spotify.com/v1/me/player/play', {
      headers: {
        'Content-Type': 'application/json',

        Authorization: 'Bearer ' + token,
      },
      method: 'PUT',
      body: JSON.stringify({
        uris: [track.uri],
        position_ms: trackPlaybackPositionAtStart,
      }),
    });
  };

  const _playVideo = async () => {
    if (paused) {
      if (beginning) {
        if (track !== null) {
          _playTrackWeb();
        }
        setPaused(false);
        setBeginning(false);
      } else {
        if (track !== null) {
          _resumeTrack();
        }
        setPaused(false);
      }
    } else if (!paused) {
      setPaused(true);
      if (track !== null) {
        _pauseTrack();
      }
    }
  };

  const _pauseTrack = () => {
    SpotifyModule.pause();
  };

  const _pauseTrackAtEnd = () => {
    setPaused(true);
    setBeginning(true);
    if (track !== null) {
      _pauseTrack();
    }
  };

  const _playTrackFromPosition = () => {
    SpotifyModule.playSongFromPosition(track.uri, trackPlaybackPositionAtStart);
  };

  const _resumeTrack = () => {
    SpotifyModule.resume();
  };

  const _concatArtists = (track) => {
    return track.artists.map((artist, index, array) => {
      if (index < array.length - 1) {
        return artist.name + ', ';
      } else {
        return artist.name;
      }
    });
  };

  const _saveVideo = async () => {
    CameraRoll.save(video.uri, {type: 'photo', album: 'Nectar'}).then(
      async () => {
        /*if (track !== null) {
          const searchedTrack = await _searchTrackWeb();
          try {
            const value = await AsyncStorage.getItem('videoTracks');
            let oldVideosTracks;
            if (value !== null) {
              oldVideosTracks = JSON.parse(value);
            } else {
              oldVideosTracks = [];
            }
            try {
              let ts = Math.round(new Date().getTime() / 1000);
              oldVideosTracks.push({
                node: {
                  timestamp: ts,
                  video: {
                    uri: video.uri,
                  },
                  track: {
                    id: searchedTrack.id,
                    uri: searchedTrack.uri,
                    name: searchedTrack.name,
                    length: searchedTrack.duration_ms,
                    artist: _concatArtists(searchedTrack),
                    album: searchedTrack.album.name,
                    albumImage: searchedTrack.album.images[0].url,
                    trackPlaybackPositionAtStart: trackPlaybackPositionAtStart,
                  },
                  type: 'videoTrack',
                },
              });
              await AsyncStorage.setItem(
                'videoTracks',
                JSON.stringify(oldVideosTracks),
              ).then(() => {
                navigation.popToTop();
              });
            } catch (e) {
              // saving error
            }
          } catch (e) {
            // error reading value
          }
        } else {}*/
        navigation.popToTop();
      },
    );
  };
  return (
    <View style={{flex: 1, backgroundColor: 'white', alignItems: 'center'}}>
      <View style={styles.view_image_container}>
        <Video
          paused={paused}
          onEnd={() => _pauseTrackAtEnd()}
          disableFocus={true}
          onLoad={() => setPaused(true)}
          source={{uri: video.uri}}
          style={{width: '100%', aspectRatio: 9 / 16}}></Video>
      </View>
      <View
        style={{
          position: 'absolute',
          bottom: 16,
          width: '100%',
          alignItems: 'center',
        }}>
        <View
          style={{
            alignSelf: 'center',
            borderWidth: 1.5,
            borderColor: '#f0f0f0',
            borderRadius: 100,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
            marginVertical: 8,
            maxWidth: '90%',
          }}>
          <TouchableOpacity
            onPress={() => {
              _playVideo();
            }}>
            <Image
              source={
                paused == false
                  ? require('Nectar/src/images/image_pause_icon.png')
                  : require('Nectar/src/images/image_play_icon.png')
              }
              style={{
                height: 42,
                width: 42,
                opacity: 0.6,
                marginStart: 0,
              }}></Image>
          </TouchableOpacity>
          {track !== null ? (
            <React.Fragment>
              <Image
                source={require('Nectar/src/images/image_spotify_icon.png')}
                style={{height: 16, width: 16, marginStart: 4}}></Image>
              <Text
                numberOfLines={1}
                style={{
                  marginStart: 8,
                  marginEnd: 12,
                  marginVertical: 4,
                  fontWeight: 'bold',
                  fontSize: 13,
                  flexShrink: 1,
                }}>
                {track.name}
              </Text>
            </React.Fragment>
          ) : null}
        </View>

        <View style={styles.view_savedelete_container}>
          <TouchableOpacity
            style={styles.view_delete_button}
            onPress={() => _discardVideo()}>
            <Text style={styles.text_delete}>Discard</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.view_save_button}
            onPress={() => _saveVideo()}>
            <Text style={styles.text_save}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  view_image_container: {
    width: '100%',
  },
  view_delete_button: {
    backgroundColor: 'white',
    flex: 1,
    marginHorizontal: 16,
    marginTop: 16,
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  view_save_button: {
    backgroundColor: 'black',
    flex: 1,
    marginHorizontal: 16,
    marginTop: 16,
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },

  view_savedelete_container: {
    width: '100%',
    flexDirection: 'row',
  },

  text_save: {
    margin: 8,
    fontWeight: 'bold',
    color: 'white',
    fontSize: 16,
  },
  text_delete: {
    margin: 8,
    fontWeight: 'bold',
    color: 'black',
    fontSize: 16,
  },
});
const mapStateToProps = (state) => {
  return {};
};

export default connect(mapStateToProps, {ActionSetCameraState})(
  VideoConfirmationScreen,
);
