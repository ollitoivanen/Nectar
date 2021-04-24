import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Animated,
  Dimensions,
} from 'react-native';
import CameraRoll from '@react-native-community/cameraroll';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {CAMERA_STATE_VIEW_FINDER, _concatArtists} from 'constants/constants';
import PrintedImageComponent from 'PrintedImageComponent/PrintedImageComponent';

import {connect} from 'react-redux';
import ActionSetCameraState from 'ActionSetCameraState/ActionSetCameraState';

const ImageConfirmationScreen = (props) => {
  const {height} = Dimensions.get('screen');
  const [imageContainerPosition] = useState(new Animated.Value(height));

  const {route, navigation} = props;
  const {image, track} = route.params;
  const imageUri = image.uri;
  const {name, uri, artists} = track;

  useEffect(() => {
    _slideImageConatainerIn();
  }, []);

  const _slideImageConatainerIn = () => {
    Animated.timing(imageContainerPosition, {
      toValue: 0,
      duration: 750,
      useNativeDriver: false,
    }).start();
  };

  const _discardImage = () => {
    props.ActionSetCameraState(CAMERA_STATE_VIEW_FINDER);
    navigation.goBack();
  };

  const _saveImage = () => {
    CameraRoll.save(imageUri, {album: 'Nectar'}).then(async () => {
      await _saveImageTrack();
    });
  };

  const _saveImageTrack = async () => {
    let oldImageTracks = [];
    try {
      const value = await AsyncStorage.getItem('imageTracks');
      if (value != null) {
        oldImageTracks = JSON.parse(value);
      }
      await _saveUpdatedImageTracks(oldImageTracks);
    } catch (error) {}
  };

  _saveUpdatedImageTracks = async (oldImageTracks) => {
    try {
      let ts = Math.round(new Date().getTime() / 1000);
      oldImageTracks.push({
        node: {
          timestamp: ts,
          track: {
            uri,
            name,
            artists: _concatArtists(artists),
          },
          type: 'imageTrack',
        },
      });
      await AsyncStorage.setItem('imageTracks', JSON.stringify(oldImageTracks));
    } catch (e) {}
  };

  return (
    <View style={styles.view_container}>
      <Animated.View
        style={{
          transform: [
            {
              translateY: imageContainerPosition,
            },
          ],
        }}>
        <PrintedImageComponent imageUri={imageUri} track={track} />
      </Animated.View>
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
