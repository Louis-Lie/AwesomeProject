import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import FlipCard from "react-native-flip-card";

import { window } from "../styles/common";
import playSound, { sounds } from "../utils/soundPlayer";
import Volume from "../components/Volume";


class Entry extends Component {
  static onFlipStart(isFlipped) {
    if (!isFlipped) {
      sounds.chord_nice.play();
    }
  }

  componentDidMount() {
    this.playAudio();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (this.props.entry.id !== nextProps.entry.id);
  }

  componentDidUpdate(prevProps, prevState) {
    this.playAudio();
  }

  playAudio() {
    const audioUrl = `https://souka.io/${this.props.entry.audio_url}.mp3`;
    playSound(audioUrl);
  }

  render() {
    console.log("render entry");
    const entry = this.props.entry;
    const audioUrl = `https://souka.io/${entry.audio_url}.mp3`;
    const frontText = entry.word || entry.kana;
    const backText = entry.kana;
    const roman = entry.roman;
    const firstDefinition = entry.first_definition;
    const examples = entry.examples.slice(0, 3).map((e, index) =>
      (<View style={styles.example} key={e.id}>
        <Text style={styles.exampleContent}>{index + 1}. {e.content}</Text>
        <Text style={styles.exampleTran}>{`    ${e.translation}`}</Text>
      </View>)
    );
    const examplesView = (examples.length && <View>
      <Text style={styles.examplesHeader}>例句：</Text>
      {examples}
    </View>) || null;

    return (
      <FlipCard
        style={styles.flipCard}
        friction={20}
        perspective={1000}
        flipHorizontal
        flipVertical={false}
        flip={false}
        clickable
        onFlipStart={this.constructor.onFlipStart}
      >
        {/* Face Side */}
        <View style={styles.face}>
          <Text style={styles.frontText}>{frontText}</Text>
          <Volume audioUrl={audioUrl} style={styles.volumeIcon} />
        </View>

        {/* Back Side */}
        <View style={styles.back}>
          <Text style={styles.backText}>{backText}</Text>
          <Text style={styles.roman}>{roman}</Text>
          <Text style={styles.firstDefinition}>{firstDefinition}</Text>
          {examplesView}
        </View>
      </FlipCard>
    );
  }
}

const styles = StyleSheet.create({
  flipCard: {
    flex: 0,
    height: window.height * 0.618,
    width: window.width * 0.8,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#e1e8ee",
    padding: 15,
  },
  face: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  back: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  frontText: {
    fontSize: 48,
    color: "#546576"
  },
  backText: {
    fontSize: 48,
    color: "#546576",
    marginBottom: 5
  },
  word: {
    fontSize: 20,
    color: "#87939f",
    marginBottom: 5,
  },
  roman: {
    fontSize: 18,
    color: "#87939f",
    marginBottom: 5,
  },
  firstDefinition: {
    fontSize: 18,
    color: "#87939f",
    marginBottom: 15
  },
  examplesHeader: {
    color: "#999",
    fontSize: 13,
    marginBottom: 5
  },
  exampleContent: {
    color: "#546576",
    marginBottom: 5
  },
  exampleTran: {
    color: "#777",
    marginBottom: 10
  },
  volumeIcon: {
    padding: 12,
    position: "absolute",
    bottom: 5,
    right: 5
  }
});

export default Entry;
