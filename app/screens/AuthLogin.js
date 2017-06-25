'use strict';

import React,  { Component } from 'react';
import { StyleSheet, View, WebView } from 'react-native';
import { Actions, ActionConst } from 'react-native-router-flux'
import CookieManager from 'react-native-cookies';

// Change these to reflect
const LOGIN_URL = "https://souka.io/accounts/login/";
const HOME_URL = "https://souka.io/";

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  }
});

class AuthLogin extends Component {
  onNavigationStateChange (navState) {
    // If we get redirected back to the HOME_URL we know that we are logged in. If your backend does something different than this
    // change this line.
    if (navState.url == HOME_URL) {
      this.setState({
        loggedIn: true,
      });
      Actions.main({type: ActionConst.REPLACE});
    }
  }

  render () {
    // If we have completed loading the cookie choose to show Login WebView or the LoggedIn component, else just show an empty View.
    return (
      <View style={styles.container}>
        <WebView
          ref={'webview'}
          automaticallyAdjustContentInsets={false}
          style={styles.webView}
          source={{uri: LOGIN_URL}}
          javaScriptEnabled={true}
          onNavigationStateChange={this.onNavigationStateChange.bind(this)}
          startInLoadingState={true}
          scalesPageToFit={true}
        />
      </View>
    );
  }
}

export default AuthLogin;
