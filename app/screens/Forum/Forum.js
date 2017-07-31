import React, { Component } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from "react-native";
import {
  StackNavigator,
} from "react-navigation";

import Icon from "react-native-vector-icons/FontAwesome";
import TopicItem from "components/TopicItem";
import Tabs from "components/Tabs";
import fetcher from "utils/fetcher";
import { colors } from "styles/common";
import TopicScreen from "./Topic";
import CreateTopicScreen from "./CreateTopic";
import CreatePostScreen from "./CreatePost";


class ForumScreen extends Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
    title: "社区",
    tabBarLabel: "社区",
    tabBarIcon: ({ tintColor }) => (
      <Icon name="comments-o" size={24} color={tintColor} />
    ),
    headerStyle: {
      backgroundColor: colors.primaryColor,
    },
    headerTitleStyle: {
      color: "white",
    },
    headerRight: (
      <TouchableHighlight
        style={{ padding: 10, }}
        underlayColor={colors.primaryColor}
        onPress={() => {
          navigation.navigate("CreateTopic", {
            onGoBack: navigation.state.params.onGoBack,
            node: navigation.state.params.node
          });
        }}
      >
        <Icon name="edit" size={20} color="white" />
      </TouchableHighlight>
      ),
  });

  constructor(props) {
    super(props);
    this.state = {
      topics: [],
      node: "全部",
      page: 1,
      refreshing: true,
      loading: false,
      hasMore: true
    };

    this.changeNode = this.changeNode.bind(this);
    this.loadMore = this.loadMore.bind(this);
  }

  componentWillMount() {
    this.props.navigation.setParams({ node: this.state.node, onGoBack: this.changeNode });
    this.changeNode();
  }

  changeNode(node) {
    const nodeName = node || this.state.node;
    const topicUrl = `/forum/topics/?node=${nodeName}&ipp=10`;
    this.setState({ refreshing: true });
    fetcher.get(topicUrl).then((res) => {
      const topics = res.data.results;
      this.setState({
        topics,
        node: nodeName,
        page: 1,
        refreshing: false,
        hasMore: true
      });
    }).catch((error) => {
      console.log("handling error: ", error);
      this.setState({ refreshing: false, hasMore: true });
    });
  }
  loadMore() {
    if (!this.state.hasMore || this.state.loading) return;

    this.setState({ loading: true });
    const page = this.state.page + 1;
    const nodeName = this.state.node;
    const topicUrl = `/forum/topics/?node=${nodeName}&ipp=10&page=${page}`;
    this.setState({ refreshing: true });
    fetcher.get(topicUrl).then((res) => {
      const newTopics = res.data.results;
      const topics = this.state.topics.concat(newTopics);
      this.setState({ topics, page, loading: false });
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

    return (
      <View style={styles.container}>
        <Tabs
          selected={this.state.node}
          style={{ backgroundColor: colors.backgroundColor }}
          selectedStyle={{ color: "#F6416C" }}
          onSelect={(el) => {
            this.props.navigation.setParams({ node: el.props.name });
            this.changeNode(el.props.name);
          }}
        >
          <Text style={styles.node} name="全部">全部</Text>
          <Text style={styles.node} name="学习">学习</Text>
          <Text style={styles.node} name="日剧">日剧</Text>
          <Text style={styles.node} name="动漫">动漫</Text>
          <Text style={styles.node} name="游戏">游戏</Text>
          <Text style={styles.node} name="小说">小说</Text>
        </Tabs>

        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.changeNode}
            />
          }
          extraData={this.state}
          removeClippedSubviews={false}
          data={this.state.topics}
          renderItem={({ item }) => <TopicItem topic={item} navigation={this.props.navigation} />}
          keyExtractor={(item, index) => index}
          onEndReachedThreshold={0}
          onEndReached={({ distanceFromEnd }) => {
            console.log("on end reached ", distanceFromEnd);
            this.loadMore();
          }}
        />
        {loading}
      </View>
    );
  }
}

const ForumStack = StackNavigator({
  Forum: { screen: ForumScreen },
  Topic: { screen: TopicScreen },
  CreateTopic: { screen: CreateTopicScreen },
  CreatePost: { screen: CreatePostScreen }
}
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "white",
  },
  node: {
    color: colors.textColor,
    padding: 5,
    margin: 5
  },

});

export { ForumScreen };
export default ForumStack;
