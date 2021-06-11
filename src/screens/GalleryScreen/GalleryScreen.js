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
import CameraRoll from '@react-native-community/cameraroll';
import AsyncStorage from '@react-native-async-storage/async-storage';

import JournalImageComponent from 'JournalImageComponent/JournalImageComponent';
import JournalNoteComponent from 'JournalNoteComponent/JournalNoteComponent';
import JournalTrackComponent from 'JournalTrackComponent/JournalTrackComponent';
import JournalVideoComponent from 'JournalVideoComponent/JournalVideoComponent';

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
    setFullList(sortedJournalItems);
    setLoadingReady(true);
  };

  const _loadJournalItems = async () => {
    let imagesArray = await _loadImages();
    let notesArray = await _loadNotes();
    let tracksArray = await _loadTracks();
    let journalItems = imagesArray.concat(notesArray, tracksArray);

    if (journalItems == null) return [];
    return journalItems;
  };

  const _loadImages = async () => {
    let imArray = [];
    await CameraRoll.getPhotos({
      first: 10000,
      groupTypes: 'Album',
      groupName: 'Nectar',
      include: ['imageSize', 'orientation'],
    }).then(async (r) => {
      if (r?.edges == null) return [];
      imArray = r.edges.reverse();
    });
    return imArray;
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

  const renderItem = ({item}) => {
    //renderitem has item property between
    let {type} = item.node;
    switch (type) {
      case 'image':
        return <JournalImageComponent journalItem={item} />;
      case 'image/jpeg':
        return <JournalImageComponent journalItem={item} />;
      case 'video/mp4':
        return <JournalVideoComponent journalItem={item} />;
      case 'note':
        return <JournalNoteComponent journalItem={item} />;
      case 'track':
        return <JournalTrackComponent journalItem={item} />;
      default:
        break;
    }
  };

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
