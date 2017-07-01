const Sound = require("react-native-sound");

Sound.setCategory("Playback");

const sounds = {};
["chord_nice", "chord_prompt"].forEach((s) => {
  sounds[s] = new Sound(`${s}.mp3`, Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      console.log("failed to load the sound", error);
    }
  });
});

export {
  sounds,
};
export default function (soundFile) {
// Load the sound file  from the app bundle
  const sound = new Sound(soundFile, "", (error) => {
    if (error) {
      console.log("Failed to load the sound", soundFile, error);
    } else {
      console.log("play sound file: ", soundFile);
      sound.play();
    }
  });
}
