import React, {useState} from 'react';
import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';

const ModeSelectorOpenButton = (props) => {
  return (
    <View style={styles.view_mode_selector_open_button_container}>
      <TouchableOpacity
        onPress={() => props.onModeSelectorOpenButtonPress()}
        style={styles.touchable_mode_selector_button}>
        <Text style={styles.text_plus_sign}>+</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  view_mode_selector_open_button_container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  touchable_mode_selector_button: {
    backgroundColor: 'white',
    borderRadius: 200,
    borderWidth: 2,
    height: 60,
    width: 60,
    borderColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text_plus_sign: {
    fontSize: 32,
    color: 'black',
    fontFamily: 'Merriweather-Regular',
    alignSelf: 'center',
    marginBottom: 4,
  },
});
export default ModeSelectorOpenButton;
