import React, { Component } from "react";
import {
  StyleSheet,
  WebView,
  View,
} from "react-native";
import DeviceInfo from "react-native-device-info";
import Icon from "react-native-vector-icons/FontAwesome";

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

  render() {
    return (
      <View style={styles.container}>
        <WebView
          userAgent={`${DeviceInfo.getUserAgent()}io.souka/${DeviceInfo.getVersion()}`}
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
