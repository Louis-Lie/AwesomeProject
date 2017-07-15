import React, { Component } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  View,
} from "react-native";
import {
  StackNavigator,
} from "react-navigation";
import Icon from "react-native-vector-icons/FontAwesome";

import fetcher from "utils/fetcher";
import { colors } from "styles/common";
import ProfileSettings from "components/ProfileSettings";


const ACCOUNT_URL = "https://souka.io/accounts/setting/";


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
      <View style={styles.container}>
        <ProfileSettings user={this.state.profile} />
      </View>
    );
  }
}

const ProfileStack = StackNavigator({
  Profile: { screen: ProfileScreen },
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
