import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Text,
  KeyboardAvoidingView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddTextScreen = ({navigation}) => {
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState([]);

  const _saveNote = async () => {
    try {
      const value = await AsyncStorage.getItem('notes');
      let oldNotes;
      if (value !== null) {
        oldNotes = JSON.parse(value);
      } else {
        oldNotes = [];
      }
      try {
        let ts = Math.round(new Date().getTime() / 1000);
        oldNotes.push({node: {timestamp: ts, note: note, type: 'note'}});
        await AsyncStorage.setItem('notes', JSON.stringify(oldNotes)).then(
          () => {
            navigation.goBack();
          },
        );
      } catch (e) {
        // saving error
      }
    } catch (e) {
      // error reading value
    }
  };

  return (
    <KeyboardAvoidingView style={{flex: 1}} behavior={'height'}>
      <View style={styles.view_container}>
        <View style={styles.view_textinput_container}>
          <TextInput
            multiline={true}
            autoFocus={false}
            onChangeText={(newNote) => setNote(newNote)}
            style={styles.textinput}
            placeholder={'Add Text'}
            value={note}
            underlineColorAndroid="transparent"
            spellCheck={false}></TextInput>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 16,
            marginTop: 16,
            width: '100%',
          }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.view_back_button_container}>
            <Image
              style={styles.image_backarrow}
              source={require('Nectar/src/images/image_downarrow.png')}></Image>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => _saveNote()}
            style={styles.view_save_button}>
            <Text style={styles.text_save}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  view_container: {
    flex: 1,
    backgroundColor: 'white',
  },
  view_back_button_container: {
    marginVertical: 16,
    marginStart: 16,
    backgroundColor: 'white',
  },

  view_save_button: {
    borderWidth: 2,
    borderRadius: 50,
    borderColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 16,
  },

  view_header_container: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },

  view_textinput_container: {
    flex: 1,
  },
  image_backarrow: {
    height: 26,
    width: 26,
    transform: [{rotate: '90deg'}],
  },

  textinput: {
    fontSize: 20,
    fontFamily: 'Merriweather-Bold',
    margin: 32,
    fontWeight: 'normal',
  },

  text_save: {
    fontSize: 18,
    fontFamily: 'Merriweather-Bold',
    margin: 8,
  },
});
export default AddTextScreen;
