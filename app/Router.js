import React, { Component } from 'react';
import { View } from 'react-native';
import { Scene, Router, ActionConst } from 'react-native-router-flux';
import {
  TabNavigator,
} from 'react-navigation';
import CookieManager from 'react-native-cookies';

import AuthLogin from './screens/AuthLogin'
import HomeStack from './screens/Home';
import ReadScreen from './screens/Read';
import ForumScreen from './screens/Forum';
import ProfileScreen from './screens/Profile';
import LearningPage from './screens/LearningPage';

const HOME_URL = "https://souka.io/";

const App = TabNavigator({
  Home: {
    screen: HomeStack,
  },
  Read: {
    screen: ReadScreen,
  },
  Forum: {
    screen: ForumScreen,
  },
  Profile: {
    screen: ProfileScreen,
  }
},{
  tabBarOptions: {
    activeTintColor: '#6BCFDF',
  }
});

class RouterComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      loadedCookie: false
    };
  }

  componentWillMount () {
    CookieManager.get(HOME_URL, (err, cookie) => {
      let isAuthenticated;
      // If it differs, change `cookie.remember_me` to whatever the name for your persistent cookie is!!!
      if (cookie && cookie.hasOwnProperty('sessionid')) {
        isAuthenticated = true;
      }
      else {
        isAuthenticated = false;
      }

      this.setState({
        loggedIn: isAuthenticated,
        loadedCookie: true
      });
    });
  }

  render(){
    if (this.state.loadedCookie) {
      return (
        <Router>
          <Scene key="login" component={AuthLogin} title="登录" initial={!this.state.loggedIn}/>
          <Scene key="main" component={App} hideNavBar={true} initial={this.state.loggedIn}/>
          <Scene key="learning" component={LearningPage} title="学习" />
        </Router>
        )
    }
    else {
      return (
        <View></View>
      );
    }
  }
}

export default RouterComponent;
