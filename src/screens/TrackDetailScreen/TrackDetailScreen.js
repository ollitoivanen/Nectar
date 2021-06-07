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
import JournalItemOptionsComponent from 'JournalItemOptionsComponent/JournalItemOptionsComponent';

const TrackDetailScreen = ({route, navigation}) => {
  const {track} = route.params;
  const [playing, setPlaying] = useState(null);
  const [optionsModalVisible, setOptionsModalVisible] = useState(false);

  const _changeOptionsModalVisibility = (toVisibility) => {
    setOptionsModalVisible(toVisibility);
  };

  const _deleteTrack = async () => {
    const value = await AsyncStorage.getItem('tracks');
    let tracksArray = JSON.parse(value);
    let deletableTrackIndex = tracksArray.findIndex(
      (indexTrack) => route.params.track.id === indexTrack.node.track.id,
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
      <View style={{flex: 1, alignItems: 'center', width: '95%'}}>
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
                SpotifyModule.playTrack(track.uri);
                setPlaying(true);
              } else if (playing === false) {
                SpotifyModule.resume();
                setPlaying(true);
              } else if (playing === true) {
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
        <TouchableOpacity onPress={() => _changeOptionsModalVisibility(true)}>
          <Text style={{fontSize: 20, marginHorizontal: 24}}>⋮</Text>
        </TouchableOpacity>
      </View>
      {optionsModalVisible ? (
        <JournalItemOptionsComponent
          _changeOptionsModalVisibility={(toVisibility) =>
            _changeOptionsModalVisibility(toVisibility)
          }
          _deleteItem={() => _deleteTrack()}
        />
      ) : null}
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
    paddingVertical: 16,
    paddingStart: 16,
    flex: 1,
  },
  image_backarrow: {
    height: 30,
    width: 30,
    transform: [{rotate: '90deg'}],
  },
});
export default TrackDetailScreen;
