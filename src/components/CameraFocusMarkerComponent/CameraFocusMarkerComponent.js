import React, {useState, useEffect} from 'react';
import {StyleSheet, Animated} from 'react-native';

import {connect} from 'react-redux';

const CameraFocusMarkerComponent = (props) => {
  const [focusMarkerOpacity] = useState(new Animated.Value(0));
  const {focusMarkerLocation} = props;

  useEffect(() => {
    const {x, y} = focusMarkerLocation;
    if ((x && y) == null) return;
    _showFocusMarker();
  }, [focusMarkerLocation]);

  const _showFocusMarker = () => {
    _fadeMarkerIn();
    _fadeMarkerOut();
  };

  const _fadeMarkerIn = () => {
    Animated.timing(focusMarkerOpacity, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const _fadeMarkerOut = () => {
    setTimeout(() => {
      Animated.timing(focusMarkerOpacity, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }, 500);
  };

  return (
    <React.Fragment>
      <Animated.View
        style={[
          styles.view_focus_point,
          {
            //to center circle
            left: focusMarkerLocation.x - 25,
            top: focusMarkerLocation.y - 25,
            opacity: focusMarkerOpacity,
          },
        ]}
      />
    </React.Fragment>
  );
};
const styles = StyleSheet.create({
  view_focus_point: {
    height: 50,
    width: 50,
    borderRadius: 25,
    borderColor: 'white',
    borderWidth: 5,
    backgroundColor: 'transparent',
    position: 'absolute',
  },
});
const mapStateToProps = (state) => {
  return {
    focusMarkerLocation: state.ReducerFocusMarkerLocation.focusMarkerLocation,
  };
};
export default connect(mapStateToProps, {})(CameraFocusMarkerComponent);
