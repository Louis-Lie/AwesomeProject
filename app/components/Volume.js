import React, { Component } from "react";
import {
  TouchableHighlight,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

import playSound from "utils/soundPlayer";

class Volume extends Component {
  constructor(props) {
    super(props);
    this.play = this.play.bind(this);
  }

  play() {
    playSound(this.props.audioUrl);
  }

  render() {
    return (
      <TouchableHighlight
        underlayColor="transparent"
        style={this.props.style}
        onPress={this.play}
      >
        <Icon name="volume-up" size={24} style={{ color: "#546576" }} />
      </TouchableHighlight>
    );
  }
}

export default Volume;
