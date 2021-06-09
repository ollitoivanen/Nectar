import React, {useState} from 'react';
import {StyleSheet, View, TouchableOpacity, Image, Text} from 'react-native';
import CameraRoll from '@react-native-community/cameraroll';
import Video from 'react-native-video';
import {weekdays, months} from 'constants/constants';
import JournalItemOptionsComponent from 'JournalItemOptionsComponent/JournalItemOptionsComponent';
import FooterDateComponent from 'FooterDateComponent/FooterDateComponent';
import RNFS from 'react-native-fs';

const VideoDetailScreen = ({route, navigation}) => {
  const {journalItem} = route.params;
  const {image} = journalItem.node;
  const videoUri = image.uri;
  const {width, height, orientation} = image;

  const [paused, setPaused] = useState(false);
  const [optionsModalVisible, setOptionsModalVisible] = useState(false);

  const _changeOptionsModalVisibility = (toVisibility) => {
    setOptionsModalVisible(toVisibility);
  };
  const _deleteVideo = () => {
    RNFS.unlink(videoUri).then(() => {
      RNFS.scanFile(videoUri).then(() => {
        navigation.popToTop();
      });
    }); // Remove video from cache
  };

  const _setVideoState = () => {
    setPaused(!paused);
  };

  const _resolveAspectRatio = () => {
    //Cameraroll library on android doesn't differntiate between width / height on different orientation images.
    //Therefore landscape images on android need to check orientation and use opposite aspect ratio.
    if (Platform.OS == 'ios' || orientation == 0 || orientation == 180)
      return height / width;

    if (orientation == 90 || orientation == 270) return height / width;
  };

  return (
    <View style={styles.view_container}>
      <View style={styles.view_item_container}>
        <TouchableOpacity onPress={() => _setVideoState()}>
          <Video
            paused={paused}
            disableFocus={true}
            muted={true}
            source={{uri: videoUri}}
            repeat={true}
            resizeMode={'contain'}
            style={{
              height: '100%',
            }}></Video>
        </TouchableOpacity>
      </View>
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
          _deleteItem={() => _deleteVideo()}
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
    aspectRatio: 9 / 16,
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
});
export default VideoDetailScreen;
