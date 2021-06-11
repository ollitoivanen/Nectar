import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Text,
  Platform,
} from 'react-native';
import CameraRoll from '@react-native-community/cameraroll';
import JournalItemOptionsComponent from 'JournalItemOptionsComponent/JournalItemOptionsComponent';
import FooterDateComponent from 'FooterDateComponent/FooterDateComponent';

const ImageDetailScreen = ({route, navigation}) => {
  const {journalItem} = route.params;
  const {image} = journalItem.node;
  const imageUri = image.uri;
  const [optionsModalVisible, setOptionsModalVisible] = useState(false);

  const _changeOptionsModalVisibility = (toVisibility) => {
    setOptionsModalVisible(toVisibility);
  };
  const _deleteImage = () => {
    CameraRoll.deletePhotos([route.params.journalItem.node.image.uri]).then(
      () => {
        navigation.popToTop();
      },
    );
  };

  return (
    <View style={styles.view_container}>
      <Image
        resizeMode={'contain'}
        style={styles.image_item_resizing}
        source={{uri: imageUri}}></Image>
      <FooterDateComponent journalItem={journalItem} />
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
          _deleteItem={() => _deleteImage()}
        />
      ) : null}
    </View>
  );
};
const styles = StyleSheet.create({
  view_container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'space-between',
  },

  view_item_container: {
    flex: 1,
    maxWidth: '95%',
    marginTop: '10%',
    alignSelf: 'center',
    height: '100%',
  },

  view_back_button_container: {
    paddingVertical: 16,
    paddingStart: 16,
    flex: 1,
  },

  view_journal_button_container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },

  image_item_resizing: {
    height: '100%',
    maxWidth: '95%',
    marginTop: '10%',
    alignSelf: 'center',
    flex: 1,
    width: '100%',
  },
  image_backarrow: {
    height: 30,
    width: 30,
    transform: [{rotate: '90deg'}],
  },
});
export default ImageDetailScreen;
