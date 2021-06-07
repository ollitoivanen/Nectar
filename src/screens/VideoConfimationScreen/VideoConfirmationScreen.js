import React, {useState} from 'react';
import {StyleSheet, View, TouchableOpacity, Text, Image} from 'react-native';
import Video from 'react-native-video';
import CameraRoll from '@react-native-community/cameraroll';
import RNFS from 'react-native-fs';

import {CAMERA_STATE_VIEW_FINDER} from 'constants/constants';

import {connect} from 'react-redux';
import ActionSetCameraState from 'ActionSetCameraState/ActionSetCameraState';

const VideoConfirmationScreen = (props) => {
  const {route, navigation} = props;
  const [paused, setPaused] = useState(false);
  const {video} = route.params;

  const _setVideoState = () => {
    setPaused(!paused);
  };

  const _discardVideo = () => {
    RNFS.unlink(video.uri); // Remove video from cache
    props.ActionSetCameraState(CAMERA_STATE_VIEW_FINDER);
    navigation.goBack();
  };

  const _saveVideo = async () => {
    CameraRoll.save(video.uri, {type: 'photo', album: 'Nectar'}).then(() => {
      _discardVideo();
    });
  };
  return (
    <View style={{flex: 1, backgroundColor: 'white', alignItems: 'center'}}>
      <View style={styles.view_image_container}>
        <Video
          paused={paused}
          disableFocus={true}
          source={{uri: video.uri}}
          repeat={true}
          style={{width: '100%', aspectRatio: 9 / 16}}></Video>
      </View>
      <View
        style={{
          position: 'absolute',
          bottom: 16,
          width: '100%',
          alignItems: 'center',
        }}>
        <View
          style={{
            alignSelf: 'center',
            borderWidth: 1.5,
            borderColor: '#f0f0f0',
            borderRadius: 100,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
            marginVertical: 8,
            maxWidth: '90%',
          }}>
          <TouchableOpacity
            onPress={() => {
              _setVideoState();
            }}>
            <Image
              source={
                paused == false
                  ? require('Nectar/src/images/image_pause_icon.png')
                  : require('Nectar/src/images/image_play_icon.png')
              }
              style={{
                height: 42,
                width: 42,
                opacity: 0.6,
                marginStart: 0,
              }}></Image>
          </TouchableOpacity>
        </View>

        <View style={styles.view_savedelete_container}>
          <TouchableOpacity
            style={styles.view_delete_button}
            onPress={() => _discardVideo()}>
            <Text style={styles.text_delete}>Discard</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.view_save_button}
            onPress={() => _saveVideo()}>
            <Text style={styles.text_save}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  view_image_container: {
    width: '95%',
    paddingTop: '10%',
  },
  view_delete_button: {
    backgroundColor: 'white',
    flex: 1,
    marginHorizontal: 16,
    marginTop: 16,
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  view_save_button: {
    backgroundColor: 'black',
    flex: 1,
    marginHorizontal: 16,
    marginTop: 16,
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },

  view_savedelete_container: {
    width: '100%',
    flexDirection: 'row',
  },

  text_save: {
    margin: 8,
    fontWeight: 'bold',
    color: 'white',
    fontSize: 16,
  },
  text_delete: {
    margin: 8,
    fontWeight: 'bold',
    color: 'black',
    fontSize: 16,
  },
});
const mapStateToProps = (state) => {
  return {};
};

export default connect(mapStateToProps, {ActionSetCameraState})(
  VideoConfirmationScreen,
);
