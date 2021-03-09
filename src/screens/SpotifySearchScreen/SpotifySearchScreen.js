import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  NativeModules,
  TouchableOpacity,
  FlatList,
  Text,
  TextInput,
  Image,
} from 'react-native';

const {SpotifyModule} = NativeModules;

const SpotifySearchScreen = ({route, navigation}) => {
  const [topTracks, setTopTracks] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [token, setToken] = useState(null);

  useEffect(() => {
    const _getTracks = async () => {
      await _getTopTracks();
    };
    _getTracks();
  }, []);

  const _searchSpotify = async (term) => {
    setSearchTerm(term);

    if (term.length > 1) {
      return fetch(
        'https://api.spotify.com/v1/search?q=' +
          term +
          '&type=artist,album,track,playlist',
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      )
        .then((response) => response.json())
        .then((json) => {
          let items = json.tracks.items;
          setSearchResults(items);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      setSearchResults(topTracks);
    }
  };

  const _getTopTracks = async () => {
    setTimeout(async () => {
      await SpotifyModule.authenticate().then(async (token) => {
        setToken(token);
        return fetch(
          'https://api.spotify.com/v1/me/top/tracks?time_range=short_term',
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          },
        )
          .then((response) => response.json())
          .then((json) => {
            let items = json.items;
            setTopTracks(items);
            setSearchResults(items);
          })
          .catch((error) => {
            console.error(error);
          });
      });
    }, 500);
  };

  const _getRecentlyPlayedTracks = async () => {
    return fetch('https://api.spotify.com/v1/me/player/recently-played', {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        let items = json.items;
        let formattedItems = items.map((item) => {
          return item.track;
        });
        console.log(items[0]);
        setTopTracks(formattedItems);
        setSearchResults(formattedItems);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <View style={styles.container}>
      <TextInput
        autoFocus={false}
        style={styles.textinput}
        onChangeText={(searchTerm) => _searchSpotify(searchTerm)}
        value={searchTerm}
        multiline={false}
        placeholder={'Search Spotify'}></TextInput>
      <FlatList
        data={searchResults}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('SongConfirmation', {track: item, token});
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginHorizontal: 12,
              marginVertical: 12,
            }}>
            <Image
              style={{height: 64, width: 64, borderRadius: 0}}
              source={{uri: item.album.images[1].url}}></Image>

            <View style={{flex: 1}}>
              <Text
                numberOfLines={1}
                style={{
                  marginStart: 16,
                  color: 'black',
                  fontWeight: 'bold',
                  overflow: 'hidden',
                  fontSize: 18,
                }}>
                {item.name}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginHorizontal: 16,
                }}>
                <Image
                  source={require('Nectar/src/images/image_spotify_icon.png')}
                  style={{height: 16, width: 16}}></Image>

                <Text
                  style={{
                    marginHorizontal: 8,
                    color: 'gray',
                    fontWeight: 'bold',
                  }}>
                  {item.artists.map((artist, index, array) => {
                    if (index < array.length - 1) {
                      return artist.name + ', ';
                    } else {
                      return artist.name;
                    }
                  })}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}></FlatList>

      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.view_back_button_container}>
        <Image
          style={styles.image_backarrow}
          source={require('Nectar/src/images/image_downarrow.png')}></Image>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  button: {
    height: 200,
    width: 200,
    backgroundColor: 'blue',
  },
  textinput: {
    borderWidth: 0,
    fontSize: 20,
    margin: 8,
    fontWeight: 'normal',
    color: 'black',
    paddingHorizontal: 16,
    borderColor: 'black',
    borderRadius: 10,
    fontFamily: 'Merriweather-Bold',
  },

  view_back_button_container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'white',
    paddingVertical: 16,
  },
  image_backarrow: {
    height: 26,
    width: 26,
    transform: [{rotate: '90deg'}],
    marginStart: 16,
  },
});
export default SpotifySearchScreen;
