import React, { Component } from "react";
import { StyleSheet, View, WebView } from "react-native";
import { Actions, ActionConst } from "react-native-router-flux";
import { updateCSRF } from "../utils/fetcher";

// Change these to reflect
const LOGIN_URL = "https://souka.io/accounts/login/";
const HOME_URL = "https://souka.io/";

class AuthLogin extends Component {
  constructor(props) {
    super(props);
    this.onNavigationStateChange = this.onNavigationStateChange.bind(this);
  }

  onNavigationStateChange(navState) {
    console.log("nav state change: ---> ", navState);
    if (navState.url === HOME_URL || navState.url === `${HOME_URL}main/`) {
      updateCSRF();
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF",
  }
});

export default AuthLogin;
