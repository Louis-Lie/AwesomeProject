import React, { Component } from "react";
import { StyleSheet, View, WebView } from "react-native";
import { Actions, ActionConst } from "react-native-router-flux";

// Change these to reflect
const LOGIN_URL = "https://souka.io/accounts/login/";
const HOME_URL = "https://souka.io/";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF",
  }
});

class AuthLogin extends Component {
  constructor(props) {
    super(props);
    this.onNavigationStateChange = this.onNavigationStateChange.bind(this);
  }

  onNavigationStateChange(navState) {
    if (navState.url === HOME_URL) {
      this.setState({
        loggedIn: true,
      });
      Actions.main({ type: ActionConst.REPLACE });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <WebView
          automaticallyAdjustContentInsets={false}
          style={styles.webView}
          source={{ uri: LOGIN_URL }}
          javaScriptEnabled
          onNavigationStateChange={this.onNavigationStateChange}
          startInLoadingState
          scalesPageToFit
        />
      </View>
    );
  }
}

export default AuthLogin;
