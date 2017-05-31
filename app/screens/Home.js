import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Button,
  Keyboard,
} from 'react-native';


import Icon from 'react-native-vector-icons/FontAwesome';
import { SearchBar } from 'react-native-elements';


class HomeScreen extends React.Component {
  constructor(props) {
      super(props);
      this.state = {searching: false, searchResult:[]};
  };

  static navigationOptions = {
    tabBarLabel: '单词',
    // Note: By default the icon is only shown on iOS. Search the showIcon option below.
    tabBarIcon: ({ tintColor }) => (
      <Icon name="clone" size={24} color={tintColor} />
    ),
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

export default HomeScreen;
