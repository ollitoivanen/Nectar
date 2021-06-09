export const ACTION_SET_CURRENT_TRACK = 'ActionSetCurrentTrack';
export const ACTION_SET_CAMERA_EXPOSURE = 'ActionSetCameraExposure';
export const ACTION_SET_CAMERA_STATE = 'ActionSetCameraState';
export const ACTION_SET_CAMERA_TYPE = 'ActionSetCameraType';
export const ACTION_SET_FOCUS_MARKER_LOCATION = 'ActionSetFocusMarkerLocation';
export const ACTION_SET_LOADING_STATE = 'ActionSetLoadingState';
export const ACTION_SET_SPOTIFY_APP_REMOTE_STATE = ' ActionSetAppRemoteState';
export const ACTION_SET_VIDEO_PLAYBACK_STATE = 'ActionSetVideoPlaybackState';

//Camera states

export const CAMERA_STATE_VIEW_FINDER = 'viewFinder';
export const CAMERA_STATE_TAKING_VIDEO = 'takingVideo';
export const CAMERA_STATE_VIDEO_TAKEN = 'videoTaken';
export const CAMERA_STATE_IMAGE_TAKEN = 'imageTaken';

//Spotify access states
export const USER_DENIED_ACCESS = 'UserDeniedAccess';

//Classes

export class CurrentTrack {
  constructor(name, uri, artists, imageUri, isPaused) {
    this.name = name;
    this.uri = uri;
    this.artists = artists;
    this.imageUri = imageUri;
    this.isPaused = isPaused;
  }
}

//Functions
export const _concatArtists = (artists) => {
  return artists.map((artist, index, array) => {
    if (index < array.length - 1) {
      return artist + ', ';
    } else {
      return artist;
    }
  });
};

export const androidCameraPermissionOptions = {
  title: 'Permission to use camera',
  message: 'This is required for you to take photos with Nectar!',
  buttonPositive: 'Ok',
  buttonNegative: 'Cancel',
};

export const androidRecordAudioPermissionOptions = {
  title: 'Permission to use audio recording',
  message: 'This is required to record audio along your videos.',
  buttonPositive: 'Ok',
  buttonNegative: 'Cancel',
};

export const IMAGE_ORIENTATION_PORTRAIT = 1;
export const IMAGE_ORIENTATION_PORTRAIT_UPSIDE_DOWN = 2;
export const IMAGE_ORIENTATION_LANDSCAPE_LEFT = 3;
export const IMAGE_ORIENTATION_LANDSCAPE_RIGHT = 4;

export const IMAGE_ASPECT_RATIO_PORTRAIT = 3 / 4;
export const IMAGE_ASPECT_RATIO_LANDSCAPE = 4 / 3;

export const weekdays = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];
export const months = [
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

/*
journalItem:{
  node:{
    type: image||note||track || imageTrack || date ,
    timestamp,
    note || image || track || date -> {
      note: note, track:{
        id, 
        uri,
        name,
        length, 
        artist:[],
        album,
        albumImage
      } date:date, image, tr
    }
  }
}
*/
