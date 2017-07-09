import React, { Component, } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableHighlight,
  View,
} from "react-native";
import store from "react-native-simple-store";
import Icon from "react-native-vector-icons/FontAwesome";

import Preview from "../components/Preview";
import Dictation from "../components/Dictation";
import Review from "../components/Review";
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
    const task = this.props.navigation.state.params.task;
    this.state = {
      nextStatus: null,
      task,
      course,
      index: 0,
      entries: [],
      isLoading: true,
      learning_type: "",
      right_ids: [],
      wrong_ids: []
    };
    this.prevTask = this.prevTask.bind(this);
    this.nextTask = this.nextTask.bind(this);
  }

  componentWillMount() {
    this.prepareTask();
  }
  prepareTask() {
    const task = this.state.task;
    const taskIds = [].concat.apply([], [task["0"], task["1"], task["2"], task["3"]]);
    const numToday = taskIds.length;
    let index = 0;
    let learningType = null;
    if (task["0"].length) {
      learningType = "preview";
      index = numToday - task["0"].length;
    } else if (task["1"].length) {
      learningType = "dictation";
      index = numToday - task["1"].length;
    } else {
      learningType = "review";
      index = numToday - task["2"].length;
    }

    const title = {
      preview: "预习",
      dictation: "听写",
      review: "复习",
    }[learningType];
    const nextStatus = {
      preview: 1,
      dictation: 2,
      revie2: 3
    }[learningType];

    this.props.navigation.setParams({ title });
    this.setState({
      learningType,
      index,
      nextStatus
    });

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
    console.log("nextTask", this);
    if (this.state.index === this.state.entries.length - 1) {
      console.log("finished");
    } else {
      const entry = this.state.entries[this.state.index];
      const taskUrl = `/course/courses/${this.state.course.id}/task/`;
      const nextStatus = this.state.nextStatus;
      const data = {};
      data[nextStatus] = [entry.id];
      fetcher.put(taskUrl, data);
      const index = this.state.index + 1;
      this.setState({ index, });
    }
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator />
        </View>
      );
    }

    const LearningMode = {
      preview: Preview,
      dictation: Dictation,
      review: Review,
    }[this.state.learningType];

    const task = this.state.task;
    const numToday = (task && task["0"].length + task["1"].length + task["2"].length) || 0;

    return (
      <View style={styles.container}>
        <ProgressBar
          index={this.state.index}
          length={numToday}
        />
        <LearningMode
          navigation={this.props.navigation}
          index={this.state.index}
          entries={this.state.entries}
          prevTask={this.prevTask}
          nextTask={this.nextTask}
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
