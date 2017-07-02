import React, { Component, } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableHighlight,
  View,
} from "react-native";
import store from "react-native-simple-store";
import Icon from "react-native-vector-icons/FontAwesome";

import SwipeCards from "../components/SwipeCards";
import Entry from "../components/Entry";
import ProgressBar from "../components/ProgressBar";
import { colors, window, } from "../styles/common";
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
      entries: [],
      course,
      isLoading: true,
      learning_type: "",
      right_ids: [],
      wrong_ids: [],
      current_tasks: [],
      current_index: 0,
    };

    this.handleYup = this.handleYup.bind(this);
    this.handleNope = this.handleNope.bind(this);
  }

  componentWillMount() {
    const taskUrl = `https://souka.io/course/courses/${this.state.course.id}/task/`;
    fetcher.get(taskUrl, (data) => {
      this.setState({ task: data, });
      this.prepareTask();
    });
  }

  prepareTask() {
    const task = this.state.task;
    let taskIds = null;
    let learningType = null;
    if (task["0"].length) {
      learningType = "memory";
      taskIds = task["0"];
    } else if (task["1"].length) {
      learningType = "dictation";
      taskIds = task["1"];
    } else {
      learningType = "review";
      taskIds = task["2"];
    }

    this.setState({
      learningType,
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
      const url = `https://souka.io/vocab/entry/?ids=${missIds.join(",")}`;
      fetcher.get(url, (data) => {
        store.save("entries", storedEntries.concat(data));
        this.setState({ current_tasks: entries.concat(data), isLoading: false, });
      });
    } else {
      this.setState({ current_tasks: entries, isLoading: false, });
    }
  }

  prevTask() {
    console.log("prevTask");
    if (this.state.current_index === 0) {
      return;
    }
    const index = this.state.current_index - 1;
    this.setState({ current_index: index, });
  }

  nextTask() {
    console.log("nextTask");
    const index = this.state.current_index + 1;
    if (index === this.state.current_tasks.length) {
      console.log("finished");
    } else {
      this.setState({ current_index: index, });
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

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator />
        </View>
      );
    }
    const tasks = this.state.current_tasks;

    return (
      <View style={styles.container}>
        <ProgressBar
          index={this.state.current_index}
          length={this.state.current_tasks.length}
        />

        <SwipeCards
          style={{ flex: 1, }}
          cards={tasks}
          renderCard={cardData => <Entry entry={cardData} />}
          handleYup={this.handleYup}
          handleNope={this.handleNope}
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
