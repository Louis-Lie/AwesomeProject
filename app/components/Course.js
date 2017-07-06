import React, { Component } from "react";

import {
  ActivityIndicator,
  Text,
  StyleSheet,
  View
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { Button, Card } from "react-native-elements";
import * as Progress from "react-native-progress";

import { colors, window } from "../styles/common";
import fetcher from "../utils/fetcher";

class Course extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userCourse: null,
      task: null,
      isLoading: true
    };

    fetcher.get("/course/user_courses/?active=1").then((res) => {
      const data = res.data;
      if (data.results.length) {
        this.setState({ userCourse: data.results[0] });
        const course = this.state.userCourse.course;
        const taskUrl = `/course/courses/${course.id}/task/`;
        fetcher.get(taskUrl).then((res2) => {
          const data2 = res2.data;
          this.setState({ task: data2, isLoading: false });
        });
      } else {
        // TODO: render no user course
      }
    });

    this.startLearning = this.startLearning.bind(this);
  }

  startLearning() {
    this.props.startLearning(this.state.userCourse.course, this.state.task);
  }


  render() {
    const userCourse = this.state.userCourse;
    const course = userCourse && userCourse.course;

    const task = this.state.task;
    const numToday = (task && task["0"].length + task["1"].length + task["2"].length) || 0;
    let Preview = null;
    let numLearned = 0;
    let taskTitle = "";
    if (task) {
      if (task["0"].length) {
        numLearned = numToday - task["0"].length;
        taskTitle = "今日任务：";
      } else if (task["1"].length) {
        // TODO add a header display finished
        Preview = (<View style={styles.preview}>
          <Text style={{ color: colors.textColor }}>预习完成</Text>
          <Icon name="star" size={16} color="#FCE38A" />
        </View>);
        numLearned = numToday - task["1"].length;
        taskTitle = "听写：";
      }
    }
    console.log(numLearned, numToday);
    // const coverUrl = (course && course.cover) || "";
    let button = null;
    if (this.state.isLoading) {
      button = <View><ActivityIndicator /></View>;
    } else {
      button = (<Button
        backgroundColor={colors.buttonColor}
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

          {Preview}
          <View style={styles.center}>
            <Text style={styles.taskTitle}>
              {taskTitle} {numLearned} / {numToday}
            </Text>
            <Progress.Circle
              style={styles.circle}
              size={140}
              color={"#FFCA61"}
              thickness={6}
              progress={(numToday && numLearned / numToday) || 0}
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
  preview: {
    flexDirection: "row",
    alignItems: "center"
  },
  circle: {
    marginTop: 20,
    marginBottom: 25
  }
});
export default Course;
