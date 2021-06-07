import React from 'react';
import {StyleSheet, View, TouchableOpacity, Text, Image} from 'react-native';
import CameraRoll from '@react-native-community/cameraroll';
import RNFS from 'react-native-fs';

import {CAMERA_STATE_VIEW_FINDER, _concatArtists} from 'constants/constants';

import {connect} from 'react-redux';
import ActionSetCameraState from 'ActionSetCameraState/ActionSetCameraState';

const ImageConfirmationScreen = (props) => {
  const {route, navigation} = props;
  const {image} = route.params;
  const imageUri = image.uri;

  const _discardImage = () => {
    RNFS.unlink(imageUri); // Remove image from cache
    props.ActionSetCameraState(CAMERA_STATE_VIEW_FINDER);
    navigation.goBack();
  };

  const _saveImage = () => {
    CameraRoll.save(imageUri, {album: 'Nectar'}).then(() => {
      _discardImage();
    });
  };

  return (
    <View style={styles.view_container}>
      <Image
        style={{
          width: '95%',
          aspectRatio: 3 / 4,
        }}
        key={imageUri}
        source={{uri: imageUri}}></Image>
      <View style={styles.view_savedelete_container}>
        <TouchableOpacity
          style={styles.view_delete_button}
          onPress={() => _discardImage()}>
          <Text style={styles.text_delete}>Discard</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.view_save_button}
          onPress={() => _saveImage()}>
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
    paddingTop: '10%',
  },
  view_image_container: {
    width: '95%',
    marginTop: '10%',
    elevation: 8,
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    paddingBottom: 64,
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
    position: 'absolute',
    bottom: 16,
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
  ImageConfirmationScreen,
);
