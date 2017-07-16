import React, { Component } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from "react-native";
import {
  StackNavigator,
} from "react-navigation";


import Icon from "react-native-vector-icons/FontAwesome";
import { Actions } from "react-native-router-flux";

import fetcher from "utils/fetcher";
import { colors } from "styles/common";

const axios = require("axios");

const ACCOUNT_URL = "https://souka.io/accounts/setting/";
const LOUGOUT_URL = "https://souka.io/accounts/logout/";


class PostScreen extends Component {
  static navigationOptions = {
    title: "我",
    tabBarLabel: "我",
    tabBarIcon: ({ tintColor }) => (
      <Icon name="user-o" size={24} color={tintColor} />
    ),
    headerStyle: {
      backgroundColor: colors.primaryColor,
    },
    headerTintColor: "white",
    headerRight: (
      <TouchableHighlight
        style={{ padding: 10, }}
        underlayColor={colors.primaryColor}
        onPress={() => {
          axios.get(LOUGOUT_URL).then(() => Actions.login());
        }}
      >
        <Text style={{ color: "white" }}>退出</Text>
      </TouchableHighlight>
     ),
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      profile: null,
    };
  }

  componentWillMount() {
    this.fetchProfile();
  }
  fetchProfile() {
    fetcher.get(ACCOUNT_URL).then((res) => {
      const profile = res.data.profile;
      this.setState({ profile, isLoading: false });
    });
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator />
        </View>
      );
    }
    return (
      <View style={styles.container} />
    );
  }
}

const ProfileStack = StackNavigator({
  Profile: { screen: PostScreen },
}
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "white"
  }
});
export default ProfileStack;
