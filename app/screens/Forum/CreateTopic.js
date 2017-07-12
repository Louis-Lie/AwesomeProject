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
    title: "创建主题",
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
    console.log(this.props.navigation);
    const nodeName = this.props.navigation.state.params.node;
    return (
      <Text>在{nodeName}创建主题</Text>
    );
  }
}

export default TopicScreen;
