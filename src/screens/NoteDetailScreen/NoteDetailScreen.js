import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Text,
  Animated,
  TextInput,
} from 'react-native';
import CameraRoll from '@react-native-community/cameraroll';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NoteDetailScreen = ({route, navigation}) => {
  const [optionsModalHeight, setOptionsModalHeight] = useState(
    new Animated.Value(-300),
  );
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
    let weekdays = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ];
    let months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

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
  const _makeOptionsVisible = (toVisibilty) => {
    if (toVisibilty === true) {
      Animated.timing(optionsModalHeight, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(optionsModalHeight, {
        toValue: -300,
        duration: 500,
        useNativeDriver: false,
      }).start();
    }
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
        <TouchableOpacity onPress={() => _makeOptionsVisible(true)}>
          <Text style={{fontSize: 20, marginHorizontal: 24}}>⋮</Text>
        </TouchableOpacity>
      </View>
      <Animated.View
        style={{
          position: 'absolute',
          bottom: optionsModalHeight,
          width: '100%',
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: 'lightgray',
          paddingTop: 8,
        }}>
        <TouchableOpacity
          onPress={() => _deleteNote()}
          style={styles.view_delete_button}>
          <Text style={styles.text_delete}>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => _makeOptionsVisible(false)}
          style={styles.view_journal_button_container}>
          <Image
            style={styles.image_downarrow}
            source={require('Nectar/src/images/image_downarrow.png')}></Image>
        </TouchableOpacity>
      </Animated.View>
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
