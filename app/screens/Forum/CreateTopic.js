import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { Button } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import { colors } from "styles/common";
import fetcher from "utils/fetcher";

const NODES = ["全部", "学习", "日剧", "动漫", "游戏", "小说"];

class CreateTopicScreen extends Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
    title: navigation.state.params.node,
    tabBarLabel: "社区",
    tabBarIcon: ({ tintColor }) => (
      <Icon name="comments-o" size={24} color={tintColor} />
    ),
    headerTintColor: "white",
    headerStyle: {
      backgroundColor: colors.primaryColor,
    },
  })

  constructor(props) {
    super(props);
    this.state = { title: "", content: "", submited: false };
    this.submit = this.submit.bind(this);
  }

  submit() {
    if (this.state.submited) return;

    this.setState({ submited: true });
    const node = this.props.navigation.state.params.node;
    const title = this.state.title;
    const content = this.state.content;
    console.log("submit topic", node, title, content);
    if (title.length && content.length) {
      const topicUrl = "/forum/topics/";
      fetcher.post(topicUrl, { title, content, node }).then((res) => {
        this.props.navigation.state.params.onGoBack();
        this.props.navigation.goBack();
      });
    }
  }
  render() {
    console.log(this, this.props.navigation);

    return (
      <View style={styles.container}>
        <Text style={styles.label}>标题</Text>
        <TextInput
          style={styles.title}
          autoFocus
          onChangeText={title => this.setState({ title })}
        />
        <Text style={styles.label}>内容</Text>
        <TextInput
          style={styles.content}
          multiline
          onChangeText={content => this.setState({ content })}
        />
        <Button
          backgroundColor={colors.buttonColor}
          buttonStyle={{ borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0 }}
          onPress={this.submit}
          title="发送"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 15
  },
  label: {
    color: "#aaa",
    marginBottom: 5,
  },
  title: {
    color: colors.textColor,
    height: 40,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 10,
    fontSize: 15,
    padding: 5,
  },
  content: {
    color: colors.textColor,
    fontSize: 15,
    height: 120,
    borderWidth: 1,
    borderColor: "#eee",
    paddingVertical: 0,
    padding: 5,
    marginBottom: 20,
  }
});

export default CreateTopicScreen;
