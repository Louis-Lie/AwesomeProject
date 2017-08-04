import React, { Component } from "react";
import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from "react-native";
import KeyboardSpacer from "react-native-keyboard-spacer";
import { Button } from "react-native-elements";

import { colors, window } from "styles/common";
import playSound, { sounds } from "utils/soundPlayer";
import TaskFinished from "components/TaskFinished";
import Volume from "components/Volume";
import Choice from "components/Choice";

class Dictation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      answer: "",
      hintColor: colors.yellow,
      freeze: false,
      showAnswer: false
    };

    this.updateAnswer = this.updateAnswer.bind(this);
    this.checkAnswer = this.checkAnswer.bind(this);
    this.clearAnswer = this.clearAnswer.bind(this);
  }

  componentDidMount() {
    this.playAudio();
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.index !== nextProps.index) {
      this.playAudio(1);
    }
    return true;
  }

  playAudio(next = 0) {
    const entry = this.props.entries[this.props.index + next];
    if (entry) {
      const audioUrl = `https://souka.io/${entry.audio_url}.mp3`;
      playSound(audioUrl);
    }
  }

  clearInput() {
    const answer = "";
    this.setState({ answer,
      showAnswer: false,
      freeze: false,
      hintColor: colors.yellow });
    this.textInput.setNativeProps({ text: answer });
  }

  updateAnswer(text) {
    console.log("udpate answer: ", text);
    if (this.state.freeze) { return; }
    const answer = this.state.answer + text;
    this.textInput.setNativeProps({ text: answer });
    this.setState({ answer, }, () => this.checkAnswer(false));
  }

  checkAnswer(checkWrong = true) {
    console.log("check answer state: ", this.state);
    const answer = this.state.answer;
    const entry = this.props.entries[this.props.index];
    const rightAnswer = entry.word || entry.kana;
    if (answer === rightAnswer) {
      this.setState({ freeze: true, hintColor: colors.primaryColor, showAnswer: true });
      sounds.right_answer.play();
      setTimeout(() => { this.clearInput(); this.props.nextTask(); }, 800);
    } else if (checkWrong) {
      this.setState({ hintColor: colors.red, showAnswer: true });
      sounds.wrong_answer.play();
    }
  }

  clearAnswer() {
    console.log("clear answer");
    if (this.state.answer.length > 0) {
      const answer = this.state.answer.slice(0, this.state.answer.length - 1);
      this.setState({ answer, hintColor: colors.yellow, showAnswer: false });
      this.textInput.setNativeProps({ text: answer });
    }
  }

  render() {
    const entry = this.props.entries[this.props.index];
    if (!entry) {
      return (<TaskFinished
        goBack={this.props.goBack}
        title="已完成所有听写任务"
      />);
    }

    const entries = this.props.entries;
    const audioUrl = `https://souka.io/${entry.audio_url}.mp3`;
    const rightAnswer = (this.state.showAnswer && <View style={styles.rightAnswer}>
      <Text style={styles.rightLabel}>正确答案</Text>
      <Text style={styles.rightText}>{entry.word || entry.kana}</Text>
      <Text style={styles.rightText}>{entry.first_definition}</Text>
    </View>) || null;

    return (
      <View style={styles.container}>
        {rightAnswer}
        <View style={styles.box}>
          <View style={[styles.inputWrap, { borderColor: this.state.hintColor }]}>
            <TextInput
              ref={(component) => { this.textInput = component; }}
              placeholder="回想听到的单词"
              style={styles.input}
              maxLength={40}
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
        <Button
          key={`button_${Date.now()}`}
          style={{ width: window.width * 0.618, marginTop: 20 }}
          backgroundColor={colors.primaryColor}
          buttonStyle={{ borderRadius: 2 }}
          onPress={this.checkAnswer}
          title="想不起来"
        />
        <TouchableHighlight
          key={`audioFeedback_${Date.now()}`}
          underlayColor="transparent"
          style={styles.audioFeedback}
          onPress={() => { this.clearAnswer(); this.props.nextTask(); }}
        >
          <Text style={{ color: "#aaa" }}>音频有问题</Text>
        </TouchableHighlight>
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
  rightAnswer: {
    alignItems: "center",
    position: "absolute",
    top: 40
  },
  rightLabel: {
    color: colors.textColor,
    marginBottom: 5
  },
  rightText: {
    color: colors.primaryColor,
    marginBottom: 10
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
    height: 56,
    fontSize: 28,
    color: "#546576",
  },
  volumeIcon: {
    padding: 12,
  },
  audioFeedback: {
    position: "absolute",
    bottom: 20,
    right: 20
  }
});

export default Dictation;
