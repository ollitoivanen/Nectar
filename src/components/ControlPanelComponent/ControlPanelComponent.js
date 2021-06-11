import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';

import ShutterButtonComponent from 'ShutterButtonComponent/ShutterButtonComponent';
import ExposureSliderComponent from 'ExposureSliderComponent/ExposureSliderComponent';
import OpenJournalButtonComponent from 'OpenJournalButtonComponent/OpenJournalButtonComponent';
import SelectActionButtonComponent from 'SelectActionButtonComponent/SelectActionButtonComponent';
import {connect} from 'react-redux';

const ControlPanelComponent = (props) => {
  return (
    <View style={styles.view_control_panel}>
      <ExposureSliderComponent />
      <View style={styles.view_horizontal_buttons_container}>
        <View style={{flex: 1}}></View>
        <ShutterButtonComponent />
        <SelectActionButtonComponent />
      </View>
      <OpenJournalButtonComponent />
    </View>
  );
};
const styles = StyleSheet.create({
  view_control_panel: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'white',
    alignItems: 'center',
  },

  view_horizontal_buttons_container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    marginVertical: 16,
  },
});
const mapStateToProps = (state) => {
  return {};
};

export default connect(mapStateToProps, {})(ControlPanelComponent);
