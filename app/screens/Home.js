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
import {  List, ListItem, SearchBar } from 'react-native-elements';

import SearchResult from '../components/searchResult'
import Course from '../components/Course'
import LearningPage from './LearningPage'


class HomeScreen extends React.Component {
  constructor(props) {
      super(props);
      this.state = {searching: false, searchResult:[]};
  };

  static navigationOptions = {
    title: "单词",
    tabBarLabel: '单词',
    tabBarIcon: ({ tintColor }) => (
      <Icon name="clone" size={24} color={tintColor} />
    )
  };

  setSearchText(query){
    console.log('search: ', query)
    if (!query){
      this.setState({searchResult:[]});
      return;
    }
    fetch("https://souka.io/vocab/entry/?word="+query, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
    .then((response) => response.json())
    .then((data) => {
      this.setState({searchResult: data});
    })
    .catch((error) => {
      console.warn(error);
    });
  }

  searchStart(){
    this.setState({searching: true})
  }

  searchEnd(){
    Keyboard.dismiss;
    this.setState({searching: false})
  }

  start_learning(course){
    console.log('start learning course: ', course)
    this.props.navigation.navigate('LearningPage')
  }

  render() {
    const { navigate } = this.props.navigation;

    return (
        <View style={styles.container}>
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
          <SearchResult dataSource={this.state.searchResult}/>
          <Course start_learning={this.start_learning.bind(this)}/>
        </View>
    );
  }
}
const HomeStack = StackNavigator({
  Home: { screen: HomeScreen },
  LearningPage: {screen: LearningPage}
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F2F1ED",
    flex: 1
  }
});

export default HomeStack;
