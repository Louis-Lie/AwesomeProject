import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import { window } from "styles/common";


class ProgressBar extends Component {
  render() {
    const index = this.props.index;
    const length = this.props.length;
    const width = `${(index * 100) / length}%`;

    return (
      <View style={styles.progressBar}>
        <View style={[styles.progress, { width }]} />
        <Text style={styles.progressText}>
          {index}/{length}
        </Text>
      </View>
    );
  }
}

const backgroundColor = "#f3e3b0";
const foregroundColor = "#FFCA61";

const styles = StyleSheet.create({
  progressBar: {
    zIndex: 1000,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 0,
    width: window.width,
    backgroundColor: "#f3e3b0"
  },
  progressText: {
    color: "white",
    backgroundColor: "transparent"
  },
  progress: {
    position: "absolute",
    left: 0,
    height: 16,
    backgroundColor: "#FFCA61"
  },
});

export default ProgressBar;
