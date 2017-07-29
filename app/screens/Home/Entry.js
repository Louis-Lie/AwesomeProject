import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from "react-native";
import FlipCard from "react-native-flip-card";
import Icon from "react-native-vector-icons/FontAwesome";

import { colors } from "styles/common";
import playSound from "utils/soundPlayer";
import Volume from "components/Volume";
import RubyText from "components/RubyText";

class EntryScreen extends Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
    title: "单词",
    tabBarLabel: "单词",
    tabBarIcon: ({ tintColor, }) => (
      <Icon name="clone" size={24} color={tintColor} />
    ),
    headerStyle: {
      backgroundColor: colors.primaryColor,
    },
    headerTitleStyle: {
      color: "white",
    },
    headerLeft: (
      <TouchableHighlight
        style={{ padding: 10, }}
        underlayColor={colors.primaryColor}
        onPress={() => { navigation.state.params.onGoBack(); navigation.goBack(); }}
      >
        <Icon name="close" size={20} color="white" />
      </TouchableHighlight>
     ),
  })
  constructor(props) {
    super(props);
    const entry = this.props.navigation.state.params.entry;
    this.state = { entry };
  }

  componentDidMount() {
    this.playAudio();
  }

  playAudio() {
    const audioUrl = `https://souka.io/${this.state.entry.audio_url}.mp3`;
    playSound(audioUrl);
  }

  render() {
    const entry = this.state.entry;
    const audioUrl = `https://souka.io/${entry.audio_url}.mp3`;
    const word = entry.word;
    const backText = entry.kana;
    const roman = entry.roman;
    const firstDefinition = entry.first_definition;
    const examples = entry.examples.slice(0, 3).map((e, index) =>
    (<View style={styles.example} key={e.id}>
      <View style={styles.exampleLine} >
        <Text style={styles.exampleIndex}>{index + 1}. </Text>
        <RubyText textStyle={styles.exampleContent}>{e.ruby || e.content}</RubyText>
      </View>
      <View style={styles.exampleLine}>
        <Text style={styles.placeholderText}>{index + 1}. </Text>
        <Text style={styles.exampleTran}>{e.translation}</Text>
      </View>
    </View>
  )
    );
    const examplesView = (examples.length && <View>
      <Text style={styles.examplesHeader}>例句：</Text>
      {examples}
    </View>) || null;

    return (
      <FlipCard
        style={styles.flipCard}
        clickable={false}
      >
        <View style={styles.back}>
          <View style={styles.entryHeader}>
            <Text style={styles.backText}>{backText}</Text>
            <Volume audioUrl={audioUrl} style={styles.volumeIcon} />
          </View>
          <Text style={styles.roman}>{roman}</Text>
          <Text style={styles.word}>{word}</Text>
          <Text style={styles.definitionHeader}>释义：</Text>
          <Text style={styles.firstDefinition}>{firstDefinition}</Text>
          {examplesView}
        </View>
        <View />
      </FlipCard>
    );
  }
}

const styles = StyleSheet.create({
  flipCard: {
    flex: 1,
    borderWidth: 0,
    padding: 30,
    backgroundColor: colors.backgroundColor,
  },
  entryHeader: {
    flexDirection: "row"
  },
  backText: {
    fontSize: 32,
    color: "#546576",
    marginBottom: 5
  },
  word: {
    fontSize: 18,
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
  definitionHeader: {
    color: "#999",
    fontSize: 13,
    marginBottom: 10,
    marginTop: 15
  },
  example: {
    marginVertical: 5
  },
  examplesHeader: {
    color: "#999",
    fontSize: 13,
    marginBottom: 5
  },
  exampleLine: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  placeholderText: {
    color: "transparent"
  },
  exampleContent: {
    fontSize: 14,
    color: "#546576",
    marginBottom: 5
  },
  exampleTran: {
    color: "#777",
    fontSize: 14,
    marginBottom: 10
  },
  volumeIcon: {
    padding: 12,
    position: "absolute",
    bottom: 5,
    right: 5
  }
});

export default EntryScreen;
