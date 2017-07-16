import React, { Component } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableHighlight,
  WebView,
  View,
} from "react-native";

import Icon from "react-native-vector-icons/FontAwesome";
import { Actions } from "react-native-router-flux";

import { colors } from "styles/common";

const VOCAB_URL = "https://souka.io/vocab/test/?mobile";

class VocabScreen extends Component {
  static navigationOptions = {
    title: "词汇量测试",
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
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <WebView
          automaticallyAdjustContentInsets={false}
          style={styles.webView}
          source={{ uri: VOCAB_URL }}
          javaScriptEnabled
          onNavigationStateChange={this.onNavigationStateChange}
          startInLoadingState
          scalesPageToFit
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  }
});
export default VocabScreen;
