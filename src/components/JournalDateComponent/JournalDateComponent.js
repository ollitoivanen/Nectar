import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

const JournalDateComponent = (props) => {
  const {journalItem} = props;
  const {date} = journalItem.node;
  return (
    <React.Fragment>
      <View style={styles.view_date_container}>
        <Text style={styles.text_date}>{date}</Text>
      </View>
    </React.Fragment>
  );
};
const styles = StyleSheet.create({
  view_date_container: {
    width: '90%',
    marginVertical: 0,
    justifyContent: 'flex-start',
    alignSelf: 'center',
  },
  text_date: {
    textAlign: 'left',
    fontSize: 0,
    fontFamily: 'Merriweather-Bold',
    color: 'black',
  },
});
export default JournalDateComponent;
