import React, { Component } from "react";
import {
  Keyboard,
  StyleSheet,
  StatusBar,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import {
  StackNavigator,
} from "react-navigation";

import Icon from "react-native-vector-icons/FontAwesome";
import { SearchBar } from "react-native-elements";

import { colors } from "styles/common";
import fetcher from "utils/fetcher";
import SearchResult from "components/SearchResult";
import Course from "components/Course";
import Quote from "components/Quote";

import LearningScreen from "./Learning";
import EntryScreen from "./Entry";


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
    this.onGoBack = this.onGoBack.bind(this);
    this.onBackSearch = this.onBackSearch.bind(this);
  }


  onGoBack() {
    console.log("on go back", this);
    this.courseView.updateTasks();
  }

  onBackSearch() {
    console.log("back from search", this.searchBar);
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
    this.setState({ searching: false });
  }

  startLearning(course, task) {
    this.props.navigation.navigate("Learning", {
      course,
      task,
      onGoBack: this.onGoBack
    });
  }

  render() {
    let searchResult = null;
    if (this.state.searching) {
      searchResult = (<SearchResult
        dataSource={this.state.searchResult}
        navigation={this.props.navigation}
        onGoBack={this.onBackSearch}
      />);
    }

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <StatusBar
            barStyle="light-content"
          />
          <SearchBar
            ref={(c) => { this.searchBar = c; }}
            round
            lightTheme
            placeholder="搜索日语单词"
            onChangeText={this.setSearchText}
            clearButtonMode="while-editing"
            onFocus={this.searchStart}
            onBlur={this.searchEnd}
          />
          {searchResult}
          <Course
            ref={(c) => { this.courseView = c; }}
            navigation={this.props.navigation}
            startLearning={this.startLearning}
          />
          <Quote />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const HomeStack = StackNavigator({
  Home: { screen: HomeScreen },
  Learning: { screen: LearningScreen },
  Entry: { screen: EntryScreen },
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

export { HomeScreen };
export default HomeStack;
