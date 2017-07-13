import React, { Component } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View
} from "react-native";
import moment from "moment";

import Icon from "react-native-vector-icons/FontAwesome";
import { colors } from "styles/common";
import TopicHeader from "components/TopicHeader";
import PostItem from "components/PostItem";
import fetcher from "utils/fetcher";

const zhLocale = require("moment/locale/zh-cn");

moment.locale("zh-cn", zhLocale);

class TopicScreen extends Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
    title: "主题",
    tabBarLabel: "社区",
    tabBarIcon: ({ tintColor }) => (
      <Icon name="comments-o" size={24} color={tintColor} />
    ),
    headerTintColor: "white",
    headerStyle: {
      backgroundColor: colors.primaryColor,
    },
  })

  constructor(props) {
    super(props);
    this.state = { posts: [] };
    this.fetchPosts();
    this.fetchPosts = this.fetchPosts.bind(this);
  }

  fetchPosts() {
    const topic = this.props.navigation.state.params.topic;
    const postUrl = `/forum/topics/${topic.id}/posts/`;
    fetcher.get(postUrl).then((res) => {
      const posts = res.data.results;
      this.setState({ posts });
    });
  }
  render() {
    const topic = this.props.navigation.state.params.topic;
    const data = [topic].concat(this.state.posts);

    return (
      <View style={styles.container}>
        <FlatList
          style={styles.posts}
          removeClippedSubviews={false}
          data={data}
          renderItem={({ item }) => item.topic ? <PostItem post={item} /> : <TopicHeader topic={item} />}
          keyExtractor={(item, index) => item.id}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});
export default TopicScreen;
