import React, { Component, } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableHighlight,
  View,
} from "react-native";
import store from "react-native-simple-store";
import Icon from "react-native-vector-icons/FontAwesome";
import SwipeCards from "react-native-swipe-cards";

import Entry from "../components/Entry";
import ProgressBar from "../components/ProgressBar";
import { colors, } from "../styles/common";
import fetcher from "../utils/fetcher";


class LearningScreen extends Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
    title: (navigation.state.params && navigation.state.params.title) || "",
    tabBarLabel: "单词",
    tabBarIcon: ({ tintColor, }) => (
      <Icon name="clone" size={24} color={tintColor} />
    ),
    headerStyle: {
      backgroundColor: colors.primaryColor,
    },
    headerTitleStyle: {
      color: "white",
    },
    headerLeft: (
      <TouchableHighlight
        style={{ padding: 10, }}
        underlayColor={colors.primaryColor}
        onPress={() => { navigation.goBack(); }}
      >
        <Icon name="close" size={20} color="white" />
      </TouchableHighlight>
     ),
  })

  constructor(props) {
    super(props);
    const course = this.props.navigation.state.params.course;
    this.state = {
      task: {},
      index: 0,
      entries: [],
      course,
      isLoading: true,
      learning_type: "",
      right_ids: [],
      wrong_ids: []
    };

    this.handleYup = this.handleYup.bind(this);
    this.handleNope = this.handleNope.bind(this);
    this.handleMaybe = this.handleMaybe.bind(this);
  }

  componentWillMount() {
    const taskUrl = `/course/courses/${this.state.course.id}/task/`;
    fetcher.get(taskUrl).then((res) => {
      const task = res.data;
      this.setState({ task });
      this.prepareTask();
    });
  }

  prepareTask() {
    const task = this.state.task;
    const taskIds = [].concat.apply([], [task["0"], task["1"], task["2"], task["3"]]);
    const numToday = taskIds.length;
    let index = 0;
    let learningType = null;
    if (task["0"].length) {
      learningType = "memory";
      index = numToday - task["0"].length;
    } else if (task["1"].length) {
      learningType = "dictation";
      index = numToday - task["1"].length;
    } else {
      learningType = "review";
      index = numToday - task["2"].length;
    }

    this.setState({
      learningType,
      index
    });
    const title = {
      memory: "预习",
      dictation: "听写",
      review: "复习",
    }[learningType];
    this.props.navigation.setParams({ title, });

    store.get("entries").then((entries) => {
      const storedEntries = entries || [];
      console.log("get stored entries: ", storedEntries);
      this.fetchEntries(storedEntries, taskIds);
    });
  }

  fetchEntries(storedEntries, ids) {
    const entries = storedEntries.filter(e => ids.includes(e.id));
    const entryIds = entries.map(e => e.id);
    const missIds = ids.filter(i => !entryIds.includes(i));
    if (missIds.length) {
      const url = `/vocab/entry/?ids=${missIds.join(",")}`;
      fetcher.get(url).then((res) => {
        const data = res.data;
        store.save("entries", storedEntries.concat(data));
        this.setState({ entries: entries.concat(data), isLoading: false });
      });
    } else {
      this.setState({ entries, isLoading: false, });
    }
  }

  prevTask() {
    console.log("prevTask");
    if (this.state.index === 0) {
      return;
    }
    const index = this.state.index - 1;
    this.setState({ index, });
  }

  nextTask() {
    console.log("nextTask");
    if (this.state.index === this.state.entries.length - 1) {
      console.log("finished");
    } else {
      const entry = this.state.entries[this.state.index];
      const taskUrl = `/course/courses/${this.state.course.id}/task/`;
      fetcher.put(taskUrl, { 1: [entry.id] });
      const index = this.state.index + 1;
      this.setState({ index, });
    }
  }

  handleYup(card) {
    console.log("yup", card);
    this.prevTask();
  }

  handleNope(card) {
    console.log("nope", card);
    this.nextTask();
  }

  handleMaybe(card) {
    console.log(this, this.state);
    this.setState({
      current_index: this.state.entries.length - 2
    });
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator />
        </View>
      );
    }
    const entries = this.state.entries;
    const task = this.state.task;
    const numToday = (task && task["0"].length + task["1"].length + task["2"].length) || 0;

    return (
      <View style={styles.container}>
        <ProgressBar
          index={this.state.index}
          length={numToday}
        />

        <SwipeCards
          style={{ flex: 1, }}
          cards={entries}
          initial_index={this.state.index}
          renderCard={cardData => <Entry entry={cardData} />}
          renderNoMoreCards={() => <NoMoreCards />}
          handleYup={this.handleYup}
          handleNope={this.handleNope}
          handleMaybe={this.handleMaybe}
          hasMaybeAction
          yupText="上一个"
          nopeText="下一个"
        />
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
    alignItems: "center",
    justifyContent: "center",
  }
});

export default LearningScreen;
