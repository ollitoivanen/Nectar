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

const TrackDetailScreen = ({route, navigation}) => {
  const {track} = route.params.track.node;
  const [playing, setPlaying] = useState(null);

  const _deleteTrack = async () => {
    const value = await AsyncStorage.getItem('tracks');
    let tracksArray = JSON.parse(value);
    let deletableTrackIndex = tracksArray.findIndex(
      (track) => route.params.track.node.track.id === track.node.track.id,
    );
    tracksArray.splice(deletableTrackIndex, 1);
    await AsyncStorage.setItem('tracks', JSON.stringify(tracksArray)).then(
      () => {
        navigation.goBack();
      },
    );
  };

  return (
    <View style={styles.container}>
      <View style={{flex: 1, alignItems: 'center', width: '80%'}}>
        <Image
          source={{uri: track.albumImage}}
          style={{
            width: '100%',
            aspectRatio: 1,
            marginTop: 64,
            borderRadius: 0,
          }}></Image>
        <Text
          numberOfLines={2}
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
            numberOfLines={1}
            style={{
              fontWeight: 'bold',
              fontSize: 18,
              color: 'gray',
              marginStart: 6,
              textAlign: 'center',
              flexShrink: 1,
            }}>
            {track.artist}
          </Text>
        </View>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 14,
            marginTop: 16,
            textAlign: 'center',
          }}>
          {track.album}
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
            }}
            style={{}}>
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
          onPress={() => _deleteTrack()}
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
            Delete
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
export default TrackDetailScreen;
