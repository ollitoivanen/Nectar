import React from 'react';
import {StyleSheet, TouchableOpacity, Image} from 'react-native';
import {RNCamera} from 'react-native-camera';

import {connect} from 'react-redux';
import ActionSetCameraType from 'ActionSetCameraType/ActionSetCameraType';

const CameraSwitchButtonComponent = (props) => {
  const {cameraType} = props;

  const _changeCameraType = () => {
    cameraType == RNCamera.Constants.Type.back
      ? props.ActionSetCameraType(RNCamera.Constants.Type.front)
      : props.ActionSetCameraType(RNCamera.Constants.Type.back);
  };

  return (
    <React.Fragment>
      <TouchableOpacity
        onPress={() => _changeCameraType()}
        style={styles.touchable_camera_switch}>
        <Image
          source={require('Nectar/src/images/image_switch_camera_icon.png')}
          style={styles.image_switch_icon}></Image>
      </TouchableOpacity>
    </React.Fragment>
  );
};
const styles = StyleSheet.create({
  touchable_camera_switch: {position: 'absolute', top: 0, right: 0},
  image_switch_icon: {height: 22, width: 22, margin: 16},
});

const mapStateToProps = (state) => {
  return {
    cameraType: state.ReducerCameraType.cameraType,
  };
};
export default connect(mapStateToProps, {ActionSetCameraType})(
  CameraSwitchButtonComponent,
);
