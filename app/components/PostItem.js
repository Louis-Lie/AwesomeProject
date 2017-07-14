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

class PostItem extends Component {
  constructor(props) {
    super(props);

    this.renderpost = this.renderpost.bind(this);
  }

  renderpost() {
    console.log("render post: ", this.props.post);
  }

  render() {
    const post = this.props.post;
    const avatarUrl = `https://souka.io${post.author.avatar_url}`;
    console.log("in render post", this, this.props, avatarUrl);
    return (
      <TouchableHighlight
        underlayColor="#F5F5F5"
        onPress={this.renderpost}
      >
        <View style={styles.post}>
          <Image style={styles.avatar} source={{ uri: avatarUrl }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.content}>{post.content}</Text>
            <View style={styles.meta}>
              <Text style={styles.author}>{post.author.name}</Text>
              <Text style={styles.sep}> • </Text>
              <Text style={styles.timestamp}>{moment(post.created_at).fromNow()}</Text>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  post: {
    flexDirection: "row",
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#eee"
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 5,
    marginRight: 15
  },
  content: {
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
export default PostItem;
