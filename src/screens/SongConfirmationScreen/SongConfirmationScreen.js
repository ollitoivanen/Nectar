import React, {useState, useEffect, useRef} from 'react';
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

const SongConfirmationScreen = ({route, navigation}) => {
  const {track, token} = route.params;
  const trackLength = track.duration_ms;

  const [trackProgress, setTrackProgress] = useState(0);
  const [playing, setPlaying] = useState(null);
  const trackProcessInterval = useRef(null);

  useEffect(() => {
    return () => {
      if (trackProcessInterval.current) {
        SpotifyModule.pause();
        _pauseTrackProgress();
      }
    };
  }, []);

  const _startTrackProgress = () => {
    trackProcessInterval.current = setInterval(() => {
      setTrackProgress((oldProcess) => {
        return oldProcess + 1000;
      });
    }, 1000);
  };

  const _pauseTrackProgress = () => {
    clearInterval(trackProcessInterval.current);
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
              length: trackLength,
              artist: _concatArtists(),
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

  const _chooseSongWeb = async () => {
    let play = fetch('https://api.spotify.com/v1/me/player/play', {
      headers: {
        'Content-Type': 'application/json',

        Authorization: 'Bearer ' + token,
      },
      method: 'PUT',
      body: JSON.stringify({
        uris: [track.uri],
        position_ms: 0,
      }),
    });

    let pause = fetch('https://api.spotify.com/v1/me/player/pause', {
      headers: {
        'Content-Type': 'application/json',

        Authorization: 'Bearer ' + token,
      },
      method: 'PUT',
    });

    //
    Promise.all([play, pause]);
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
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() => {
              if (playing == null) {
                _startTrackProgress();
                SpotifyModule.playSong(track.uri);
                setPlaying(true);
              } else if (playing === false) {
                _startTrackProgress();
                SpotifyModule.resume();
                setPlaying(true);
              } else if (playing === true) {
                _pauseTrackProgress();
                SpotifyModule.pause();
                setPlaying(false);
              }
            }}>
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

          <View
            style={{
              flex: 1,
              height: 5,
              backgroundColor: '#f0f0f0',
              borderRadius: 10,
              marginEnd: 20,
            }}>
            <View
              style={{
                width: ((trackProgress / trackLength) * 100).toString() + '%',
                maxWidth: '100%',
                height: 5,
                backgroundColor: 'black',
                borderRadius: 10,
              }}></View>
          </View>
        </View>
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
          onPress={async () => {
            await _chooseSongWeb();
            navigation.navigate('Camera', {track});
          }}
          style={{
            borderWidth: 2,
            borderRadius: 50,
            borderColor: 'black',
            alignItems: 'center',
            justifyContent: 'center',
            marginHorizontal: 8,
            marginVertical: 8,
            flex: 1,
            backgroundColor: 'black',
          }}>
          <Text
            numberOfLines={1}
            style={{
              fontFamily: 'Merriweather-Bold',
              fontSize: 14,
              color: 'white',
              margin: 8,
            }}>
            Use in a video
          </Text>
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
export default SongConfirmationScreen;
