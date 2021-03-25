import 'react-native-gesture-handler';
import React from 'react';
import {StyleSheet, SafeAreaView, StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import CameraScreen from 'CameraScreen/CameraScreen';
import ImageDetailScreen from 'ImageDetailScreen/ImageDetailScreen';
import GalleryScreen from 'GalleryScreen/GalleryScreen';
import AddNoteScreen from 'AddNoteScreen/AddNoteScreen';
import NoteDetailScreen from 'NoteDetailScreen/NoteDetailScreen';
import SpotifySearchScreen from 'SpotifySearchScreen/SpotifySearchScreen';
import SongConfirmationScreen from 'SongConfirmationScreen/SongConfirmationScreen';
import SongDetailScreen from 'SongDetailScreen/SongDetailScreen';
import ImageConfirmationScreen from 'ImageConfirmationScreen/ImageConfirmationScreen';
import VideoConfirmationScreen from 'VideoConfirmationScreen/VideoConfirmationScreen';
import VideoDetailScreen from 'VideoDetailScreen/VideoDetailScreen';

import {Provider} from 'react-redux';
import store from 'store/store';

const App = () => {
  const Stack = createStackNavigator();

  return (
    <Provider store={store}>
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

            <Stack.Screen
              name="Gallery"
              component={GalleryScreen}></Stack.Screen>
            <Stack.Screen
              name="AddText"
              component={AddNoteScreen}></Stack.Screen>

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
    </Provider>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
export default App;
