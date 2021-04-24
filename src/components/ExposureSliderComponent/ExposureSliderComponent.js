import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import Slider from '@react-native-community/slider';

import {connect} from 'react-redux';
import ActionSetCameraExposure from 'ActionSetCameraExposure/ActionSetCameraExposure';

const ExposureSliderComponent = (props) => {
  const _setCameraExposure = (newExposure) => {
    props.ActionSetCameraExposure(newExposure);
  };
  return (
    <React.Fragment>
      <Slider
        style={styles.slider_exposure}
        minimumValue={0}
        maximumValue={1}
        value={0.5}
        maximumTrackTintColor={'lightgray'}
        minimumTrackTintColor={'black'}
        thumbTintColor={'transparent'}
        onValueChange={(newExposure) => _setCameraExposure(newExposure)}
      />
    </React.Fragment>
  );
};
const styles = StyleSheet.create({
  slider_exposure: {width: 200, height: 40},
});
const mapStateToProps = (state) => {
  return {};
};

export default connect(mapStateToProps, {ActionSetCameraExposure})(
  ExposureSliderComponent,
);
