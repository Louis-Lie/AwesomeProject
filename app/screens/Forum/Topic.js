import React, { Component } from "react";
import {
  ActivityIndicator,
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
    this.state = { posts: [], isLoading: true };
    this.fetchPosts();
    this.fetchPosts = this.fetchPosts.bind(this);
  }

  fetchPosts() {
    const topic = this.props.navigation.state.params.topic;
    const postUrl = `/forum/topics/${topic.id}/posts/`;
    fetcher.get(postUrl).then((res) => {
      const posts = res.data.results;
      this.setState({ posts, isLoading: false });
    });
  }
  render() {
    const topic = this.props.navigation.state.params.topic;
    if (this.state.isLoading) {
      list = (
        <View style={styles.container}>
          <ActivityIndicator />
        </View>
      );
    } else {
      const content = (<View style={styles.topicHeader}>
        <Text style={styles.content}>{topic.content}</Text>
        <Text style={styles.postHeader}>{topic.num_posts}回复 | 最后更新{moment(topic.created_at).fromNow()}</Text>
      </View>);
      const data = [content].concat(this.state.posts);

      list = (<FlatList
        style={styles.posts}
        removeClippedSubviews={false}
        data={data}
        renderItem={({ item }) => item.topic ? <PostItem post={item} /> : item}
        keyExtractor={(item, index) => item.id}
      />);
    }


    return (

      <View style={styles.container}>
        <TopicHeader topic={topic} />
        {list}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  topicHeader: {
    backgroundColor: "#fbfbfb",
    padding: 15,
  },
  content: {
    color: colors.textColor,
    marginBottom: 20
  },
  postHeader: {
    fontSize: 12,
    color: colors.mute
  }
});
export default TopicScreen;
