import React, {useState} from 'react';
import {StyleSheet, View, TouchableOpacity, Text, Image} from 'react-native';
import CameraRoll from '@react-native-community/cameraroll';

const ImageConfirmationScreen = ({route, navigation}) => {
  const {image} = route.params;

  const _discardImage = () => {
    navigation.goBack();
  };

  const _saveImage = () => {
    CameraRoll.save(image.uri, {album: 'Nectar'}).then(() => {
      _discardImage();
    });
  };

  const _checkImageOrientation = () => {
    let aspectRatio = 3 / 4;
    if (image.pictureOrientation == 1 || image.pictureOrientation == 2) {
      aspectRatio = 3 / 4;
    } else if (image.pictureOrientation == 3 || image.pictureOrientation == 4) {
      aspectRatio = 4 / 3;
    }

    return (
      <Image
        style={{
          width: '100%',
          aspectRatio: aspectRatio,
        }}
        key={image.uri}
        source={{uri: image.uri}}></Image>
    );
  };
  return (
    <View style={{flex: 1, backgroundColor: 'white', alignItems: 'center'}}>
      <View style={styles.view_image_container}>
        {_checkImageOrientation()}
      </View>
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
  view_image_container: {
    width: '100%',
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
export default ImageConfirmationScreen;
