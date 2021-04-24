import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Text,
  Animated,
  Platform,
} from 'react-native';
import CameraRoll from '@react-native-community/cameraroll';

const ImageDetailScreen = ({route, navigation}) => {
  const [optionsModalHeight] = useState(new Animated.Value(-300));
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
    let weekdays = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ];
    let months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

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

  const _makeOptionsVisible = (toVisibilty) => {
    if (toVisibilty === true) {
      Animated.timing(optionsModalHeight, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(optionsModalHeight, {
        toValue: -300,
        duration: 500,
        useNativeDriver: false,
      }).start();
    }
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
      <View style={{flex: 1, width: '95%', justifyContent: 'center'}}>
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
        <TouchableOpacity onPress={() => _makeOptionsVisible(true)}>
          <Text style={{fontSize: 20, marginHorizontal: 24}}>⋮</Text>
        </TouchableOpacity>
      </View>
      <Animated.View
        style={{
          position: 'absolute',
          bottom: optionsModalHeight,
          width: '100%',
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: 'lightgray',
          paddingTop: 8,
        }}>
        <TouchableOpacity
          onPress={() => _deleteImage()}
          style={styles.view_delete_button}>
          <Text style={styles.text_delete}>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => _makeOptionsVisible(false)}
          style={styles.view_journal_button_container}>
          <Image
            style={styles.image_downarrow}
            source={require('Nectar/src/images/image_downarrow.png')}></Image>
        </TouchableOpacity>
      </Animated.View>
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

  view_delete_button: {
    borderWidth: 2,
    borderRadius: 50,
    borderColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
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
  image_downarrow: {
    height: 26,
    width: 26,
  },
});
export default ImageDetailScreen;
