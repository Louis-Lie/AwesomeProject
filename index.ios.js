/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

import {
  TabNavigator,
} from 'react-navigation';

import HomeStack from './app/screens/Home';
import ReadScreen from './app/screens/Read';
import ForumScreen from './app/screens/Forum';
import ProfileScreen from './app/screens/Profile';

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
});

AppRegistry.registerComponent('AwesomeProject', () => App);
