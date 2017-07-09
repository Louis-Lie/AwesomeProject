import React, { Component } from "react";
import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import KeyboardSpacer from "react-native-keyboard-spacer";

import { colors, window } from "../styles/common";
import playSound, { sounds } from "../utils/soundPlayer";
import Volume from "../components/Volume";
import Choice from "../components/Choice";

class Dicttion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      answer: "",
      hintColor: "#FFCA61"
    };

    this.updateAnswer = this.updateAnswer.bind(this);
    this.clearAnswer = this.clearAnswer.bind(this);
  }

  componentDidMount() {
    this.playAudio();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (this.props.index !== nextProps.index);
  }
  componentDidUpdate(prevProps, prevState) {
    this.playAudio();
    const answer = "";
    this.setState({ answer });
    this.textInput.setNativeProps({ text: answer });
  }

  playAudio() {
    const entry = this.props.entries[this.props.index];
    const audioUrl = `https://souka.io/${entry.audio_url}.mp3`;
    playSound(audioUrl);
  }
  updateAnswer(text) {
    console.log("udpate answer: ", text);
    const answer = this.state.answer + text;
    this.setState({ answer });
    this.textInput.setNativeProps({ text: answer });

    const entry = this.props.entries[this.props.index];
    const rightAnswer = entry.word || entry.kana;
    if (answer === rightAnswer) {
      sounds.right_answer.play();
      setTimeout(() => this.props.nextTask(), 500);
    }
  }
  checkAnswer() {
    const answer = this.state.answer;
    const entry = this.props.entries[this.props.index];
    const rightAnswer = entry.word || entry.kana;
    if (answer === rightAnswer) {
      this.showRight();
      sounds.right_answer.play();
      setTimeout(() => this.props.nextTask(), 500);
    } else {
      this.showWrong();
    }
  }

  clearAnswer() {
    console.log("clear answer");
    if (this.state.answer.length > 0) {
      const answer = this.state.answer.slice(0, this.state.answer.length - 1);
      this.setState({ answer });
      this.textInput.setNativeProps({ text: answer });
    }
  }

  render() {
    const entries = this.props.entries;
    const entry = this.props.entries[this.props.index];
    const audioUrl = `https://souka.io/${entry.audio_url}.mp3`;

    return (
      <View style={styles.container}>
        <View style={styles.box}>
          <View style={styles.inputWrap}>
            <TextInput
              ref={(component) => { this.textInput = component; }}
              style={styles.input}
              maxLength={40}
              autoFocus
              selectionColor={colors.textColor}
              returnKeyType="done"
              onFocus={Keyboard.dismiss}
            />
            <KeyboardSpacer />
          </View>
          <Volume audioUrl={audioUrl} style={styles.volumeIcon} />
        </View>
        <Choice
          rightAnswer={entry}
          choices={entries}
          updateAnswer={this.updateAnswer}
          clearAnswer={this.clearAnswer}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",

  },
  box: {
    flexDirection: "row",
    width: window.width,
    padding: 15,
    paddingBottom: 0,
  },
  inputWrap: {
    height: 40,
    width: window.width * 0.8,
    borderBottomWidth: 2,
    borderColor: "#FFCA61",
  },
  input: {
    height: 40,
    fontSize: 32,
    color: "#546576",
  },
  volumeIcon: {
    padding: 12,
  }
});

export default Dicttion;
