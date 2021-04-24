import React from 'react';
import {StyleSheet, View, Image, Text} from 'react-native';
import {_concatArtists} from 'constants/constants';

const ImageTrackComponent = (props) => {
  const {track} = props;
  const {name, artists} = track;
  return (
    <View style={styles.view_current_track}>
      <Image
        source={require('Nectar/src/images/image_spotify_icon.png')}
        style={styles.image_spotify_icon}></Image>
      <View>
        <Text numberOfLines={1} style={styles.text_track_name}>
          {name}
        </Text>
        <Text numberOfLines={1} style={styles.text_artist_name}>
          {_concatArtists(artists)}
        </Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  view_current_track: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
    maxWidth: '90%',
  },
  text_track_name: {
    marginStart: 8,
    marginEnd: 16,
    fontSize: 14,
    flexShrink: 1,
    fontFamily: 'Merriweather-Bold',
  },

  image_spotify_icon: {height: 18, width: 18, marginStart: 4},

  text_artist_name: {
    marginStart: 8,
    marginEnd: 16,
    fontSize: 10,
    flexShrink: 1,
    color: 'gray',
    fontFamily: 'Merriweather-Bold',
  },
});
export default ImageTrackComponent;
