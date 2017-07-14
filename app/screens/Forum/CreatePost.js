import React, { Component } from "react";
import {
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import { Button } from "react-native-elements";
import KeyboardSpacer from "react-native-keyboard-spacer";
import Icon from "react-native-vector-icons/FontAwesome";
import { colors } from "styles/common";
import fetcher from "utils/fetcher";


class CreatePostScreen extends Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
    title: "创建回复",
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
    this.state = { topic: this.props.navigation.state.params.topic, content: "", submited: false };

    this.submit = this.submit.bind(this);
  }

  submit() {
    if (this.state.submited) return;

    this.setState({ submited: true });
    const topic = this.state.topic;
    const content = this.state.content;
    if (content.length) {
      const postUrl = `/forum/topics/${topic.id}/posts/`;
      fetcher.post(postUrl, { content }).then((res) => {
        this.props.navigation.state.params.onGoBack();
        this.props.navigation.goBack();
      });
    }
  }
  render() {
    console.log(this, this.props.navigation);

    return (
      <View style={styles.container}>
        <TextInput
          autoFocus
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
        <KeyboardSpacer />
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

  content: {
    fontSize: 15,
    color: colors.textColor,
    flex: 1,
    borderWidth: 1,
    borderColor: "#eee",
    padding: 5,
    marginBottom: 20,
  }
});

export default CreatePostScreen;
