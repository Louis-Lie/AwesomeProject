import React, { Component } from "react";

import {
  Image,
  Text,
  TouchableHighlight,
  StyleSheet,
  View
} from "react-native";
import moment from "moment";

import { colors } from "styles/common";

const zhLocale = require("moment/locale/zh-cn");

moment.locale("zh-cn", zhLocale);

class TopicItem extends Component {
  constructor(props) {
    super(props);

    this.renderTopic = this.renderTopic.bind(this);
  }
  renderTopic() {
    const { navigate } = this.props.navigation;
    console.log("render topic: ", this.props.topic);
    navigate("Topic", { topic: this.props.topic });
  }

  render() {
    const topic = this.props.topic;
    const avatarUrl = `https://souka.io${topic.author.avatar_url}`;
    return (
      <TouchableHighlight
        underlayColor="#F5F5F5"
        onPress={this.renderTopic}
      >
        <View style={styles.topic}>
          <Image style={styles.avatar} source={{ uri: avatarUrl }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{topic.title}</Text>
            <View style={styles.meta}>
              <Text style={styles.author}>{topic.author.name}</Text>
              <Text style={styles.sep}> • </Text>
              <Text style={styles.timestamp}>{moment(topic.updated_at).fromNow()}</Text>
              <Text style={styles.sep}> • </Text>
              <Text style={styles.timestamp}>{topic.num_posts} 回复</Text>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  topic: {
    flexDirection: "row",
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#eee"
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 4,
    marginRight: 15
  },
  title: {
    color: colors.textColor,
    marginBottom: 5
  },
  meta: {
    flexDirection: "row",
  },
  author: {
    color: colors.mute,
    fontSize: 12
  },
  sep: {
    color: colors.mute,
    fontSize: 12
  },
  timestamp: {
    color: colors.mute,
    fontSize: 12
  }
});
export default TopicItem;
