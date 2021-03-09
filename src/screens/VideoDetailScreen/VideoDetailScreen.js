import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Text,
  Animated,
  Platform,
  NativeModules,
} from 'react-native';
import CameraRoll from '@react-native-community/cameraroll';
import Video from 'react-native-video';
const {SpotifyModule} = NativeModules;

const VideoDetailScreen = ({route, navigation}) => {
  const [beginning, setBeginning] = useState(true);
  const [paused, setPaused] = useState(false);
  const [token, setToken] = useState(null);
  const [optionsModalHeight, setOptionsModalHeight] = useState(
    new Animated.Value(-300),
  );

  const {track} = route.params.video.node.videoTrack.node;

  useEffect(() => {
    const _authenticate = async () => {
      await SpotifyModule.authenticate().then(async (token) => {
        setToken(token);
      });
    };
    _authenticate();
  }, []);

  const _deleteImage = () => {
    CameraRoll.deletePhotos([route.params.video.node.image.uri]).then(() => {
      navigation.navigate('Gallery');
    });
  };

  const _formatTime = () => {
    let unix_timestamp = route.params.video.node.timestamp;

    let date = new Date(unix_timestamp * 1000);
    let weekdays = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ];
    let months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    let dayOfTheWeek = weekdays[date.getDay()];
    let dayOfTheMonth = date.getDate();
    let month = months[date.getMonth()];
    let year = date.getFullYear();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    if (minutes < 10) {
      minutes = '0' + minutes;
    }

    let formattedTime =
      dayOfTheWeek +
      ' ' +
      dayOfTheMonth +
      ' ' +
      month +
      ' ' +
      year +
      ', ' +
      hours +
      ':' +
      minutes;

    return formattedTime;
  };

  const _makeOptionsVisible = (toVisibilty) => {
    if (toVisibilty === true) {
      Animated.timing(optionsModalHeight, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(optionsModalHeight, {
        toValue: -300,
        duration: 500,
        useNativeDriver: false,
      }).start();
    }
  };

  const _checkImageOrientation = () => {
    let aspectRatio = 9 / 16;
    let {image} = route.params.video.node;
    if (Platform.OS == 'android') {
      if (image.orientation == 90 || image.orientation == 270) {
        aspectRatio = image.height / image.width;
      } else if (image.orientation == 0 || image.orientation == 180) {
        aspectRatio = image.width / image.height;
      }
    } else {
      aspectRatio = image.width / image.height;
    }
    return aspectRatio;
  };

  const _playTrackWeb = async () => {
    return fetch('https://api.spotify.com/v1/me/player/play', {
      headers: {
        'Content-Type': 'application/json',

        Authorization: 'Bearer ' + token,
      },
      method: 'PUT',
      body: JSON.stringify({
        uris: [route.params.video.node.videoTrack.node.track.uri],
        position_ms:
          route.params.video.node.videoTrack.node.track
            .trackPlaybackPositionAtStart,
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

  const _resumeTrack = () => {
    SpotifyModule.resume();
  };

  return (
    <View style={styles.container}>
      <View style={{flex: 1, width: '95%', justifyContent: 'center'}}>
        <Video
          paused={paused}
          onEnd={() => _pauseTrackAtEnd()}
          disableFocus={true}
          onLoad={() => setPaused(true)}
          style={{width: '100%', aspectRatio: _checkImageOrientation()}}
          source={{uri: route.params.video.node.image.uri}}></Video>
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
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
        }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.view_back_button_container}>
          <Image
            style={styles.image_backarrow}
            source={require('Nectar/src/images/image_downarrow.png')}></Image>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => _makeOptionsVisible(true)}>
          <Text style={{fontSize: 20, marginHorizontal: 24}}>⋮</Text>
        </TouchableOpacity>
      </View>
      <Animated.View
        style={{
          position: 'absolute',
          bottom: optionsModalHeight,
          width: '100%',
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: 'lightgray',
          paddingTop: 8,
        }}>
        <TouchableOpacity
          onPress={() => _deleteImage()}
          style={styles.view_delete_button}>
          <Text style={styles.text_delete}>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => _makeOptionsVisible(false)}
          style={styles.view_journal_button_container}>
          <Image
            style={styles.image_downarrow}
            source={require('Nectar/src/images/image_downarrow.png')}></Image>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },

  text_delete: {
    fontSize: 18,
    fontFamily: 'Merriweather-Bold',
    margin: 8,
  },
  view_back_button_container: {
    paddingVertical: 16,
    paddingStart: 16,
    flex: 1,
  },

  view_delete_button: {
    borderWidth: 2,
    borderRadius: 50,
    borderColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  view_journal_button_container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  image_backarrow: {
    height: 30,
    width: 30,
    transform: [{rotate: '90deg'}],
  },
  image_downarrow: {
    height: 26,
    width: 26,
  },
});
export default VideoDetailScreen;
