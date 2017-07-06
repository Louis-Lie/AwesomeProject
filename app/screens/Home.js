import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Keyboard,
  StatusBar
} from "react-native";

import {
  StackNavigator,
} from "react-navigation";

import Icon from "react-native-vector-icons/FontAwesome";
import { SearchBar } from "react-native-elements";

import { colors } from "../styles/common";
import fetcher from "../utils/fetcher";
import SearchResult from "../components/SearchResult";
import Course from "../components/Course";
import Quote from "../components/Quote";
import LearningScreen from "./Learning";


class HomeScreen extends Component {
  static navigationOptions = {
    title: "单词",
    tabBarLabel: "单词",
    tabBarIcon: ({ tintColor }) => (
      <Icon name="clone" size={24} color={tintColor} />
    ),
    headerStyle: {
      backgroundColor: colors.primaryColor,
    },
    headerTitleStyle: {
      color: "white",
    }
  };

  constructor(props) {
    super(props);
    this.state = { searching: false, searchResult: [] };

    this.startLearning = this.startLearning.bind(this);
    this.setSearchText = this.setSearchText.bind(this);
    this.searchStart = this.searchStart.bind(this);
    this.searchEnd = this.searchEnd.bind(this);
  }


  setSearchText(query) {
    console.log("search: ", query);
    if (!query) {
      this.setState({ searchResult: [] });
      return;
    }
    fetcher.get(`/vocab/entry/?word=${query}`).then((res) => {
      const searchResult = res.data;
      this.setState({ searchResult });
    });
  }

  searchStart() {
    this.setState({ searching: true });
  }

  searchEnd() {
    Keyboard.dismiss;
    this.setState({ searching: false });
  }

  startLearning(course, task) {
    console.log("start learning course: ", this);
    this.props.navigation.navigate("Learning", { course, task });
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          barStyle="light-content"
        />
        <SearchBar
          round
          lightTheme
          placeholder="搜索日语单词"
          onChangeText={this.setSearchText}
          clearButtonMode="while-editing"
          onFocus={this.searchStart}
          onBlur={this.searchEnd}
        />
        <SearchResult dataSource={this.state.searchResult} />
        <Course startLearning={this.startLearning} />
        <Quote />
      </View>
    );
  }
}

const HomeStack = StackNavigator({
  Home: { screen: HomeScreen },
  Learning: { screen: LearningScreen }
},
  {
    mode: "modal"
  }
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundColor,
    flex: 1
  }
});

export default HomeStack;
