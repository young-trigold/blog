import React from 'react';
import textPressSoundSrc from '../static/audio/text-press.mp3';

const addMediaEffect =
  (
    callback: React.MouseEventHandler<HTMLElement>,
    sound = textPressSoundSrc,
    vibrateDuration = 20,
  ) =>
  (event: React.MouseEvent<HTMLElement>) => {
    callback(event);
    navigator?.vibrate(vibrateDuration);
    (new Audio(sound).cloneNode(true) as HTMLAudioElement).play();
  };

export default addMediaEffect;
