import React, { Component } from "react";
import {
  Alert,
  StyleSheet,
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
      profile: {},
      vocabSize: null,
      courseTitle: null,
    };

    this.fetchData = this.fetchData.bind(this);
    this.onNavigation = this.onNavigation.bind(this);
  }

  componentWillMount() {
    this.fetchProfile();
  }

  fetchProfile() {
    fetcher.get(ACCOUNT_URL).then((res) => {
      const profile = res.data.profile;
      this.setState({ profile, isLoading: false });
    });
    this.fetchData();
  }
  fetchData() {
    fetcher.get("/course/user_courses/?active=1").then((res) => {
      const data = res.data;
      if (data.results.length) {
        const courseTitle = data.results[0].course.name;
        this.setState({ courseTitle });
      }
    });
    fetcher.get("/vocab/user_test/").then((res) => {
      const vocabSize = res.data.last_score;
      this.setState({ vocabSize });
    });
  }
  onNavigation() {
    console.log("onNavigation Profile");
    this.fetchData();
  }
  render() {
    const { navigate } = this.props.navigation;
    const user = this.state.profile;
    const avatarUrl = `https://souka.io${user.avatar_url}`;
    const subtitle = `用户名：${user.username || " "}`;
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
            title={user.name || " "}
            subtitle={subtitle}
            onPress={() => navigate("Setting", { user })}
          />
        </List>
        <List containerStyle={styles.list}>
          <ListItem
            leftIcon={{ name: "book" }}
            key="course"
            title="课程"
            subtitle={this.state.courseTitle || " "}
            onPress={() => navigate("Course", { user })}
          />
          <ListItem
            leftIcon={{ name: "trending-up" }}
            key={user.id}
            title="词汇量"
            subtitle={`${this.state.vocabSize || " "}`}
            onPress={() => navigate("Vocab", { user })}
          />
        </List>

        {/* <List containerStyle={styles.list}>
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
        </List>*/}

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

export { ProfileScreen };
export default ProfileStack;
