import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Text,
  Animated,
  NativeModules,
} from 'react-native';
import CameraRoll from '@react-native-community/cameraroll';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GalleryScreen = ({navigation}) => {
  const [imageList, setImageList] = useState([]);
  const [notes, setNotes] = useState([]);
  const [fullList, setFullList] = useState([]);
  const [loadingReady, setLoadingReady] = useState(false);
  const [listOpacity, setListOpacity] = useState(new Animated.Value(0));

  const weekdays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const months = [
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

  useEffect(() => {
    const _loadData = async () => {
      await _loadImages();
      _fadeIn();
    };
    _loadData();
  }, []);

  const _fadeIn = () => {
    Animated.timing(listOpacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const _loadTracks = async () => {
    try {
      const value = await AsyncStorage.getItem('tracks');
      if (value !== null) {
        return JSON.parse(value);
      } else {
        return [];
      }
    } catch (e) {}
  };

  const _loadVideoTracks = async () => {
    try {
      const value = await AsyncStorage.getItem('videoTracks');
      if (value !== null) {
        return JSON.parse(value);
      } else {
        return [];
      }
    } catch (e) {}
  };

  const _loadNotes = async () => {
    try {
      const value = await AsyncStorage.getItem('notes');
      if (value !== null) {
        return JSON.parse(value);
      } else {
        return [];
      }
    } catch (e) {}
  };

  const _stitchVideoTracks = (imageArray) => {
    return imageArray.map((image) => {
      if (image.node.type !== 'video/mp4') return image;
      const foundVideoTrack = videoTracksArray.find((videoTrack) => {
        difference = videoTrack.node.timestamp - image.node.timestamp;
        return difference > -10 && difference < 10;
      });

      if (foundVideoTrack === undefined) return image;

      image.node.videoTrack = foundVideoTrack;
      image.node.type = 'videoWithTrack';
      return image;
    });
  };

  const _loadImages = async () => {
    try {
      await CameraRoll.getPhotos({
        first: 100,
        groupTypes: 'Album',
        groupName: 'Nectar',
        include: ['imageSize', 'orientation'],
      }).then(async (r) => {
        imageArray = r.edges.reverse();
        tracksArray = await _loadTracks();
        notesArray = await _loadNotes();
        videoTracksArray = await _loadVideoTracks();

        imageArrayWithVideoTracks = _stitchVideoTracks(imageArray);
        fullArray = imageArrayWithVideoTracks.concat(notesArray, tracksArray);
        if (fullArray.length == 0) return;
        fullArray.sort((a, b) => {
          return a.node.timestamp < b.node.timestamp ? 1 : -1;
        });
        let arrayWithDates = _compareListItemDates(fullArray);

        setFullList(arrayWithDates);

        setLoadingReady(true);
      });
    } catch (e) {
      console.warn(e);
      // error reading value
    }
  };

  const _compareListItemDates = (fullArray) => {
    let newArray = [];
    fullArray.forEach((item, index) => {
      let date = new Date(item.node.timestamp * 1000);
      let itemsDayOfTheMonth = date.getDate();
      if (index === 0) {
        newArray.splice(0, 0, _calculateDate(date, itemsDayOfTheMonth));
        newArray.splice(newArray.length, 0, item);
      } else {
        let previousItemDate = new Date(
          fullArray[index - 1].node.timestamp * 1000,
        );
        let previousItemDayOfTheMonth = previousItemDate.getDate();

        if (
          itemsDayOfTheMonth !== previousItemDayOfTheMonth ||
          previousItemDate - date > 604800000
        ) {
          newArray.splice(
            newArray.length,
            0,
            _calculateDate(date, itemsDayOfTheMonth),
          );
          newArray.splice(newArray.length, 0, item);
        } else {
          newArray.splice(newArray.length, 0, item);
        }
      }
    });
    return newArray;
  };

  const _calculateDate = (date, itemsDayOfTheMonth) => {
    let nowDate = new Date();
    let nowDayOfTheMonth = nowDate.getDate();
    if (nowDayOfTheMonth == itemsDayOfTheMonth && nowDate - date < 604800000) {
      return {node: {date: 'Today', type: 'date', timestamp: date}};
    } else {
      let formattedDate = (
        weekdays[date.getDay()] +
        ' ' +
        itemsDayOfTheMonth +
        '.' +
        months[date.getMonth()]
      ).toString();
      return {node: {date: formattedDate, type: 'date', timestamp: date}};
    }
    {
    }
  };

  const _checkImageOrientation = (image) => {
    let aspectRatio = 3 / 4;
    if (Platform.OS == 'android') {
      if (image.orientation == 90 || image.orientation == 270) {
        aspectRatio = image.height / image.width;
      } else if (image.orientation == 0 || image.orientation == 180) {
        aspectRatio = image.width / image.height;
      }
    } else {
      aspectRatio = image.width / image.height;
    }

    return (
      <Image
        style={{
          width: '100%',
          aspectRatio: aspectRatio,
        }}
        key={image.uri}
        source={{uri: image.uri}}></Image>
    );
  };

  const renderItem = ({item}) => {
    if (item.node.type === 'image' || item.node.type === 'image/jpeg') {
      return (
        <TouchableOpacity
          activeOpacity={1.0}
          style={{
            width: '90%',
            marginVertical: 64,
            alignSelf: 'center',
          }}
          onPress={() =>
            navigation.navigate('ImageDetail', {
              image: item,
            })
          }>
          {_checkImageOrientation(item.node.image)}
        </TouchableOpacity>
      );
    } else if (item.node.type === 'videoWithTrack') {
      return (
        <TouchableOpacity
          activeOpacity={1.0}
          style={{
            width: '90%',
            marginVertical: 64,
            alignSelf: 'center',
          }}
          onPress={() =>
            navigation.navigate('VideoDetail', {
              video: item,
            })
          }>
          <Image
            style={{width: '100%', aspectRatio: 9 / 16}}
            source={{uri: item.node.image.uri}}></Image>
        </TouchableOpacity>
      );
    } else if (item.node.type === 'note') {
      const _formatTime = () => {
        let unix_timestamp = item.node.timestamp;

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
      return (
        <TouchableOpacity
          style={styles.view_note_container}
          onPress={() =>
            navigation.navigate('NoteDetail', {
              note: item,
            })
          }>
          <Text style={styles.text_note}>{item.node.note}</Text>
          <Text
            style={{
              fontFamily: 'Merriweather-Light',
              color: 'gray',
              marginStart: 8,
              marginTop: 8,
            }}>
            {_formatTime()}
          </Text>
        </TouchableOpacity>
      );
    } else if (item.node.type === 'track') {
      let {track} = item.node;
      return (
        <TouchableOpacity
          activeOpacity={1.0}
          onPress={() => navigation.navigate('SongDetail', {track: item})}
          style={{
            flex: 1,
            alignItems: 'center',
            width: '80%',
            alignSelf: 'center',
            marginVertical: 64,
          }}>
          <Image
            source={{uri: track.albumImage}}
            style={{
              width: '100%',
              aspectRatio: 1,
              borderRadius: 0,
            }}></Image>
          <Text
            numberOfLines={2}
            style={{
              fontWeight: 'bold',
              fontSize: 22,
              marginTop: 32,
              textAlign: 'center',
            }}>
            {track.name}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 8,
            }}>
            <Image
              source={require('Nectar/src/images/image_spotify_icon.png')}
              style={{height: 24, width: 24}}></Image>
            <Text
              numberOfLines={1}
              style={{
                fontWeight: 'bold',
                fontSize: 18,
                color: 'gray',
                marginStart: 6,
                textAlign: 'center',
                flexShrink: 1,
              }}>
              {track.artist}
            </Text>
          </View>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 14,
              marginTop: 16,
              textAlign: 'center',
            }}>
            {track.album}
          </Text>
        </TouchableOpacity>
      );
    } else if (item.node.type === 'date') {
      return (
        <View style={styles.view_date_container}>
          <Text style={styles.text_date}>{item.node.date}</Text>
        </View>
      );
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <Animated.View
        style={[styles.view_flatlist_container, {opacity: listOpacity}]}>
        {loadingReady ? (
          <FlatList
            ListHeaderComponent={
              <View
                style={{
                  height: 100,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={{fontFamily: 'Merriweather-Bold', fontSize: 16}}>
                  Journal
                </Text>
              </View>
            }
            style={{flex: 1}}
            keyExtractor={(item) => item.node.timestamp.toString()}
            data={fullList}
            renderItem={(item) => renderItem(item)}></FlatList>
        ) : null}
      </Animated.View>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.view_journal_button_container}>
        <Image
          style={styles.image_downarrow}
          source={require('Nectar/src/images/image_downarrow.png')}></Image>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  view_journal_button_container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  view_note_container: {
    width: '85%',
    marginVertical: 64,
    justifyContent: 'flex-start',
    alignSelf: 'center',

    borderColor: '#f0f0f0',
    borderRadius: 10,
  },

  view_date_container: {
    width: '90%',
    marginVertical: 0,
    justifyContent: 'flex-start',
    alignSelf: 'center',
  },

  view_flatlist_container: {
    flex: 1,
  },
  text_note: {
    textAlign: 'left',
    fontSize: 18,
    fontFamily: 'Merriweather-Regular',
  },
  text_date: {
    textAlign: 'left',
    fontSize: 18,
    fontFamily: 'Merriweather-Bold',
    color: 'black',
  },
  image_downarrow: {
    height: 26,
    width: 26,
    transform: [{rotate: '180deg'}],
  },
});
export default GalleryScreen;
