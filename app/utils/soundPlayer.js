const Sound = require("react-native-sound");

Sound.setCategory("Playback");

const sounds = {};
["chord_nice", "chord_prompt"].forEach((s) => {
  // Load the sound file  from the app bundle
  // Have to add mp3 files to project and restart simulator
  sounds[s] = new Sound(`${s}.mp3`, Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      console.log("failed to load the sound", error);
    }
  });
});

export {
  sounds,
};

export default function (audioUrl) {
  const sound = new Sound(audioUrl, "", (error) => {
    if (error) {
      console.log("Failed to load the sound", audioUrl, error);
    } else {
      console.log("play sound file: ", audioUrl);
      sound.play();
    }
  });
}
