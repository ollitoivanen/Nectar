import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity, Text, View} from 'react-native';
import ActionSelectionModalComponent from 'ActionSelectionModalComponent/ActionSelectionModalComponent';

const SelectActionButtonComponent = (props) => {
  const [modalVisible, setModalVisible] = useState(false);

  const _changeActionSelectionModalVisibility = (toVisibility) => {
    setModalVisible(toVisibility);
  };

  return (
    <View style={{flex: 1, justifyContent: 'center'}}>
      <TouchableOpacity
        onPress={() => _changeActionSelectionModalVisibility(true)}
        style={styles.touchable_open_action_selection}>
        <Text style={styles.text_plus_sign}>+</Text>
      </TouchableOpacity>
      <ActionSelectionModalComponent
        actionSelectionModalVisible={modalVisible}
        _onDismissPress={() => _changeActionSelectionModalVisibility(false)}
        _onActionSelect={() => _changeActionSelectionModalVisibility(false)}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  touchable_open_action_selection: {
    backgroundColor: 'white',
    borderRadius: 200,
    borderWidth: 2,
    height: 60,
    width: 60,
    borderColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },

  text_plus_sign: {
    fontSize: 28,
    color: 'black',
    fontFamily: 'Merriweather-Bold',
    alignSelf: 'center',
    marginBottom: 4,
  },
});
export default SelectActionButtonComponent;
