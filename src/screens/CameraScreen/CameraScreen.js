import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  Animated,
  NativeModules,
  NativeEventEmitter,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import Slider from '@react-native-community/slider';
import ActionSetCurrentTrack from 'ActionSetCurrentTrack/ActionSetCurrentTrack';
import {CurrentTrack} from 'constants/constants';
import {connect} from 'react-redux';

const {SpotifyModule} = NativeModules;

const CameraScreen = (props) => {
  const {currentTrack, navigation} = props;
  const cameraRef = useRef('camera');
  const playerStateListener = useRef(null);
  const [containerOpacity] = useState(new Animated.Value(0));

  const [takingVideo, setTakingVideo] = useState(false);
  const [cameraType, setCameraType] = useState(RNCamera.Constants.Type.back);
  const [exposure, setExposure] = useState(2);
  const [poi, setPoi] = useState({x: 0.5, y: 0.5, autoExposure: true});

  const [focusPointVisible, setFocusPointVisible] = useState({
    visible: false,
    x: null,
    y: null,
  });
  const [focusPointOpacity] = useState(new Animated.Value(0));

  const {height, width} = Dimensions.get('screen');

  useEffect(() => {
    _subscribeToEvents = async () => {
      await SpotifyModule.subscribeToAppRemote();
      _attachListener();
    };
    _subscribeToEvents();

    return () => {
      if (playerStateListener.current === null) return;
      playerStateListener.current.remove();
    };
  }, []);

  const _attachListener = () => {
    const eventEmitter = new NativeEventEmitter(SpotifyModule);
    playerStateListener.current = eventEmitter.addListener(
      'playerState',
      (event) => {
        /*
      event:{
        isPaused,
        nameame,
        uri,
        playbackPosition
      }
      */
        if (event.uri == null) return;
        _setCurrentTrack(event);
      },
    );
  };

  const _setCurrentTrack = (event) => {
    let {name, uri, isPaused} = event;
    let currentTrack = new CurrentTrack(name, uri, isPaused);
    props.ActionSetCurrentTrack(currentTrack);
  };

  const _takePicture = async () => {
    await cameraRef.current.takePictureAsync().then((image) => {
      navigation.navigate('ImageConfirmation', {image});
    });
  };

  const _takeVideo = async () => {
    setTakingVideo(true);
    await cameraRef.current
      .recordAsync({quality: RNCamera.Constants.VideoQuality['1080p']})
      .then(async (video) => {
        setTakingVideo(false);
        navigation.navigate('VideoConfirmation', {
          video,
          track,
        });
      });
  };

  const _stopVideo = () => {
    cameraRef.current.stopRecording();
  };

  const _focus = (event) => {
    setFocusPointVisible({
      visible: true,
      x: event.x,
      y: event.y,
    });

    Animated.timing(focusPointOpacity, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      Animated.timing(focusPointOpacity, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }, 500);

    setPoi({
      x: event.x / width,
      y: event.y / height,
      autoExposure: false,
    });
  };

  const _changeCameraType = () => {
    cameraType == RNCamera.Constants.Type.back
      ? setCameraType(RNCamera.Constants.Type.front)
      : setCameraType(RNCamera.Constants.Type.back);
  };

  _fadeContainerIn = () => {
    Animated.timing(containerOpacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
      }}>
      <Animated.View
        style={{
          flex: 1,
          backgroundColor: 'white',
          opacity: containerOpacity,
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}>
        <RNCamera
          ratio={'4:3'}
          onTap={(event) => _focus(event)}
          onCameraReady={() => _fadeContainerIn()}
          useNativeZoom={true}
          captureAudio={true}
          autoFocus={RNCamera.Constants.AutoFocus.on}
          style={[styles.camera, {aspectRatio: 3 / 4}]}
          type={cameraType}
          exposure={exposure}
          autoFocusPointOfInterest={poi}
          ref={cameraRef}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'This is required for you to take photos with Nectar!',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          androidRecordAudioPermissionOptions={{
            title: 'Permission to use audio recording',
            message: 'This is required to record audio along your videos.',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}>
          <Animated.View
            style={[
              styles.view_focus_point,
              {
                left: focusPointVisible.x - 25,
                top: focusPointVisible.y - 0 - 25,
                opacity: focusPointOpacity,
              },
            ]}
          />
          <TouchableOpacity
            onPress={() => _changeCameraType()}
            style={{position: 'absolute', top: 0, right: 0}}>
            <Image
              source={require('Nectar/src/images/image_switch_camera_icon.png')}
              style={{height: 22, width: 22, margin: 16}}></Image>
          </TouchableOpacity>
        </RNCamera>

        <View
          style={{
            position: 'absolute',
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
          }}>
          {currentTrack !== null ? (
            <View
              style={{
                alignSelf: 'center',
                borderWidth: 1.5,
                borderColor: '#f0f0f0',
                borderRadius: 100,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginVertical: 8,
                maxWidth: '90%',
              }}>
              <TouchableOpacity
                onPress={() => {
                  currentTrack.isPaused
                    ? SpotifyModule.resume()
                    : SpotifyModule.pause();
                }}>
                <Image
                  source={
                    currentTrack.isPaused
                      ? require('Nectar/src/images/image_play_icon.png')
                      : require('Nectar/src/images/image_pause_icon.png')
                  }
                  style={{
                    height: 32,
                    width: 32,
                    opacity: 0.6,
                    marginStart: 12,
                  }}></Image>
              </TouchableOpacity>
              <Image
                source={require('Nectar/src/images/image_spotify_icon.png')}
                style={{height: 16, width: 16, marginStart: 4}}></Image>
              <Text
                numberOfLines={1}
                style={{
                  marginStart: 8,
                  marginEnd: 16,
                  marginVertical: 4,
                  fontWeight: 'bold',
                  fontSize: 12,
                  flexShrink: 1,
                }}>
                {currentTrack.name}
              </Text>
            </View>
          ) : null}

          <View style={styles.view_brightness_container}>
            <Slider
              style={{width: 200, height: 40}}
              minimumValue={0}
              maximumValue={1}
              value={0.5}
              maximumTrackTintColor={'lightgray'}
              minimumTrackTintColor={'black'}
              thumbTintColor={'transparent'}
              onValueChange={(x) => setExposure(x)}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              width: '100%',
              marginVertical: 16,
            }}>
            <View style={styles.view_mode_selector_open_button_container}>
              <TouchableOpacity
                onPress={() => navigation.navigate('SpotifySearch')}
                style={styles.touchable_mode_selector_button}>
                <Image
                  source={require('Nectar/src/images/image_spotify_icon.png')}
                  style={{height: 24, width: 24}}></Image>
              </TouchableOpacity>
            </View>
            <View style={styles.view_shutter_container}>
              <TouchableOpacity
                pressRetentionOffset={100}
                activeOpacity={0.5}
                onLongPress={() => _takeVideo()}
                onPressOut={() => {
                  takingVideo ? _stopVideo() : _takePicture();
                }}
                style={[
                  styles.view_shutter,
                  takingVideo
                    ? {borderColor: '#ff3d58', backgroundColor: '#ffd9de'}
                    : {borderColor: 'black', backgroundColor: '#f2f2f2'},
                ]}></TouchableOpacity>
            </View>
            <View style={styles.view_mode_selector_open_button_container}>
              <TouchableOpacity
                onPress={() => navigation.navigate('AddNote')}
                style={styles.touchable_mode_selector_button}>
                <Text style={styles.text_plus_sign}>Tt</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('Gallery')}
            style={styles.view_journal_button_container}>
            <Image
              style={styles.image_downarrow}
              source={require('Nectar/src/images/image_downarrow.png')}></Image>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  camera: {
    width: '100%',
    backgroundColor: 'white',
  },

  view_shutter: {
    height: 75,
    aspectRatio: 1,
    borderRadius: 50,
    borderWidth: 3,
  },

  image_brightness: {
    height: 26,
    width: 26,
    marginRight: 0,
  },
  image_downarrow: {
    height: 26,
    width: 26,
  },

  view_brightness_container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  view_shutter_container: {
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },

  view_blank_container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.0,
  },

  view_journal_button_container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 16,
  },

  text_journal: {
    fontWeight: 'bold',
    fontSize: 18,
  },

  view_focus_point: {
    height: 50,
    width: 50,
    borderRadius: 25,
    borderColor: 'white',
    borderWidth: 5,
    backgroundColor: 'transparent',
    position: 'absolute',
  },

  view_mode_selector_open_button_container: {
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  touchable_mode_selector_button: {
    backgroundColor: 'white',
    borderRadius: 200,
    borderWidth: 2,
    height: 60,
    width: 60,
    borderColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text_plus_sign: {
    fontSize: 20,
    color: 'black',
    fontFamily: 'Merriweather-Bold',
    alignSelf: 'center',
    marginBottom: 4,
  },
});

const mapStateToProps = (state) => {
  return {
    currentTrack: state.ReducerSetCurrentTrack.currentTrack,
  };
};

export default connect(mapStateToProps, {ActionSetCurrentTrack})(CameraScreen);
