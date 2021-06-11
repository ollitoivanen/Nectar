import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import CameraRoll from '@react-native-community/cameraroll';

const PhotoLibraryScreen = ({navigation}) => {
  const [imagesArray, setImagesArray] = useState([]);

  useEffect(() => {
    const _loadData = async () => {
      await _getDeviceImages();
    };

    _loadData();
  }, []);

  const _getDeviceImages = async () => {
    await CameraRoll.getPhotos({
      first: 10000,
      groupTypes: 'Album',
      groupName: 'Camera',
      include: ['imageSize', 'orientation'],
    }).then(async (r) => {
      if (r?.edges == null) return [];
      imArray = r.edges;
      setImagesArray(imArray);
    });
  };
  const _renderItem = ({item}) => {
    const {image} = item.node;
    const imageUri = image.uri;

    return (
      <TouchableOpacity
        style={styles.touchable_item}
        onPress={() => _openPhotoLibraryImportConfiramtionScreen(item.node)}>
        <Image source={{uri: imageUri}} style={styles.image_item} />
      </TouchableOpacity>
    );
  };

  const _openPhotoLibraryImportConfiramtionScreen = (item) => {
    navigation.navigate('PhotoLibraryImportConfirmation', {item});
  };
  return (
    <View style={styles.view_container}>
      <FlatList
        ListHeaderComponent={
          <View style={styles.view_header}>
            <Text style={styles.text_header}>Photo Library</Text>
          </View>
        }
        numColumns={4}
        keyExtractor={(image) => {
          return image.node.timestamp.toString();
        }}
        style={{flex: 1}}
        data={imagesArray}
        renderItem={_renderItem}></FlatList>
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
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  view_container: {
    flex: 1,
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
  image_backarrow: {
    height: 30,
    width: 30,
    transform: [{rotate: '90deg'}],
  },

  touchable_item: {
    flex: 1,
    margin: 2,
  },

  image_item: {aspectRatio: 1, flex: 1},
  view_header: {
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },

  text_header: {fontFamily: 'Merriweather-Bold', fontSize: 16},
});
export default PhotoLibraryScreen;
