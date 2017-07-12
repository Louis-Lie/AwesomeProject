import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
} from "react-native";

import Icon from "react-native-vector-icons/FontAwesome";
import { colors } from "styles/common";

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
