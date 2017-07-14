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
        onPress={() => { navigation.navigate("CreateTopic", { node: navigation.state.params.node }); }}
      >
        <Icon name="edit" size={20} color="white" />
      </TouchableHighlight>
      ),
  });

  constructor(props) {
    super(props);
    this.state = { topics: [], refreshing: true, page: "全部" };

    this.changePage = this.changePage.bind(this);
  }

  componentWillMount() {
    this.props.navigation.setParams({ node: this.state.page });
    this.changePage();
  }

  changePage(page) {
    const nodeName = page || this.state.page;
    const topicUrl = `/forum/topics/?node=${nodeName}`;
    this.setState({ refreshing: true });
    fetcher.get(topicUrl).then((res) => {
      const topics = res.data.results;
      this.setState({ topics, refreshing: false, page });
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Tabs
          selected={this.state.page}
          style={{ backgroundColor: colors.backgroundColor }}
          selectedStyle={{ color: "#F6416C" }}
          onSelect={(el) => { this.props.navigation.setParams({ node: el.props.name }); this.changePage(el.props.name); }}
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
              onRefresh={this.changePage}
            />
          }
          removeClippedSubviews={false}
          data={this.state.topics}
          renderItem={({ item }) => <TopicItem topic={item} navigation={this.props.navigation} />}
          keyExtractor={(item, index) => item.id}
        />
      </View>
    );
  }
}

const ForumStack = StackNavigator({
  Forum: { screen: ForumScreen },
  Topic: { screen: TopicScreen },
  CreateTopic: { screen: CreateTopicScreen },
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
  }
});
export default ForumStack;
ForumStack;
