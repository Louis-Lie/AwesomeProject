const Sound = require("react-native-sound");

Sound.setCategory("Playback");

const sounds = {};
["chord_nice", "chord_prompt", "right_answer", "wrong_answer"].forEach((s) => {
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

let isPlaying = false;
export default function (audioUrl) {
  if (isPlaying) return;

  isPlaying = true;
  const sound = new Sound(audioUrl, "", (error) => {
    if (error) {
      console.log("Failed to load the sound", audioUrl, error);
    } else {
      console.log("play sound file: ", audioUrl);
      sound.play();
    }
    isPlaying = false;
  });
}
