import React from 'react';
import {StyleSheet, View, TouchableOpacity, Image, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const JournalTrackComponent = (props) => {
  const navigation = useNavigation();

  const {journalItem} = props;
  const {track} = journalItem.node;

  const _openTrackDetailScreen = () => {
    navigation.navigate('TrackDetail', {track});
  };
  return (
    <React.Fragment>
      <TouchableOpacity
        activeOpacity={1.0}
        onPress={() => _openTrackDetailScreen()}
        style={styles.touchable_container}>
        <Image
          source={{uri: track.albumImage}}
          style={styles.image_album_cover}></Image>
        <Text numberOfLines={2} style={styles.text_track_name}>
          {track.name}
        </Text>
        <View style={styles.view_row_container}>
          <Image
            source={require('Nectar/src/images/image_spotify_icon.png')}
            style={styles.image_spotify_logo}></Image>
          <Text numberOfLines={1} style={styles.text_artist}>
            {track.artist}
          </Text>
        </View>
        <Text style={styles.text_album}>{track.album}</Text>
      </TouchableOpacity>
    </React.Fragment>
  );
};
const styles = StyleSheet.create({
  touchable_container: {
    flex: 1,
    alignItems: 'center',
    width: '95%',
    alignSelf: 'center',
    marginVertical: 64,
  },
  view_row_container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginStart: -20,
  },
  image_album_cover: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 0,
  },
  text_track_name: {
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 32,
    textAlign: 'center',
  },
  text_artist: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'gray',
    marginStart: 6,
    textAlign: 'center',
    flexShrink: 1,
  },
  text_album: {
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 16,
    textAlign: 'center',
  },
  image_spotify_logo: {height: 24, width: 24},
});
export default JournalTrackComponent;
