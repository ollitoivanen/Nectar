import React from 'react';
import {StyleSheet, TouchableOpacity, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const OpenAddNoteButtonComponent = () => {
  const navigation = useNavigation();

  const _openAddNoteScreen = () => {
    navigation.navigate('AddNote');
  };

  return (
    <React.Fragment>
      <TouchableOpacity
        onPress={() => _openAddNoteScreen()}
        style={styles.touchable_open_add_note}>
        <Text style={styles.text_plus_sign}>Tt</Text>
      </TouchableOpacity>
    </React.Fragment>
  );
};
const styles = StyleSheet.create({
  touchable_open_add_note: {
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
    fontSize: 20,
    color: 'black',
    fontFamily: 'Merriweather-Bold',
    alignSelf: 'center',
    marginBottom: 4,
  },
});
export default OpenAddNoteButtonComponent;
