import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Button,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

class ForumScreen extends React.Component {
  static navigationOptions = {
    tabBarLabel: '社区',
    tabBarIcon: ({ tintColor }) => (
      <Icon name="comments-o" size={24} color={tintColor} />
    ),
  };

  render() {
    return (
      <Button
        onPress={() => this.props.navigation.goBack()}
        title="回主页"
      />
    );
  }
}

export default ForumScreen;
