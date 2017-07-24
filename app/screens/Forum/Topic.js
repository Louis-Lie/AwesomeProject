import React, { Component } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View
} from "react-native";
import moment from "moment";

import Icon from "react-native-vector-icons/FontAwesome";
import { colors, window } from "styles/common";
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

  static onNavigationStateChange(prevState, newState, action) {
    console.log("nav change--> ", prevState, newState, action);
  }
  constructor(props) {
    super(props);
    this.state = {
      topic: this.props.navigation.state.params.topic,
      posts: [],
      page: 1,
      isLoading: true,
      hasMore: true,
      loading: false
    };
    this.fetchPosts();

    this.fetchPosts = this.fetchPosts.bind(this);
    this.createPost = this.createPost.bind(this);
    this.loadMore = this.loadMore.bind(this);
  }

  fetchPosts() {
    const topic = this.state.topic;
    const postUrl = `/forum/topics/${topic.id}/posts/?ipp=10`;
    fetcher.get(postUrl).then((res) => {
      const posts = res.data.results;
      this.setState({ posts, isLoading: false });
    });
  }

  createPost() {
    const { navigate } = this.props.navigation;
    navigate("CreatePost", { onGoBack: this.fetchPosts, topic: this.state.topic });
  }

  loadMore() {
    if (!this.state.hasMore || this.state.loading) return;

    this.setState({ loading: true });
    const topic = this.state.topic;
    const page = this.state.page + 1;
    const postUrl = `/forum/topics/${topic.id}/posts/?ipp=10&page=${page}`;
    this.setState({ refreshing: true });
    fetcher.get(postUrl).then((res) => {
      const newPosts = res.data.results;
      const posts = this.state.posts.concat(newPosts);
      this.setState({ posts, page, loading: false });
    }).catch((error) => {
      if (error.response.status === 404) {
        this.setState({ hasMore: false, loading: false });
      } else {
        alert(error);
      }
    });
  }

  render() {
    let loading = null;
    if (this.state.loading) {
      loading = <ActivityIndicator />;
    }

    const topic = this.state.topic;
    let list = null;
    if (this.state.isLoading) {
      list = (
        <View style={styles.container}>
          <ActivityIndicator />
        </View>
      );
    } else {
      const content = (<View style={styles.topicHeader}>
        <Text style={styles.content}>{topic.content}</Text>
        <Text style={styles.postHeader}>
          {topic.num_posts}回复 | 最后更新{moment(topic.updated_at).fromNow()}
        </Text>
      </View>);
      const data = [content].concat(this.state.posts);

      list = (<FlatList
        style={styles.posts}
        removeClippedSubviews={false}
        data={data}
        renderItem={({ item }) => item.topic ? <PostItem post={item} /> : item}
        keyExtractor={(item, index) => index}
        onEndReachedThreshold={0}
        onEndReached={({ distanceFromEnd }) => {
          console.log("on end reached ", distanceFromEnd);
          this.loadMore();
        }}
      />);
    }

    return (

      <View style={styles.container}>
        <TopicHeader topic={topic} />
        {list}
        {loading}
        <TouchableHighlight onPress={this.createPost}>
          <View style={styles.inputBar}>
            <TextInput style={styles.inputPlace} editable={false} placeholder="回复" />
            <Icon name="paper-plane-o" size={24} color={colors.primaryColor} />
          </View>
        </TouchableHighlight>
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
  posts: {
    marginBottom: 50
  },
  postHeader: {
    fontSize: 12,
    color: colors.mute
  },
  inputBar: {
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    width: window.width,
    height: 50,
    backgroundColor: "#fefefe",
    padding: 10,
  },
  inputPlace: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 3,
    marginRight: 10
  }
});
export default TopicScreen;
