import React,  { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import FlipCard from 'react-native-flip-card'

import { colors, window } from '../styles/common';
import Volume from '../components/Volume';


class Entry extends React.Component {
  render() {
    let entry = this.props.entry;
    let audio_url = `https://souka.io/${entry.audio_url}.mp3`;
    let frontText =  entry.word || entry.kana;
    let backText = entry.kana;
    let word = entry.word;
    let roman =  entry.roman;
    let firstDefinition = entry.firstDefinition;
    let examples = entry.examples.slice(0,3).map((e, index) =>
        <View style={styles.example} key={e.id}>
          <Text style={styles.exampleContent}>{index+1}. {e.content}</Text>
          <Text style={styles.exampleTran}>    {e.translation}</Text>
        </View>
    )
    let examplesView = examples.length && <View>
      <Text style={styles.examplesHeader}>例句：</Text>
      {examples}
    </View> || null;

    return (
          <FlipCard
            style={styles.flipCard}
            friction={20}
            perspective={1000}
            flipHorizontal={true}
            flipVertical={false}
            flip={false}
            clickable={true}
            onFlipped={(isFlipped)=>{console.log('isFlipped', isFlipped)}}
          >
            {/* Face Side */}
            <View style={styles.face}>
              <Text style={styles.frontText}>{frontText}</Text>
              <Volume audio_url={audio_url} style={styles.volumeIcon} ref="volume"/>
            </View>

            {/* Back Side */}
            <View style={styles.back}>
              <Text style={styles.backText}>{backText}</Text>
              <Text style={styles.roman}>{roman}</Text>
              <Text style={styles.word}>{word}</Text>
              <Text style={styles.firstDefinition}>{firstDefinition}</Text>
              {examplesView}
            </View>
          </FlipCard>
    );
  }
}

const styles = StyleSheet.create({
  flipCard: {
    flex:0,
    height: window.height*0.618,
    width: window.width*0.8,
    backgroundColor: 'white',
    borderWidth:1,
    borderColor: '#e1e8ee',
    padding: 15,
  },
  face:{
    flex:1,
    alignItems: "center",
    justifyContent: "center"
  },
  back:{
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  frontText:{
    fontSize: 48,
    color:"#546576"
  },
  backText:{
    fontSize: 48,
    color:"#546576",
    marginBottom:5
  },
  word:{
    fontSize: 24,
    color: "#87939f",
    marginBottom:5,

  },
  roman:{
    color: "#87939f",
    marginBottom:5,
  },
  examplesHeader:{
    color: "#999",
    fontSize:13,
    marginBottom:3
  },
  exampleContent:{
    color:"#546576",
    marginBottom:3
  },
  exampleTran:{
    color: "#777",
    marginBottom:6
  },
  volumeIcon: {
    padding: 12,
    position: 'absolute',
    bottom: 5,
    right: 5
  }
});

export default Entry;
