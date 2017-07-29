import React, { Component } from "react";
import {
  Alert,
  StyleSheet,
  View,
} from "react-native";
import {
  StackNavigator,
} from "react-navigation";

import store from "react-native-simple-store";
import DeviceInfo from "react-native-device-info";
import { List, ListItem } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import { Actions, ActionConst } from "react-native-router-flux";

import fetcher from "utils/fetcher";
import { colors } from "styles/common";
import SettingScreen from "./Setting";
import CourseScreen from "./Course";
import VocabScreen from "./Vocab";
import TopicScreen from "./Topic";
import PostScreen from "./Post";
import QuotaScreen from "./Quota";

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
      profile: {},
      userCourse: {},
      quota: " "
    };

    this.setUserCourse = this.setUserCourse.bind(this);
    this.setUser = this.setUser.bind(this);
  }

  componentWillMount() {
    this.fetchProfile();
  }

  fetchProfile() {
    fetcher.get(ACCOUNT_URL).then((res) => {
      const profile = res.data.profile;
      profile.avatarUrl = `https://souka.io${profile.avatar_url}`;
      this.setState({ profile, isLoading: false });
    });

    fetcher.get("/course/user_courses/?active=1").then((res) => {
      const data = res.data;
      if (data.results.length) {
        const userCourse = data.results[0];
        this.setState({ userCourse });
      }
    });
  }

  setUserCourse(userCourse) {
    this.setState({ userCourse });
  }
  setUser(profile) {
    this.setState({ profile });
  }

  render() {
    const { navigate } = this.props.navigation;
    const user = this.state.profile;
    const course = this.state.userCourse.course;
    const subtitle = `用户名：${user.username || " "}`;
    let CleanCache = null;
    if (__DEV__) {
      CleanCache = (<List containerStyle={styles.list}>
        <ListItem
          leftIcon={{ name: "delete" }}
          key="cache"
          title="清除缓存"
          onPress={() => store.delete("entries").then(() => Alert.alert("清除成功"))}
          hideChevron
        />
      </List>);
    }

    return (
      <View style={styles.container}>
        <List
          containerStyle={[styles.list, styles.profileItem]}
        >
          <ListItem
            style={styles.profileItem}
            avatarStyle={styles.profileAvatar}
            roundAvatar
            avatar={{ uri: this.state.profile.avatarUrl }}
            key={user.id}
            title={user.name || " "}
            subtitle={subtitle}
            onPress={() => navigate("Setting", { user, setUser: this.setUser })}
          />
        </List>
        <List containerStyle={styles.list}>
          <ListItem
            leftIcon={{ name: "book" }}
            key="course"
            title="我的课程"
            subtitle={(course && course.name) || " "}
            onPress={() => navigate("Course", {
              userCourse: this.state.userCourse,
              setUserCourse: this.setUserCourse })}
          />
          <ListItem
            leftIcon={{ name: "today" }}
            key="quota"
            title="每日任务"
            subtitle={this.state.userCourse.quota || " "}
            onPress={() => navigate("Quota", {
              userCourse: this.state.userCourse,
              setUserCourse: this.setUserCourse
            })}
          />
          <ListItem
            leftIcon={{ name: "trending-up" }}
            key={user.id}
            title="词汇量测试"
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
            subtitle={DeviceInfo.getVersion()}
            hideChevron
          />
        </List>
        {CleanCache}
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
                  { text: "退出", onPress: () => { axios.get(LOUGOUT_URL).then(() => Actions.login({ type: ActionConst.RESET })); } },
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
  Post: { screen: PostScreen },
  Quota: { screen: QuotaScreen }
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
