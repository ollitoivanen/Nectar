import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Text,
  Modal,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const ActionSelectionModalComponent = (props) => {
  const navigation = useNavigation();

  const {actionSelectionModalVisible, _onDismissPress, _onActionSelect} = props;

  const _navigateToAddNoteScreen = () => {
    navigation.navigate('AddNote');
    _onActionSelect();
  };
  const _navigateToSpotifySearchScreen = () => {
    navigation.navigate('SpotifySearch');
    _onActionSelect();
  };
  const _navigateToPhotoLibraryScreen = () => {
    _onActionSelect();
    navigation.navigate('PhotoLibrary');
  };
  return (
    <Modal
      animationType={'fade'}
      transparent={true}
      visible={actionSelectionModalVisible}>
      <TouchableOpacity
        activeOpacity={1.0}
        style={styles.touchable_modal_dismiss_area}
        onPress={_onDismissPress}>
        <View style={styles.view_container}>
          <TouchableOpacity
            style={styles.touchable_action_container}
            onPress={() => _navigateToAddNoteScreen()}>
            <View style={styles.view_action_icon}>
              <Text style={styles.text_action_icon}>Tt</Text>
            </View>
            <Text style={styles.text_action_name}>Add a note</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.touchable_action_container}
            onPress={() => _navigateToSpotifySearchScreen()}>
            <View style={styles.view_action_icon}>
              <Image
                style={styles.image_action_icon}
                source={require('Nectar/src/images/image_spotify_icon.png')}
              />
            </View>
            <Text style={styles.text_action_name}>Choose a song</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.touchable_action_container}
            onPress={() => _navigateToAddNoteScreen()}>
            <View style={styles.view_action_icon}>
              <Image
                style={styles.image_action_icon}
                source={require('Nectar/src/images/image_photo_library_icon.png')}
              />
            </View>
            <Text style={styles.text_action_name}>Import from gallery</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};
const styles = StyleSheet.create({
  view_container: {
    borderRadius: 10,
    backgroundColor: 'white',
    position: 'absolute',
    flex: 1,
    padding: 8,
  },
  view_action_icon: {
    backgroundColor: 'white',
    borderRadius: 200,
    borderWidth: 2,
    height: 50,
    width: 50,
    borderColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },

  touchable_action_container: {
    flexDirection: 'row',
    margin: 8,
  },

  touchable_modal_dismiss_area: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#00000080',
    alignItems: 'center',
  },

  text_action_icon: {
    fontSize: 18,
    color: 'black',
    fontFamily: 'Merriweather-Bold',
    alignSelf: 'center',
    marginBottom: 4,
  },
  text_action_name: {
    fontSize: 16,
    color: 'black',
    fontFamily: 'Merriweather-Bold',
    alignSelf: 'center',
    marginHorizontal: 8,
  },

  image_action_icon: {
    height: 24,
    width: 24,
  },
});
export default ActionSelectionModalComponent;
