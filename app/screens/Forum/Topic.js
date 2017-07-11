import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
} from "react-native";

import Icon from "react-native-vector-icons/FontAwesome";

class TopicScreen extends Component {
  static navigationOptions = {
    title: "社区",
    tabBarLabel: "社区",
    tabBarIcon: ({ tintColor }) => (
      <Icon name="comments-o" size={24} color={tintColor} />
    ),
  };

  render() {
    return (
      <Button
        onPress={() => this.props.navigation.goBack()}
        title="回主页"
      />
    );
  }
}

export default TopicScreen;
