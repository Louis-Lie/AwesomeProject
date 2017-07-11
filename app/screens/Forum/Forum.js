import React, { Component } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
  Button,
} from "react-native";
import {
  StackNavigator,
} from "react-navigation";

import Icon from "react-native-vector-icons/FontAwesome";

import TopicItem from "components/TopicItem";
import fetcher from "utils/fetcher";
import { colors } from "styles/common";
import TopicScreen from "./Topic";

class ForumScreen extends Component {
  static navigationOptions = {
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
    }
  };

  constructor(props) {
    super(props);
    this.state = { topics: [], isLoading: true };
  }

  componentWillMount() {
    const topicUrl = "/forum/topics";
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
});
export default ForumStack;
