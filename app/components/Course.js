import React, { Component } from "react";

import {
  ActivityIndicator,
  Image,
  Text,
  StyleSheet,
  View
} from "react-native";
import { Button, Card } from "react-native-elements";
import * as Progress from "react-native-progress";

import { colors } from "../styles/common";
import fetcher from "../utils/fetcher";

class Course extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userCourse: null,
      task: null,
      isLoading: true
    };

    const url = "https://souka.io/course/user_courses/?active=1";
    fetcher.get(url, (data) => {
      if (data.results.length) {
        this.setState({ userCourse: data.results[0] });
        const course = this.state.userCourse.course;
        const taskUrl = `https://souka.io/course/courses/${course.id}/task/`;
        fetcher.get(taskUrl, (data) => {
          this.setState({ task: data, isLoading: false });
        });
      } else {
        // TODO: render no user course
      }
    });

    this.startLearning = this.startLearning.bind(this);
    this.formatPreview = this.formatPreview.bind(this);
    this.formatDictation = this.formatDictation.bind(this);
  }

  startLearning() {
    this.props.startLearning(this.state.userCourse.course);
  }


  render() {
    const userCourse = this.state.userCourse;
    const course = userCourse && userCourse.course;

    const task = this.state.task;
    const numToday = (task && task["0"].length + task["1"].length + task["2"].length) || 0;
    const Preview = null;
    let numLearned = 0;
    let taskTitle = "";
    if (task["0"].length) {
      numLearned = numToday - task["0"].length;
      taskTitle = "今日任务";
    } else if (task["1"].length) {
      // TODO add a header display finished
      numLearned = numToday - task["1"].length;
      taskTitle = "听写";
    }
    // const coverUrl = (course && course.cover) || "";
    let button = null;
    if (this.state.isLoading) {
      button = <View><ActivityIndicator /></View>;
    } else {
      button = (<Button
        backgroundColor={colors.primaryColor}
        buttonStyle={{ borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0 }}
        onPress={this.startLearning}
        title="开始学习"
      />);
    }

    return (
      <View>
        <Card
          title={(course && course.name) || "こんにちは"}
        >
          <View style={styles.center}>
            <Text style={styles.taskTitle}>
              {taskTitle}: {numLearned} / {numToday}
            </Text>
            <Progress.Circle
              style={styles.circle}
              size={120}
              color={colors.tintColor}
              thickness={6}
              progress={1}
              animated={false}
              showsText
              textStyle={{ fontSize: 20, color: "#537780" }}
            />
          </View>
          {button}
        </Card>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  inlineTask: {
    flexDirection: "row",
    marginBottom: 20,
  },
  taskTitle: {
    color: "#757A79",
    fontSize: 18
  },
  circle: {
    marginTop: 20,
    marginBottom: 25
  }
});
export default Course;
