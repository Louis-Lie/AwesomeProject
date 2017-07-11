import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
} from "react-native";
import {
  StackNavigator,
} from "react-navigation";
import Icon from "react-native-vector-icons/FontAwesome";

import { colors } from "styles/common";

class ProfileScreen extends Component {
  static navigationOptions = {
    title: "我",
    tabBarLabel: "我",
    tabBarIcon: ({ tintColor }) => (
      <Icon name="user-o" size={24} color={tintColor} />
    ),
    headerStyle: {
      backgroundColor: colors.primaryColor,
    },
    headerTitleStyle: {
      color: "white",
    }
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

const ProfileStack = StackNavigator({
  Profile: { screen: ProfileScreen },
}
);

export default ProfileStack;
