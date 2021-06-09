import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';

import CameraViewFinderComponent from 'CameraViewFinderComponent/CameraViewFinderComponent';
import ControlPanelComponent from 'ControlPanelComponent/ControlPanelComponent';

const CameraScreen = () => {
  return (
    <View style={styles.view_container}>
      <CameraViewFinderComponent />
      <ControlPanelComponent />
    </View>
  );
};

const styles = StyleSheet.create({
  view_container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});

const mapStateToProps = (state) => {
  return {};
};

export default connect(mapStateToProps, {})(CameraScreen);
