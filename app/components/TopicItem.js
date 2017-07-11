import React, { Component } from "react";

import {
  Text,
  TouchableHighlight,
  StyleSheet,
  View
} from "react-native";

import { colors } from "../styles/common";

class TopicItem extends Component {
  constructor(props) {
    super(props);

    this.renderTopic = this.renderTopic.bind(this);
  }
  renderTopic() {
    console.log("render topic: ", this.props.topic);
    alert(this.props.topic.title);
  }
  render() {
    const topic = this.props.topic;
    return (
      <TouchableHighlight onPress={this.renderTopic} >
        <View style={styles.topic}>
          <Text style={styles.title}>{topic.title}</Text>
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  topic: {
    flex: 1,
    padding: 5,
  },
  title: {
    color: colors.textColor
  }
});
export default TopicItem;
