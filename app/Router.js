import React, { Component } from "react";
import { View } from "react-native";
import { Scene, Router } from "react-native-router-flux";
import {
  TabNavigator,
} from "react-navigation";
import CookieManager from "react-native-cookies";

import { updateCSRF } from "./utils/fetcher";
import { colors } from "./styles/common";
import App from "./screens/Index";
import AuthLogin from "./screens/AuthLogin";

const HOME_URL = "https://souka.io/";

class RouterComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      loadedCookie: false
    };
  }

  componentWillMount() {
    CookieManager.get(HOME_URL, (err, cookie) => {
      let isAuthenticated;
      if (cookie && cookie.hasOwnProperty("sessionid")) {
        isAuthenticated = true;
        updateCSRF();
      } else {
        isAuthenticated = false;
      }

      this.setState({
        loggedIn: isAuthenticated,
        loadedCookie: true
      });
    });
  }

  render() {
    if (this.state.loadedCookie) {
      return (
        <Router>
          <Scene key="login" component={AuthLogin} title="登录" initial={!this.state.loggedIn} />
          <Scene key="main" component={App} hideNavBar initial={this.state.loggedIn} />
        </Router>
      );
    } else {
      return (
        <View />
      );
    }
  }
}

export default RouterComponent;
