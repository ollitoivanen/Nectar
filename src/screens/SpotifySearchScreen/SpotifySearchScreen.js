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

  const _authenticate = async () => {
    return await SpotifyModule.authenticate().then(async (result) => {
      return result;
    });
  };

  const _getTopTracks = async () => {
    const result = await _authenticate();

    if (result == 'error') return;
    setToken(result);
    await _fetchTopTracks(result);
  };

  const _fetchTopTracks = async (token) => {
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
  };

  /*const _getRecentlyPlayedTracks = async () => {
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
  };*/

  const _renderSearchScreen = () => {
    if (token == null)
      return (
        <View style={styles.view_not_connected_container}>
          <Text style={styles.text_not_connected}>
            Not connected to spotify
          </Text>
          <Text style={styles.text_not_connected_sub}>
            Connect to spotify in order add songs to your Journal.
          </Text>
          <TouchableOpacity
            onPress={() => _getTopTracks()}
            style={styles.touchable_connect_button}>
            <Text style={styles.text_connect}>Connect</Text>
          </TouchableOpacity>
        </View>
      );
    return (
      <React.Fragment>
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
                navigation.navigate('TrackConfirmation', {track: item, token});
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
      </React.Fragment>
    );
  };

  return (
    <View style={styles.view_container}>
      {_renderSearchScreen()}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.touchable_back_button_container}>
        <Image
          style={styles.image_backarrow}
          source={require('Nectar/src/images/image_downarrow.png')}></Image>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  view_container: {
    flex: 1,
    backgroundColor: 'white',
  },

  view_not_connected_container: {
    flex: 1,
    marginHorizontal: 32,
  },

  touchable_connect_button: {
    backgroundColor: '#1ed760',
    borderRadius: 50,
    alignSelf: 'center',
    margin: 16,
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

  text_not_connected: {
    fontSize: 18,
    fontFamily: 'Merriweather-Bold',
    alignSelf: 'center',
    marginTop: '30%',
  },

  text_not_connected_sub: {
    marginVertical: 16,
    fontSize: 14,
    fontFamily: 'Merriweather-Regular',
    alignSelf: 'center',
    color: 'gray',
    textAlign: 'center',
  },

  text_connect: {
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
    color: 'white',
    marginVertical: 8,
    marginHorizontal: 16,
  },

  touchable_back_button_container: {
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
