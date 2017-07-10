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
    this.updateTasks = this.updateTasks.bind(this);
  }

  updateTasks() {
    this.setState({ isLoading: true });
    const course = this.state.userCourse.course;
    const taskUrl = `/course/courses/${course.id}/task/`;
    fetcher.get(taskUrl).then((res) => {
      const data = res.data;
      this.setState({ task: data, isLoading: false });
    });
  }

  startLearning() {
    this.props.startLearning(this.state.userCourse.course, this.state.task);
  }

  render() {
    const userCourse = this.state.userCourse;
    const course = userCourse && userCourse.course;

    const task = this.state.task;
    const numToday = (task && task["0"].length + task["1"].length + task["2"].length) || 0;
    let numLearned = 0;
    let taskTitle = "今日任务";
    let buttonColor = colors.buttonColor;
    let buttonTitle = "开始学习";
    let PreviewHeader = null;
    let LearningProgress = null;
    let reviewFinished = false;
    if (task) {
      if (task["0"].length) {
        numLearned = numToday - task["0"].length;
        LearningProgress = (<View style={styles.center}>
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
        </View>);
      } else if (task["1"].length) {
        numLearned = numToday - task["1"].length;
        taskTitle = "听写：";

        PreviewHeader = (<View style={styles.preview}>
          <Text style={styles.taskTitle}>预习完成</Text>
          <Icon name="star" size={18} color={colors.yellow} style={{ marginLeft: 5 }} />
        </View>);

        LearningProgress = (<View style={styles.center}>
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
        </View>);
      } else if (task["2"].length) {
        buttonTitle = "复习一下";
        buttonColor = "#3D84A8";
        PreviewHeader = (
          <View>
            <View style={styles.preview}>
              <Text style={styles.taskTitle}>预习完成</Text>
              <Icon name="star" size={18} color={colors.yellow} style={{ marginLeft: 5 }} />
            </View>
            <View style={styles.preview}>
              <Text style={styles.taskTitle}>听写完成</Text>
              <Icon name="star" size={18} color={colors.yellow} style={{ marginLeft: 5 }} />
            </View>
          </View>);
        LearningProgress = (<View style={styles.center}>
          <Progress.Circle
            style={styles.circle}
            size={140}
            color={"#FFCA61"}
            thickness={6}
            progress={1}
            animated={false}
            showsText
            textStyle={{ fontSize: 20, color: "#537780" }}
          />
        </View>);

        if (task["2"].length === task["2"].length) {
          reviewFinished = true;
          PreviewHeader = (
            <View>
              <View style={styles.preview}>
                <Text style={styles.taskTitle}>预习完成</Text>
                <Icon name="star" size={18} color={colors.yellow} style={{ marginLeft: 5 }} />
              </View>
              <View style={styles.preview}>
                <Text style={styles.taskTitle}>听写完成</Text>
                <Icon name="star" size={18} color={colors.yellow} style={{ marginLeft: 5 }} />
              </View>
              <View style={styles.preview}>
                <Text style={styles.taskTitle}>复习完成</Text>
                <Icon name="star" size={18} color={colors.yellow} style={{ marginLeft: 5 }} />
              </View>
            </View>);
          LearningProgress = (<View style={styles.center}>
            <Progress.Circle
              style={styles.circle}
              size={140}
              color={"#FFCA61"}
              thickness={6}
              progress={1}
              animated={false}
              showsText
              textStyle={{ fontSize: 20, color: "#537780" }}
            />
          </View>);
        }
      }
    }

    let button = null;
    if (this.state.isLoading) {
      button = <View><ActivityIndicator /></View>;
    } else if (!reviewFinished) {
      button = (<Button
        backgroundColor={buttonColor}
        buttonStyle={{ borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0 }}
        onPress={this.startLearning}
        title={buttonTitle}
      />);
    }

    return (
      <View>
        <Card
          title={(course && course.name) || "こんにちは"}
        >
          {PreviewHeader}
          {LearningProgress}
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
  preview: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  taskTitle: {
    color: colors.textColor,
    fontSize: 18
  },
  circle: {
    marginTop: 15,
    marginBottom: 20
  }
});
export default Course;
