const Sound = require('react-native-sound');

Sound.setCategory('Playback');

export default function(soundFile) {
    // Load the sound file  from the app bundle
    const sound = new Sound(soundFile, '', (error) => {
      if(error){
        console.log('Failed to load the sound', soundFile, error);
        return;
      }
      console.log('duration in seconds: ' + sound.getDuration() + 'number of channels: ' + sound.getNumberOfChannels());
      sound.play()
    });
}
