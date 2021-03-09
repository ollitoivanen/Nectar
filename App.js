import 'react-native-gesture-handler';
import React from 'react';
import {StyleSheet, SafeAreaView, StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import HomeScreen from 'HomeScreen/HomeScreen';
import CameraScreen from 'CameraScreen/CameraScreen';
import ImageDetailScreen from 'ImageDetailScreen/ImageDetailScreen';
import GalleryScreen from 'GalleryScreen/GalleryScreen';
import AddTextScreen from 'AddTextScreen/AddTextScreen';
import NoteDetailScreen from 'NoteDetailScreen/NoteDetailScreen';
import SpotifySearchScreen from 'SpotifySearchScreen/SpotifySearchScreen';
import SongConfirmationScreen from 'SongConfirmationScreen/SongConfirmationScreen';
import SongDetailScreen from 'SongDetailScreen/SongDetailScreen';
import ImageConfirmationScreen from 'ImageConfirmationScreen/ImageConfirmationScreen';
import VideoConfirmationScreen from 'VideoConfirmationScreen/VideoConfirmationScreen';
import VideoDetailScreen from 'VideoDetailScreen/VideoDetailScreen';

const App = () => {
  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle={'dark-content'}
          backgroundColor={'white'}
          hidden={false}
        />
        <Stack.Navigator
          mode={'modal'}
          screenOptions={{
            headerShown: false,
            gestureDirection: 'horizontal',
          }}>
          <Stack.Screen
            initialParams={{track: null}}
            name="Camera"
            component={CameraScreen}></Stack.Screen>

          <Stack.Screen
            name="ImageConfirmation"
            component={ImageConfirmationScreen}></Stack.Screen>

          <Stack.Screen
            name="VideoConfirmation"
            component={VideoConfirmationScreen}></Stack.Screen>

          <Stack.Screen
            name="SpotifySearch"
            component={SpotifySearchScreen}></Stack.Screen>
          <Stack.Screen
            name="SongConfirmation"
            component={SongConfirmationScreen}></Stack.Screen>

          <Stack.Screen
            name="SongDetail"
            component={SongDetailScreen}></Stack.Screen>

          <Stack.Screen name="Home" component={HomeScreen}></Stack.Screen>

          <Stack.Screen name="Gallery" component={GalleryScreen}></Stack.Screen>
          <Stack.Screen name="AddText" component={AddTextScreen}></Stack.Screen>

          <Stack.Screen
            name="ImageDetail"
            component={ImageDetailScreen}></Stack.Screen>
          <Stack.Screen
            name="NoteDetail"
            component={NoteDetailScreen}></Stack.Screen>
          <Stack.Screen
            name="VideoDetail"
            component={VideoDetailScreen}></Stack.Screen>
        </Stack.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
export default App;
