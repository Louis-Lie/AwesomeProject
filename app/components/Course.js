import React, { Component } from "react";

import {
  ActivityIndicator,
  Image,
  Text,
  StyleSheet,
  View
} from "react-native";
import { Button, Card, Rating } from "react-native-elements";
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

  formatPreview(progress) {
    return progress;
  }

  formatDictation(progress) {
    return progress;
  }
  startLearning() {
    this.props.startLearning(this.state.userCourse.course);
  }

  render() {
    const userCourse = this.state.userCourse;
    const course = userCourse && userCourse.course;
    const coverUrl = (course && course.cover) || "";
    let button = null;
    if (this.state.isLoading) {
      button = <View style={{ marginTop: 20 }}><ActivityIndicator /></View>;
    } else {
      button = (<Button
        style={{ marginTop: 25 }}

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
              今日任务
            </Text>
            <View style={styles.inlineTask}>
              <View style={{ flex: 1, alignItems: "center" }}>
                <Progress.Circle
                  size={80}
                  color={colors.tintColor}
                  progress={0.3}
                  animated={false}
                  showsText
                  textStyle={{ fontSize: 20, color: "#537780" }}
                />
              </View>
              <View style={[styles.center, { flex: 1 }]}>
                <Text style={styles.taskNum}>
                  {userCourse && userCourse.num_today_finished}/{userCourse && userCourse.quota}
                </Text>
                <Text style={styles.taskText}>
                  预习
                </Text>
              </View>


            </View>

            <View style={styles.inlineTask}>
              <View style={{ flex: 1, alignItems: "center" }}>
                <Progress.Circle
                  size={80}
                  color={colors.tintColor}
                  progress={0}
                  animated={false}
                  showsText
                  textStyle={{ fontSize: 20, color: "#537780" }}
                />
              </View>
              <View style={[styles.center, { flex: 1 }]}>
                <Text style={styles.taskNum}>
                  {userCourse && userCourse.num_today_finished}/{userCourse && userCourse.quota}
                </Text>
                <Text style={styles.taskText}>
                  听写
              </Text>
              </View>

            </View>
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

  taskText: {
    fontSize: 16,
    color: "#ccc",
  },
  taskNum: {
    fontSize: 32,
    color: "#757A79"
  }
});
export default Course;
