import React from 'react';
import {StyleSheet, Image, View} from 'react-native';
import ImageTrackComponent from 'ImageTrackComponent/ImageTrackComponent';

const PrintedImageComponent = (props) => {
  const {imageUri, track} = props;

  const _renderImage = () => {
    return (
      <Image
        style={{
          width: '100%',
          aspectRatio: 3 / 4,
        }}
        key={imageUri}
        source={{uri: imageUri}}></Image>
    );
  };

  /*const _calculateAspectRatio = () => {
        if (
          pictureOrientation ==
          (IMAGE_ORIENTATION_PORTRAIT || IMAGE_ORIENTATION_PORTRAIT_UPSIDE_DOWN)
        ) {
          return IMAGE_ASPECT_RATIO_PORTRAIT;
        }
    
        if (
          pictureOrientation ==
          (IMAGE_ORIENTATION_LANDSCAPE_LEFT || IMAGE_ORIENTATION_LANDSCAPE_RIGHT)
        ) {
          return IMAGE_ASPECT_RATIO_LANDSCAPE;
        }
      };*/
  return (
    <View
      style={[
        styles.view_image_container,
        track == null ? {paddingBottom: 64} : {paddingBottom: 0},
      ]}>
      {_renderImage()}
      {track == null ? null : <ImageTrackComponent track={track} />}
    </View>
  );
};

const styles = StyleSheet.create({
  view_image_container: {
    width: '90%',
    marginTop: '10%',
    elevation: 8,
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
  },
});
export default PrintedImageComponent;
