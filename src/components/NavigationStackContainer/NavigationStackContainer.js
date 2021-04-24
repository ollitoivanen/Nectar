import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import 'react-native-gesture-handler';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import CameraScreen from 'CameraScreen/CameraScreen';
import ImageDetailScreen from 'ImageDetailScreen/ImageDetailScreen';
import GalleryScreen from 'GalleryScreen/GalleryScreen';
import AddNoteScreen from 'AddNoteScreen/AddNoteScreen';
import NoteDetailScreen from 'NoteDetailScreen/NoteDetailScreen';
import SpotifySearchScreen from 'SpotifySearchScreen/SpotifySearchScreen';
import TrackConfirmationScreen from 'TrackConfirmationScreen/TrackConfirmationScreen';
import TrackDetailScreen from 'TrackDetailScreen/TrackDetailScreen';
import ImageConfirmationScreen from 'ImageConfirmationScreen/ImageConfirmationScreen';
import VideoConfirmationScreen from 'VideoConfirmationScreen/VideoConfirmationScreen';
import VideoDetailScreen from 'VideoDetailScreen/VideoDetailScreen';

const NavigationStackContainer = () => {
  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle={'dark-content'}
          backgroundColor={'white'}
          hidden={true}
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
            options={{animationEnabled: false}}
            name="ImageConfirmation"
            component={ImageConfirmationScreen}></Stack.Screen>

          <Stack.Screen
            name="VideoConfirmation"
            component={VideoConfirmationScreen}></Stack.Screen>

          <Stack.Screen
            name="SpotifySearch"
            component={SpotifySearchScreen}></Stack.Screen>
          <Stack.Screen
            name="TrackConfirmation"
            component={TrackConfirmationScreen}></Stack.Screen>

          <Stack.Screen
            name="TrackDetail"
            component={TrackDetailScreen}></Stack.Screen>

          <Stack.Screen name="Gallery" component={GalleryScreen}></Stack.Screen>
          <Stack.Screen name="AddNote" component={AddNoteScreen}></Stack.Screen>

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
export default NavigationStackContainer;
