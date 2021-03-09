import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
  NativeModules,
} from 'react-native';
const {SpotifyModule} = NativeModules;

const HomeScreen = ({navigation}) => {
  // Initialize the library and connect the Remote
  // then play an epic song
  async function playEpicSong() {
    SpotifyModule.authenticate();
  }
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => playEpicSong()}></TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },

  button: {
    height: 200,
    width: 200,
    backgroundColor: 'blue',
  },
});
export default HomeScreen;
