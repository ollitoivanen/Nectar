import React, {useState} from 'react';
import {StyleSheet, View, Image, TouchableOpacity, Text} from 'react-native';
import CameraRoll from '@react-native-community/cameraroll';
import Video from 'react-native-video';

const PhotoLibraryImportConfiramtionScreen = (props) => {
  const {route, navigation} = props;
  const {item} = route.params;
  const {image, type} = item;
  const imageUri = image.uri;

  const [paused, setPaused] = useState(false);

  const _setVideoState = () => {
    setPaused(!paused);
  };

  const _discardImage = () => {
    navigation.goBack();
  };

  const _saveImage = () => {
    CameraRoll.save(imageUri, {album: 'Nectar'}).then(() => {
      _discardImage();
    });
  };

  const _renderItem = () => {
    console.warn(route.params);
    switch (type) {
      case 'image/jpeg':
        return (
          <Image
            resizeMode={'contain'}
            style={styles.image_item_resizing}
            key={imageUri}
            source={{uri: imageUri}}></Image>
        );
        break;
      case 'video/mp4':
        return (
          <View style={styles.view_item_container}>
            <TouchableOpacity onPress={() => _setVideoState()}>
              <Video
                paused={paused}
                disableFocus={true}
                muted={true}
                source={{uri: imageUri}}
                repeat={true}
                resizeMode={'contain'}
                style={{
                  height: '100%',
                }}></Video>
            </TouchableOpacity>
          </View>
        );
      default:
        break;
    }
  };

  return (
    <View style={styles.view_container}>
      {_renderItem()}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: 16,
          width: '100%',
        }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.view_back_button_container}>
          <Image
            style={styles.image_backarrow}
            source={require('Nectar/src/images/image_downarrow.png')}></Image>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => _saveImage()}
          style={styles.view_save_button}>
          <Text numberOfLines={1} style={styles.text_save}>
            Save to journal
          </Text>
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
    justifyContent: 'space-between',
  },

  view_back_button_container: {
    paddingHorizontal: 16,
  },

  view_save_button: {
    borderWidth: 2,
    borderRadius: 50,
    borderColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginStart: 32,
    marginEnd: 16,
  },
  image_item_resizing: {
    height: '100%',
    maxWidth: '95%',
    marginTop: '10%',
    alignSelf: 'center',
    flex: 1,
    width: '100%',
  },

  view_item_container: {
    flex: 1,
    maxWidth: '95%',
    marginTop: '10%',
    alignSelf: 'center',
    height: '100%',
    aspectRatio: 9 / 16,
  },

  image_backarrow: {
    height: 26,
    width: 26,
    transform: [{rotate: '90deg'}],
  },

  text_save: {
    fontSize: 18,
    fontFamily: 'Merriweather-Bold',
    margin: 8,
  },
});
export default PhotoLibraryImportConfiramtionScreen;
