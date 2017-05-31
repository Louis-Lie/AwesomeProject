import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Button,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

class ReadScreen extends React.Component {
  static navigationOptions = {
    tabBarLabel: '阅读',
    tabBarIcon: ({ tintColor }) => (
      <Icon name="rss" size={24} color={tintColor} />
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

export default ReadScreen;
