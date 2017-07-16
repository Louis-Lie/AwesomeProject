import React, { Component } from "react";
import {
  Alert,
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from "react-native";
import {
  StackNavigator,
} from "react-navigation";

import { List, ListItem } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import { Actions } from "react-native-router-flux";

import fetcher from "utils/fetcher";
import { colors } from "styles/common";
import SettingScreen from "./Setting";
import CourseScreen from "./Course";
import VocabScreen from "./Vocab";
import TopicScreen from "./Topic";
import PostScreen from "./Post";

const axios = require("axios");

const ACCOUNT_URL = "https://souka.io/accounts/setting/";
const LOUGOUT_URL = "https://souka.io/accounts/logout/";


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
    headerTintColor: "white",
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
    const { navigate } = this.props.navigation;
    const user = this.state.profile;
    const avatarUrl = `https://souka.io${user.avatar_url}`;
    const subtitle = `用户名：${user.username}`;
    return (
      <View style={styles.container}>
        <List
          containerStyle={[styles.list, styles.profileItem]}
        >
          <ListItem
            style={styles.profileItem}
            avatarStyle={styles.profileAvatar}
            roundAvatar
            avatar={{ uri: avatarUrl }}
            key={user.id}
            title={user.name}
            subtitle={subtitle}
            onPress={() => navigate("Setting", { user })}
          />
        </List>
        <List containerStyle={styles.list}>
          <ListItem
            leftIcon={{ name: "book" }}
            key="course"
            title="我的课程"
            subtitle="JLPT N5"
            onPress={() => navigate("Course", { user })}
          />
          <ListItem
            leftIcon={{ name: "trending-up" }}
            key={user.id}
            title="词汇量"
            subtitle={subtitle}
            onPress={() => navigate("Vocab", { user })}
          />
        </List>

        <List containerStyle={styles.list}>
          <ListItem
            leftIcon={{ name: "create" }}
            key="topic"
            title="我创建的主题"
            onPress={() => navigate("Topic", { user })}
          />
          <ListItem
            leftIcon={{ name: "comment" }}
            key="post"
            title="我的回复"
            onPress={() => navigate("Post", { user })}
          />
        </List>

        <List containerStyle={styles.list}>
          <ListItem
            leftIcon={{ name: "stars" }}
            key="version"
            title="版本"
            subtitle="1.0"
            hideChevron
          />
        </List>
        <List containerStyle={[styles.list]}>
          <ListItem
            titleContainerStyle={{ alignItems: "center", justifyContent: "center" }}
            title="退出登录"
            hideChevron
            onPress={() => {
              Alert.alert(
                "退出登录",
                "重新登录后可继续使用",
                [
                  { text: "退出", onPress: () => { axios.get(LOUGOUT_URL).then(() => Actions.login()); } },
                  { text: "取消", onPress: () => console.log("Cancel Pressed"), style: "cancel" },
                ]
              );
            }}
          />
        </List>
      </View>
    );
  }
}

const ProfileStack = StackNavigator({
  Profile: { screen: ProfileScreen },
  Setting: { screen: SettingScreen },
  Course: { screen: CourseScreen },
  Vocab: { screen: VocabScreen },
  Topic: { screen: TopicScreen },
  Post: { screen: PostScreen }
}
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5"
  },
  profileItem: {
    height: 72,
    alignItems: "center",
    justifyContent: "center"
  },
  profileAvatar: {
    width: 54,
    height: 54,
    borderRadius: 27
  },
  list: {
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
});
export default ProfileStack;
