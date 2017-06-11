import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Button,
  Keyboard,
} from 'react-native';

import {
  StackNavigator,
} from 'react-navigation';


import Icon from 'react-native-vector-icons/FontAwesome';
import { SearchBar } from 'react-native-elements';


class HomeScreen extends React.Component {
  constructor(props) {
      super(props);
      this.state = {searching: false, searchResult:[]};
  };

  static navigationOptions = {
    title: '单词'
  };

  setSearchText(query){
    console.log('search: ', query)
  };
  searchStart(){
    this.setState({searching: true})
  }
  searchEnd(){
    Keyboard.dismiss;
    this.setState({searching: false})
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
        <View>
          <SearchBar
            round
            lightTheme
  	        ref='searchBar'
  	        placeholder='搜索日语单词'
  	        onChangeText={this.setSearchText.bind(this)}
            clearButtonMode='while-editing'
            onFocus={() => this.searchStart()}
            onBlur={() => this.searchEnd()}
  	      />

        </View>
    );
  }
}
const HomeStack = StackNavigator({
  Home: { screen: HomeScreen },
});

export default HomeStack;
