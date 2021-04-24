import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {
  CAMERA_STATE_VIEW_FINDER,
  CAMERA_STATE_TAKING_VIDEO,
  CAMERA_STATE_VIDEO_TAKEN,
  CAMERA_STATE_IMAGE_TAKEN,
} from 'constants/constants';

import {connect} from 'react-redux';
import ActionSetCameraState from 'ActionSetCameraState/ActionSetCameraState';
const ShutterButtonComponent = (props) => {
  const {cameraState} = props;

  const _setTakingVideo = () => {
    props.ActionSetCameraState(CAMERA_STATE_TAKING_VIDEO);
  };

  const _stopTakingVideo = () => {
    props.ActionSetCameraState(CAMERA_STATE_VIDEO_TAKEN);
  };

  const _takeImage = () => {
    props.ActionSetCameraState(CAMERA_STATE_IMAGE_TAKEN);
  };

  const _checkCameraState = () => {
    switch (cameraState) {
      case CAMERA_STATE_TAKING_VIDEO:
        _stopTakingVideo();
        break;
      case CAMERA_STATE_VIEW_FINDER:
        _takeImage();
        break;
      default:
        break;
    }
  };

  return (
    <React.Fragment>
      <TouchableOpacity
        pressRetentionOffset={100}
        activeOpacity={0.5}
        onLongPress={() => _setTakingVideo()}
        onPressOut={() => _checkCameraState()}
        style={[
          styles.view_shutter,
          cameraState === CAMERA_STATE_TAKING_VIDEO
            ? {borderColor: '#ff3d58', backgroundColor: '#ffd9de'}
            : {borderColor: 'black', backgroundColor: '#f2f2f2'},
        ]}></TouchableOpacity>
    </React.Fragment>
  );
};
const styles = StyleSheet.create({
  view_shutter: {
    height: 75,
    aspectRatio: 1,
    borderRadius: 50,
    borderWidth: 3,
  },
});
const mapStateToProps = (state) => {
  return {
    cameraState: state.ReducerCameraState.cameraState,
  };
};

export default connect(mapStateToProps, {ActionSetCameraState})(
  ShutterButtonComponent,
);
