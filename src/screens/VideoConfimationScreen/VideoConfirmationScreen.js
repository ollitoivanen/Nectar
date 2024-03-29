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
  const videoUri = video.uri;

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
    <View style={styles.view_container}>
      <View style={styles.view_item_container}>
        <TouchableOpacity onPress={() => _setVideoState()}>
          <Video
            paused={paused}
            disableFocus={true}
            source={{uri: video.uri}}
            repeat={true}
            resizeMode={'contain'}
            style={{
              height: '100%',
            }}></Video>
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
  );
};
const styles = StyleSheet.create({
  view_container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },

  view_item_container: {
    flex: 1,
    maxWidth: '95%',
    marginTop: '10%',
    alignSelf: 'center',
    height: '100%',
    aspectRatio: 9 / 16,
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
    marginVertical: 16,
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
