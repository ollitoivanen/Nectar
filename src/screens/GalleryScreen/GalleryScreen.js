import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Text,
  Animated,
} from 'react-native';
import {weekdays, months} from 'constants/constants';
import CameraRoll from '@react-native-community/cameraroll';
import AsyncStorage from '@react-native-async-storage/async-storage';

import JournalImageComponent from 'JournalImageComponent/JournalImageComponent';
import JournalNoteComponent from 'JournalNoteComponent/JournalNoteComponent';
import JournalTrackComponent from 'JournalTrackComponent/JournalTrackComponent';
import JournalDateComponent from 'JournalDateComponent/JournalDateComponent';

const GalleryScreen = ({navigation}) => {
  const [fullList, setFullList] = useState([]);
  const [loadingReady, setLoadingReady] = useState(false);
  const [listOpacity] = useState(new Animated.Value(0));

  useEffect(() => {
    const _loadData = async () => {
      await _processJournalItems();
      _fadeContainerIn();
    };
    _loadData();
  }, []);

  const _fadeContainerIn = () => {
    Animated.timing(listOpacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const _processJournalItems = async () => {
    let journalItems = await _loadJournalItems();
    if (journalItems.length == 0) return;
    let sortedJournalItems = _sortJournalItemsWithTimestamp(journalItems);
    let journalItemsWithDate = _addDatesToJournalItems(sortedJournalItems);
    setFullList(journalItemsWithDate);
    setLoadingReady(true);
  };

  const _loadJournalItems = async () => {
    let imagesArray = await _loadImages();
    let imageTracksArray = await _loadImageTracks();
    let stitchedImagesArray = _stitchImageTracks(imagesArray, imageTracksArray);
    let notesArray = await _loadNotes();
    let tracksArray = await _loadTracks();
    let journalItems = stitchedImagesArray.concat(notesArray, tracksArray);

    if (journalItems == null) return [];
    return journalItems;
  };

  const _loadImages = async () => {
    let imArray = [];
    await CameraRoll.getPhotos({
      first: 100,
      groupTypes: 'Album',
      groupName: 'Nectar',
      include: ['imageSize', 'orientation'],
    }).then(async (r) => {
      if (r?.edges == null) return [];
      imArray = r.edges.reverse();
    });
    return imArray;
  };

  const _loadImageTracks = async () => {
    try {
      const value = await AsyncStorage.getItem('imageTracks');
      if (value == null) return [];
      return JSON.parse(value);
    } catch (e) {}
  };

  const _loadTracks = async () => {
    try {
      const value = await AsyncStorage.getItem('tracks');
      if (value == null) return [];
      return JSON.parse(value);
    } catch (e) {}
  };

  const _loadNotes = async () => {
    try {
      const value = await AsyncStorage.getItem('notes');
      if (value == null) return [];
      return JSON.parse(value);
    } catch (e) {}
  };

  const _sortJournalItemsWithTimestamp = (journalItems) => {
    if (journalItems.length < 2) return journalItems;
    journalItems.sort((a, b) => {
      return a.node.timestamp < b.node.timestamp ? 1 : -1;
    });
    return journalItems;
  };

  /*const _loadVideoTracks = async () => {
    try {
      const value = await AsyncStorage.getItem('videoTracks');
      if (value == null) return [];
      return JSON.parse(value);
    } catch (e) {}
  };*/

  const _stitchImageTracks = (imagesArray, imageTracksArray) => {
    return imagesArray.map((image) => {
      const {timestamp} = image.node;

      const foundImageTrack = _matchImageAndTrack(imageTracksArray, timestamp);
      if (foundImageTrack == null) return image;

      image.node.imageTrack = foundImageTrack;
      image.node.type = 'imageWithTrack';
      return image;
    });
  };

  const _matchImageAndTrack = (imageTracksArray, timestamp) => {
    return imageTracksArray.find((imageTrack) => {
      let difference = imageTrack.node.timestamp - timestamp;
      return difference > -10 && difference < 10;
    });
  };

  const _addDatesToJournalItems = (sortedJournalItems) => {
    let journalItemsWithDate = [];
    sortedJournalItems.forEach((journalItem, index) => {
      let journalItemsDate = new Date(journalItem.node.timestamp * 1000);
      let itemsDayOfTheMonth = journalItemsDate.getDate();

      if (index === 0) {
        journalItemsWithDate = _addDateToJournalArray(
          journalItemsWithDate,
          journalItemsDate,
          itemsDayOfTheMonth,
        );
        journalItemsWithDate = _addItemToJournalArray(
          journalItemsWithDate,
          journalItem,
        );
      } else {
        let previousItemDate = new Date(
          sortedJournalItems[index - 1].node.timestamp * 1000,
        );
        let previousItemDayOfTheMonth = previousItemDate.getDate();

        if (
          _checkIfSameDate(
            journalItemsDate,
            itemsDayOfTheMonth,
            previousItemDate,
            previousItemDayOfTheMonth,
          )
        ) {
          journalItemsWithDate = _addDateToJournalArray(
            journalItemsWithDate,
            journalItemsDate,
            itemsDayOfTheMonth,
          );

          journalItemsWithDate = _addItemToJournalArray(
            journalItemsWithDate,
            journalItem,
          );
        } else {
          journalItemsWithDate = _addItemToJournalArray(
            journalItemsWithDate,
            journalItem,
          );
        }
      }
    });
    return journalItemsWithDate;
  };

  const _checkIfSameDate = (
    journalItemsDate,
    itemsDayOfTheMonth,
    previousItemDate,
    previousItemDayOfTheMonth,
  ) => {
    return (
      itemsDayOfTheMonth !== previousItemDayOfTheMonth ||
      previousItemDate - journalItemsDate > 604800000
    );
  };

  const _addDateToJournalArray = (
    journalItemsWithDate,
    journalItemsDate,
    itemsDayOfTheMonth,
  ) => {
    journalItemsWithDate.push(
      _calculateDate(journalItemsDate, itemsDayOfTheMonth),
    );
    return journalItemsWithDate;
  };

  const _addItemToJournalArray = (journalItemsWithDate, journalItem) => {
    journalItemsWithDate.push(journalItem);
    return journalItemsWithDate;
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

  const renderItem = ({item}) => {
    //renderitem has item property between
    let {type} = item.node;
    switch (type) {
      case 'image':
        return <JournalImageComponent journalItem={item} />;
      case 'image/jpeg':
        return <JournalImageComponent journalItem={item} />;
      case 'imageWithTrack':
        return <JournalImageComponent journalItem={item} />;
      case 'note':
        return <JournalNoteComponent journalItem={item} />;
      case 'track':
        return <JournalTrackComponent journalItem={item} />;
      case 'date':
        return <JournalDateComponent journalItem={item} />;
      default:
        break;
    }
  };
  /*if (item.node.type === 'videoWithTrack') {
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
    }*/

  const _checkIfLoadingReady = () => {
    if (loadingReady) {
      return (
        <FlatList
          ListHeaderComponent={
            <View style={styles.view_header}>
              <Text style={styles.text_header}>Journal</Text>
            </View>
          }
          keyExtractor={(journalItem) => {
            return journalItem.node.timestamp.toString();
          }}
          style={{flex: 1}}
          data={fullList}
          renderItem={renderItem}></FlatList>
      );
    }
    return null;
  };

  return (
    <View style={styles.view_container}>
      <Animated.View
        style={[styles.view_flatlist_container, {opacity: listOpacity}]}>
        {_checkIfLoadingReady()}
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
  view_container: {flex: 1, backgroundColor: 'white'},

  view_journal_button_container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  view_flatlist_container: {
    flex: 1,
  },
  view_header: {
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image_downarrow: {
    height: 26,
    width: 26,
    transform: [{rotate: '180deg'}],
  },

  text_header: {fontFamily: 'Merriweather-Bold', fontSize: 16},
});
export default GalleryScreen;
