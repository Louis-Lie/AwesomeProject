import React, { Component } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from "react-native";

import {
  RkText,
  RkTextInput,
  RkAvoidKeyboard,
  RkStyleSheet
} from "react-native-ui-kitten";
import Icon from "react-native-vector-icons/FontAwesome";

import { Button } from "react-native-elements";
import { colors } from "styles/common";
import fetcher from "utils/fetcher";

const axios = require("axios");
const ImagePicker = require("react-native-image-picker");

const ACCOUNT_URL = "https://souka.io/accounts/setting/";
const AVATAR_URL = "https://souka.io/accounts/avatar/";

class SettingScreen extends Component {
  static navigationOptions = {
    title: "账号设置",
    tabBarLabel: "我",
    tabBarIcon: ({ tintColor }) => (
      <Icon name="user-o" size={24} color={tintColor} />
    ),
    headerStyle: {
      backgroundColor: colors.primaryColor,
    },
    headerTintColor: "white",
  }

  constructor(props) {
    super(props);
    const user = this.props.navigation.state.params.user;
    this.state = {
      avatarSource: { uri: user.avatarUrl },
      username: user.username,
      nickname: user.nickname,
      email: user.email,
      bio: user.bio
    };

    this.selectAvatar = this.selectAvatar.bind(this);
    this.submit = this.submit.bind(this);
  }

  submit() {
    console.log("submit profile", this.state);
    const data = {
      username: this.state.username,
      nickname: this.state.nickname,
      email: this.state.email,
      bio: this.state.bio
    };
    fetcher.post(ACCOUNT_URL, data).then((res) => {
      Alert.alert("保存成功");
    });

    const user = this.props.navigation.state.params.user;
    const setUser = this.props.navigation.state.params.setUser;
    user.username = this.state.username;
    user.name = this.state.nickname || this.state.username;
    setUser(user);
  }

  selectAvatar() {
    const options = {
      title: "选择头像",
      storageOptions: {
        skipBackup: true,
        path: "images"
      }
    };

    ImagePicker.showImagePicker(options, (response) => {
      console.log("Response = ", response);

      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        const source = { uri: response.uri };

      // You can also display the image using data:
      // let source = { uri: 'data:image/jpeg;base64,' + response.data };
        this.setState({
          avatarSource: source
        });
        const data = new FormData();
        data.append("avatar", {
          uri: response.uri,
          type: "image/jpeg",
          name: response.fileName
        });
        axios.post(AVATAR_URL, data, {
          headers: {
            REFERER: "https://souka.io",
            Accept: "application/json",
          },
        });

        const user = this.props.navigation.state.params.user;
        const setUser = this.props.navigation.state.params.setUser;
        user.avatarUrl = response.uri;
        setUser(user);
      }
    });
  }

  render() {
    return (
      <ScrollView style={styles.root}>
        <RkAvoidKeyboard>
          <View style={styles.header}>
            <TouchableHighlight
              underlayColor="transparent"
              onPress={this.selectAvatar}
            >
              <Image
                style={styles.avatar}
                source={this.state.avatarSource}
              />
            </TouchableHighlight>
            <Text style={styles.nickname}>{this.state.nickname || this.state.username}</Text>
          </View>
          <View style={styles.section}>
            <View style={[styles.row, styles.heading]}>
              <RkText rkType="header6 primary">INFO</RkText>
            </View>
            <View style={styles.row}>
              <RkTextInput
                inputStyle={{
                  height: 45
                }}
                label="用户名"
                value={this.state.username}
                rkType="right clear"
                onChangeText={text => this.setState({ username: text })}
              />
            </View>
            <View style={styles.row}>
              <RkTextInput
                label="昵称"
                inputStyle={{
                  height: 45
                }}
                value={this.state.nickname}
                onChangeText={text => this.setState({ nickname: text })}
                rkType="right clear"
              />
            </View>
            <View style={styles.row}>
              <RkTextInput
                label="邮箱"
                inputStyle={{
                  height: 45
                }}
                value={this.state.email}
                keyboardType="email-address"
                onChangeText={text => this.setState({ email: text })}
                rkType="right clear"
              />
            </View>
            <View>
              <Text style={styles.label}>个人介绍</Text>
              <TextInput
                style={styles.bio}
                multiline
                placeholder="よろしく"
                value={this.state.bio}
                onChangeText={text => this.setState({ bio: text })}
              />
            </View>
          </View>
          <Button
            style={{ marginHorizontal: 16,
              marginBottom: 32 }}
            backgroundColor={colors.buttonColor}
            onPress={this.submit}
            title="保存"
          />
        </RkAvoidKeyboard>

      </ScrollView>
    );
  }
}

let styles = RkStyleSheet.create(theme => ({
  root: {
    backgroundColor: "white",
    padding: 15,
  },
  header: {
    alignItems: "center",
  },
  section: {
    marginVertical: 65,
    backgroundColor: "white"
  },
  heading: {
    paddingBottom: 12.5
  },
  row: {
    height: 60,
    flexDirection: "row",
    paddingHorizontal: 17.5,
    borderBottomWidth: 1,
    borderColor: "#eee",
    alignItems: "center",
    justifyContent: "space-between",
  },
  button: {
    marginHorizontal: 16,
    marginBottom: 32
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  nickname: {
    color: colors.textColor,
    margin: 10,
    fontSize: 18,
  },
  label: {
    margin: 15,
    color: "#7C7C7C"
  },
  bio: {
    flex: 1,
    marginLeft: 15,
    height: 40,
    fontSize: 14,
    color: "#2F2F2F"
  }
}));

export default SettingScreen;
