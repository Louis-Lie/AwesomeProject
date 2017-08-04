import React, { Component } from "react";

import {
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from "react-native";

import { colors } from "styles/common";

class Choice extends Component {
  constructor(props) {
    super(props);

    this.renderChoice = this.renderChoice.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.rightAnswer.id !== nextProps.rightAnswer.id;
  }

  renderChoice(item) {
    return (
      <TouchableHighlight
        key={`${item}_${Date.now()}`}
        underlayColor="transparent"
        onPress={() => this.props.updateAnswer(item)}
      >
        <Text style={styles.choice} >{item}</Text>
      </TouchableHighlight>
    );
  }

  render() {
    const rightAnswer = this.props.rightAnswer;
    const randChoices = this.props.choices;
    const randWords = randChoices.map(e => e.word).filter(x => x && x.length);
    const randKanas = randChoices.map(e => e.kana).filter(x => x && x.length);

    let choices = null;
    if (rightAnswer.word.length) {
      choices = new Set(rightAnswer.word.split(""));
    } else {
      choices = new Set(rightAnswer.kana.split(""));
    }
    [1, 2, 3, 4].forEach((x) => {
      const rand1 = randWords[Math.floor(Math.random() * randWords.length)];
      const rand2 = randKanas[Math.floor(Math.random() * randKanas.length)];
      if (rand1) choices.add(rand1.split("")[0]);
      if (rand2) choices.add(rand2.split("")[0]);
    });
    choices = [...choices].sort(() => 0.5 - Math.random());
    console.log("choices: ", choices);
    return (
      <View style={styles.choicesBox}>
        {
          choices.map(item => (
            this.renderChoice(item)
          ))
        }
        <TouchableHighlight
          key={`back_${Date.now()}`}
          underlayColor="transparent"
          onPress={this.props.clearAnswer}
        >
          <Image source={require("../images/keyboard-key-delete-48.png")} style={styles.deleteIcon} />
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  choicesBox: {
    padding: 5,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",

  },
  choice: {
    backgroundColor: colors.buttonColor,
    borderRadius: 5,
    color: "white",
    margin: 10,
    fontSize: 18,
    padding: 10
  },
  deleteIcon: {
    width: 38,
    height: 38,
    margin: 10,
    padding: 10
  }
});

export default Choice;
