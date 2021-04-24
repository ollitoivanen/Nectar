import React from 'react';
import {StyleSheet, TouchableOpacity, Text} from 'react-native';
import FooterDateComponent from 'FooterDateComponent/FooterDateComponent';
import {useNavigation} from '@react-navigation/native';

const JournalNoteComponent = (props) => {
  const navigation = useNavigation();

  const {journalItem} = props;
  const {note} = journalItem.node;

  const _openNoteDetailScreen = () => {
    navigation.navigate('NoteDetail', {
      journalItem,
    });
  };
  return (
    <React.Fragment>
      <TouchableOpacity
        style={styles.view_note_container}
        onPress={() => _openNoteDetailScreen()}>
        <Text style={styles.text_note}>{note}</Text>
        <FooterDateComponent journalItem={journalItem} />
      </TouchableOpacity>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  view_note_container: {
    width: '85%',
    marginVertical: 64,
    justifyContent: 'flex-start',
    alignSelf: 'center',
    borderColor: '#f0f0f0',
    borderRadius: 10,
  },

  text_note: {
    textAlign: 'left',
    fontSize: 18,
    fontFamily: 'Merriweather-Regular',
  },
});
export default JournalNoteComponent;
