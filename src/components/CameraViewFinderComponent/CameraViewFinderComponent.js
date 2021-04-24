import React, {useState, useRef, useEffect} from 'react';
import {StyleSheet, Dimensions, View} from 'react-native';
import {RNCamera} from 'react-native-camera';

import {
  CAMERA_STATE_VIEW_FINDER,
  CAMERA_STATE_TAKING_VIDEO,
  CAMERA_STATE_VIDEO_TAKEN,
  CAMERA_STATE_IMAGE_TAKEN,
  androidCameraPermissionOptions,
  androidRecordAudioPermissionOptions,
} from 'constants/constants';

import CameraFocusMarkerComponent from 'CameraFocusMarkerComponent/CameraFocusMarkerComponent';
import CameraSwitchButtonComponent from 'CameraSwitchButtonComponent/CameraSwitchButtonComponent';
import CurrentTrackComponent from 'CurrentTrackComponent/CurrentTrackComponent';
import {useNavigation} from '@react-navigation/native';

import ActionSetFocusMarkerLocation from 'ActionSetFocusMarkerLocation/ActionSetFocusMarkerLocation';
import {connect} from 'react-redux';

const CameraViewFinderComponent = (props) => {
  const navigation = useNavigation();
  const {exposure, cameraState, cameraType, currentTrack} = props;
  const cameraRef = useRef('camera');
  const [poi, setPoi] = useState({x: 0.5, y: 0.5, autoExposure: true});
  const {height, width} = Dimensions.get('screen');

  //called only after cameraState changes
  useEffect(() => {
    _checkCameraState();
  }, [cameraState]);

  const _focusAtLocation = (event) => {
    const focusLocation = {x: event.x, y: event.y};
    props.ActionSetFocusMarkerLocation(focusLocation);
    setPoi({
      x: event.x / width,
      y: event.y / height,
      autoExposure: true,
    });
  };

  const _checkCameraState = () => {
    switch (cameraState) {
      case CAMERA_STATE_IMAGE_TAKEN:
        _takePicture();
        break;
      case CAMERA_STATE_TAKING_VIDEO:
        _takeVideo();
        break;
      case CAMERA_STATE_VIDEO_TAKEN:
        _stopVideo();
        break;
      case CAMERA_STATE_VIEW_FINDER:
        return;
      default:
        break;
    }
  };

  const _takePicture = async () => {
    await cameraRef.current
      .takePictureAsync({orientation: 'portrait'})
      .then((image) => {
        navigation.navigate('ImageConfirmation', {image, track: currentTrack});
      });
  };

  const _takeVideo = async () => {
    await cameraRef.current
      .recordAsync({quality: RNCamera.Constants.VideoQuality['1080p']})
      .then(async (video) => {
        navigation.navigate('VideoConfirmation', {video});
      });
  };

  const _stopVideo = () => {
    cameraRef.current.stopRecording();
  };

  return (
    <View style={styles.view_container}>
      <RNCamera
        ratio={'4:3'}
        onTap={(event) => _focusAtLocation(event)}
        useNativeZoom={true}
        captureAudio={true}
        autoFocus={RNCamera.Constants.AutoFocus.on}
        style={styles.camera_view_finder}
        type={cameraType}
        exposure={exposure}
        autoFocusPointOfInterest={poi}
        ref={cameraRef}
        androidCameraPermissionOptions={androidCameraPermissionOptions}
        androidRecordAudioPermissionOptions={
          androidRecordAudioPermissionOptions
        }>
        <CameraFocusMarkerComponent />
        <CameraSwitchButtonComponent />
      </RNCamera>
      {currentTrack == null ? null : <CurrentTrackComponent />}
    </View>
  );
};
const styles = StyleSheet.create({
  view_container: {
    width: '95%',
    marginTop: '10%',
    elevation: 8,
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    paddingBottom: 0,
  },
  camera_view_finder: {
    width: '100%',
    aspectRatio: 3 / 4,
  },
});

const mapStateToProps = (state) => {
  return {
    exposure: state.ReducerCameraExposure.exposure,
    cameraState: state.ReducerCameraState.cameraState,
    cameraType: state.ReducerCameraType.cameraType,
    currentTrack: state.ReducerCurrentTrack.currentTrack,
  };
};
export default connect(mapStateToProps, {ActionSetFocusMarkerLocation})(
  CameraViewFinderComponent,
);
