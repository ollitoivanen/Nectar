export const ACTION_SET_CURRENT_TRACK = 'ActionSetCurrentTrack';

//Classes

export class CurrentTrack {
  constructor(name, uri, isPaused) {
    this.name = name;
    this.uri = uri;
    this.isPaused = isPaused;
  }
}
