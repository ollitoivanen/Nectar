import React from 'react';
import {StyleSheet, TouchableOpacity, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const OpenJournalButtonComponent = () => {
  const navigation = useNavigation();

  return (
    <React.Fragment>
      <TouchableOpacity
        onPress={() => navigation.navigate('Gallery')}
        style={styles.view_journal_button_container}>
        <Image
          style={styles.image_downarrow}
          source={require('Nectar/src/images/image_downarrow.png')}></Image>
      </TouchableOpacity>
    </React.Fragment>
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
    width: '100%',
    paddingVertical: 16,
  },
});
export default OpenJournalButtonComponent;
