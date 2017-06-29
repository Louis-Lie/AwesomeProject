import React,  { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { colors, window } from '../styles/common';


class ProgressBar extends React.Component {
  render() {
    let index = this.props.index;
    let length = this.props.length;
    let width = index*100 / length + '%';

    return (
      <View style={styles.progressBar}>
        <View style={[styles.progress, {width:width}]}></View>
        <Text style={styles.progressText}>
          {index}/{length}
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  progressBar: {
    zIndex:1000,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top:0,
    width: window.width,
    backgroundColor: '#f3e3b0'
  },
  progressText:{
    color: 'white'
  },
  progress:{
    position:'absolute',
    left:0,
    height: 16,
    backgroundColor: '#FFCA61'
  },
});

export default ProgressBar;
