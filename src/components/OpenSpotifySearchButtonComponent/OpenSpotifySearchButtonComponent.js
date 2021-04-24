import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const OpenSpotifySearchButtonComponent = (props) => {
  const navigation = useNavigation();

  const _openSpotifySearch = () => {
    navigation.navigate('SpotifySearch');
  };

  return (
    <React.Fragment>
      <TouchableOpacity
        onPress={() => _openSpotifySearch()}
        style={styles.touchable_open_spotify_search}>
        <Image
          source={require('Nectar/src/images/image_spotify_icon.png')}
          style={styles.image_spotify_icon}></Image>
      </TouchableOpacity>
    </React.Fragment>
  );
};
const styles = StyleSheet.create({
  touchable_open_spotify_search: {
    backgroundColor: 'white',
    borderRadius: 200,
    borderWidth: 2,
    height: 60,
    width: 60,
    borderColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  image_spotify_icon: {height: 24, width: 24},
});
export default OpenSpotifySearchButtonComponent;
