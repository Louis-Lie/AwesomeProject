import React, { Component } from "react";
import {
  ActivityIndicator,
  FlatList,
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
        onPress={() => { navigation.goBack(); }}
      >
        <Icon name="edit" size={20} color="white" />
      </TouchableHighlight>
      ),
  });

  constructor(props) {
    super(props);
    this.state = { topics: [], isLoading: true, page: "全部" };
  }

  componentWillMount() {
    this.fetchTopics();
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.page !== nextState.page) {
      this.fetchTopics(nextState.page);
    }
  }

  fetchTopics(page) {
    const nodeName = page || this.state.page;
    const topicUrl = `/forum/topics/?node=${nodeName}`;
    this.setState({ isLoading: true });
    fetcher.get(topicUrl).then((res) => {
      const topics = res.data.results;
      this.setState({ topics, isLoading: false });
    });
  }

  render() {
    console.log(this, this.state);
    if (this.state.isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <Tabs
          selected={this.state.page}
          style={{ backgroundColor: "white" }}
          selectedStyle={{ color: "#F6416C" }}
          onSelect={el => this.setState({ page: el.props.name })}
        >
          <Text name="全部">全部</Text>
          <Text name="学习">学习</Text>
          <Text name="动漫">动漫</Text>
          <Text name="游戏">游戏</Text>
          <Text name="小说">小说</Text>
        </Tabs>

        <FlatList
          data={this.state.topics}
          renderItem={({ item }) => <TopicItem topic={item} />}
          keyExtractor={(item, index) => item.id}
        />
      </View>
    );
  }
}

const ForumStack = StackNavigator({
  Forum: { screen: ForumScreen },
  Topic: { screen: TopicScreen },
}
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: colors.backgroundColor,
  },
  absolute: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  nodes: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "white",
    borderColor: "#ccc"
  },
  node: {
    color: colors.textColor,
    padding: 5,
    margin: 5
  }
});
export default ForumStack;
ForumStack;
