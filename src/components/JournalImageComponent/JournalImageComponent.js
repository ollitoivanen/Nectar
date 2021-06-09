import React from 'react';
import {StyleSheet, TouchableOpacity, Image, Platform} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const JournalImageComponent = (props) => {
  const navigation = useNavigation();
  const {journalItem} = props;
  const {image} = journalItem.node;
  const imageUri = image.uri;
  const {width, height, orientation} = image;

  const _resolveAspectRatio = () => {
    //Cameraroll library on android doesn't differntiate between width / height on different orientation images.
    //Therefore landscape images on android need to check orientation and use opposite aspect ratio.
    if (Platform.OS == 'ios' || orientation == 0 || orientation == 180)
      return width / height;

    if (orientation == 90 || orientation == 270) return height / width;
  };

  const _openImageDetailScreen = () => {
    navigation.navigate('ImageDetail', {
      journalItem,
    });
  };

  return (
    <React.Fragment>
      <TouchableOpacity
        onPress={() => _openImageDetailScreen()}
        style={styles.touchable_image_container}
        activeOpacity={1.0}>
        <Image
          resizeMode={'contain'}
          style={{
            width: '100%',
            aspectRatio: _resolveAspectRatio(),
          }}
          key={imageUri}
          source={{uri: imageUri}}></Image>
      </TouchableOpacity>
    </React.Fragment>
  );
};
const styles = StyleSheet.create({
  touchable_image_container: {
    width: '95%',
    marginVertical: 64,
    alignSelf: 'center',
  },
});
export default JournalImageComponent;
