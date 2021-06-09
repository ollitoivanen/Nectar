import React from 'react';
import {StyleSheet, TouchableOpacity, Image, Platform} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Video from 'react-native-video';

const JournalVideoComponent = (props) => {
  const navigation = useNavigation();
  const {journalItem} = props;
  const {image} = journalItem.node;
  const videoUri = image.uri;
  const {width, height, orientation} = image;

  const _resolveAspectRatio = () => {
    //Cameraroll library on android doesn't differntiate between width / height on different orientation images.
    //Therefore landscape images on android need to check orientation and use opposite aspect ratio.
    if (Platform.OS == 'ios' || orientation == 0 || orientation == 180)
      return height / width;

    if (orientation == 90 || orientation == 270) return height / width;
  };

  const _openVideoDetailScreen = () => {
    navigation.navigate('VideoDetail', {
      journalItem,
    });
  };

  return (
    <React.Fragment>
      <TouchableOpacity
        onPress={() => _openVideoDetailScreen()}
        style={styles.touchable_image_container}
        activeOpacity={1.0}>
        <Video
          resizeMode={'contain'}
          muted={true}
          paused={false}
          disableFocus={true}
          source={{uri: videoUri}}
          repeat={true}
          style={{width: '100%', aspectRatio: 9 / 16}}></Video>
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
export default JournalVideoComponent;
