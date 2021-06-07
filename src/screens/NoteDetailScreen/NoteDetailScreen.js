import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Text,
  TextInput,
} from 'react-native';
import {weekdays, months} from 'constants/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import JournalItemOptionsComponent from 'JournalItemOptionsComponent/JournalItemOptionsComponent';

const NoteDetailScreen = ({route, navigation}) => {
  const [optionsModalVisible, setOptionsModalVisible] = useState(false);

  const _changeOptionsModalVisibility = (toVisibility) => {
    setOptionsModalVisible(toVisibility);
  };
  const originalNote = route.params.journalItem.node.note;
  const [note, setNote] = useState(originalNote);
  const _deleteNote = async () => {
    const value = await AsyncStorage.getItem('notes');
    let notesArray = JSON.parse(value);
    let deletableNoteIndex = notesArray.findIndex(
      (journalItem) =>
        route.params.journalItem.node.note === journalItem.node.note,
    );
    notesArray.splice(deletableNoteIndex, 1);
    await AsyncStorage.setItem('notes', JSON.stringify(notesArray)).then(() => {
      navigation.goBack();
    });
  };
  const _saveNote = async () => {
    const value = await AsyncStorage.getItem('notes');
    let notesArray = JSON.parse(value);
    let editableNoteIndex = notesArray.findIndex(
      (journalItem) =>
        route.params.journalItem.node.timestamp === journalItem.node.timestamp,
    );

    notesArray.splice(editableNoteIndex, 1, {
      node: {
        timestamp: route.params.journalItem.node.timestamp,
        note: note,
        type: 'note',
      },
    });
    await AsyncStorage.setItem('notes', JSON.stringify(notesArray)).then(() => {
      navigation.goBack();
    });
  };
  const _formatTime = () => {
    let unix_timestamp = route.params.journalItem.node.timestamp;

    let date = new Date(unix_timestamp * 1000);

    let dayOfTheWeek = weekdays[date.getDay()];
    let dayOfTheMonth = date.getDate();
    let month = months[date.getMonth()];
    let year = date.getFullYear();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    if (minutes < 10) {
      minutes = '0' + minutes;
    }

    let formattedTime =
      dayOfTheWeek +
      ' ' +
      dayOfTheMonth +
      ' ' +
      month +
      ' ' +
      year +
      ', ' +
      hours +
      ':' +
      minutes;

    return formattedTime;
  };

  return (
    <View style={styles.container}>
      <View style={{flex: 1, width: '95%', justifyContent: 'center'}}>
        <TextInput
          autoFocus={false}
          multiline={true}
          onChangeText={(newNote) => setNote(newNote)}
          style={styles.text_note}
          value={note}></TextInput>

        <Text
          style={{
            fontFamily: 'Merriweather-Light',
            color: 'gray',
            marginStart: 8,
            marginTop: 8,
          }}>
          {_formatTime()}
        </Text>
        {note !== originalNote ? (
          <TouchableOpacity
            onPress={() => _saveNote()}
            style={styles.view_save_button}>
            <Text style={styles.text_save}>Save</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
        }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.view_back_button_container}>
          <Image
            style={styles.image_backarrow}
            source={require('Nectar/src/images/image_downarrow.png')}></Image>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => _changeOptionsModalVisibility(true)}>
          <Text style={{fontSize: 20, marginHorizontal: 24}}>⋮</Text>
        </TouchableOpacity>
      </View>
      {optionsModalVisible ? (
        <JournalItemOptionsComponent
          _changeOptionsModalVisibility={(toVisibility) =>
            _changeOptionsModalVisibility(toVisibility)
          }
          _deleteItem={() => _deleteNote()}
        />
      ) : null}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },

  text_delete: {
    fontSize: 18,
    fontFamily: 'Merriweather-Bold',
    margin: 8,
  },
  text_save: {
    fontSize: 18,
    fontFamily: 'Merriweather-Bold',
    margin: 8,
  },
  text_note: {
    textAlign: 'left',
    fontSize: 20,
    fontFamily: 'Merriweather-Regular',
  },
  view_back_button_container: {
    marginVertical: 16,
    marginStart: 16,
    backgroundColor: 'white',
    flex: 1,
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
  view_save_button: {
    borderWidth: 2,
    borderRadius: 50,
    borderColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 16,
  },
  image_backarrow: {
    height: 26,
    width: 26,
    transform: [{rotate: '90deg'}],
  },
  image_downarrow: {
    height: 26,
    width: 26,
  },
});
export default NoteDetailScreen;
