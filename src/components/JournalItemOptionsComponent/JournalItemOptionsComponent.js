import React from 'react';
import {StyleSheet, TouchableOpacity, View, Text, Image} from 'react-native';

const JournalItemOptionsComponent = (props) => {
  const {_changeOptionsModalVisibility, _deleteItem} = props;

  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: 'lightgray',
        paddingTop: 8,
      }}>
      <TouchableOpacity
        onPress={() => _deleteItem()}
        style={styles.view_delete_button}>
        <Text style={styles.text_delete}>Delete</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => _changeOptionsModalVisibility(false)}
        style={styles.view_journal_button_container}>
        <Image
          style={styles.image_downarrow}
          source={require('Nectar/src/images/image_downarrow.png')}></Image>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  image_downarrow: {
    height: 26,
    width: 26,
  },
  view_journal_button_container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  view_delete_button: {
    borderWidth: 2,
    borderRadius: 50,
    borderColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  text_delete: {
    fontSize: 18,
    fontFamily: 'Merriweather-Bold',
    margin: 8,
  },
});
export default JournalItemOptionsComponent;
