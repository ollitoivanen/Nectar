import React from 'react';
import {StyleSheet, View, TouchableOpacity, Text, Image} from 'react-native';

import CurrentTrackComponent from 'CurrentTrackComponent/CurrentTrackComponent';
import OpenSpotifySearchButtonComponent from 'OpenSpotifySearchButtonComponent/OpenSpotifySearchButtonComponent';
import OpenAddNoteButtonComponent from 'OpenAddNoteButtonComponent/OpenAddNoteButtonComponent';
import ShutterButtonComponent from 'ShutterButtonComponent/ShutterButtonComponent';
import ExposureSliderComponent from 'ExposureSliderComponent/ExposureSliderComponent';
import OpenJournalButtonComponent from 'OpenJournalButtonComponent/OpenJournalButtonComponent';
import {connect} from 'react-redux';

const ControlPanelComponent = (props) => {
  const {currentTrack} = props;

  return (
    <View style={styles.view_control_panel}>
      {/*currentTrack !== null ? <CurrentTrackComponent /> : null*/}

      <ExposureSliderComponent />
      <View style={styles.view_horizontal_buttons_container}>
        <OpenSpotifySearchButtonComponent />
        <ShutterButtonComponent />
        <OpenAddNoteButtonComponent />
      </View>
      <OpenJournalButtonComponent />
    </View>
  );
};
const styles = StyleSheet.create({
  view_control_panel: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
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
  return {
    currentTrack: state.ReducerCurrentTrack.currentTrack,
  };
};

export default connect(mapStateToProps, {})(ControlPanelComponent);
