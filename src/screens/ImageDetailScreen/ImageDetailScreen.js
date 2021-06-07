import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Text,
  Platform,
} from 'react-native';
import {weekdays, months} from 'constants/constants';
import CameraRoll from '@react-native-community/cameraroll';
import JournalItemOptionsComponent from 'JournalItemOptionsComponent/JournalItemOptionsComponent';
const ImageDetailScreen = ({route, navigation}) => {
  const [optionsModalVisible, setOptionsModalVisible] = useState(false);

  const _changeOptionsModalVisibility = (toVisibility) => {
    setOptionsModalVisible(toVisibility);
  };
  const _deleteImage = () => {
    CameraRoll.deletePhotos([route.params.journalItem.node.image.uri]).then(
      () => {
        navigation.navigate('Gallery');
      },
    );
  };

  const _formatTime = () => {
    let unix_timestamp = route.params.journalItem.node.timestamp;

    let date = new Date(unix_timestamp * 1000);

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

  const _checkImageOrientation = () => {
    let aspectRatio = 3 / 4;
    let {image} = route.params.journalItem.node;
    if (Platform.OS == 'android') {
      if (image.orientation == 90 || image.orientation == 270) {
        aspectRatio = image.height / image.width;
      } else if (image.orientation == 0 || image.orientation == 180) {
        aspectRatio = image.width / image.height;
      }
    } else {
      aspectRatio = image.width / image.height;
    }
    return aspectRatio;
  };
  return (
    <View style={styles.container}>
      <View style={{flex: 1, width: '100%', justifyContent: 'center'}}>
        <Image
          style={{width: '100%', aspectRatio: _checkImageOrientation()}}
          source={{uri: route.params.journalItem.node.image.uri}}></Image>
        <Text
          style={{
            fontFamily: 'Merriweather-Light',
            color: 'gray',
            marginStart: 8,
            marginTop: 8,
          }}>
          {_formatTime()}
        </Text>
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
export default ImageDetailScreen;
