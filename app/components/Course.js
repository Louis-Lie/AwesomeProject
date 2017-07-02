import React, { Component } from "react";

import {
  ActivityIndicator,
  Image,
  Text,
  StyleSheet,
  View
} from "react-native";
import { Card, Button } from "react-native-elements";
import * as Progress from "react-native-progress";

import { colors } from "../styles/common";
import fetcher from "../utils/fetcher";

class Course extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userCourse: null,
      isLoading: true
    };

    const url = "https://souka.io/course/user_courses/?active=1";
    fetcher.get(url, (data) => {
      this.setState({ userCourse: data.results[0], isLoading: false });
    });

    this.startLearning = this.startLearning.bind(this);
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
      <Card
        title={(course && course.name) || "こんにちは"}
      >
        <View style={styles.center}>
          <View style={styles.inline}>
            <Text style={styles.taskText}>
                今日任务：
            </Text>
            <Text style={styles.taskNum}>
              {userCourse && userCourse.num_today_finished}/{userCourse && userCourse.quota}
            </Text>
          </View>

          <Progress.Circle
            size={160}
            color={colors.tintColor}
            progress={0.3}
            animated={false}
            showsText
            textStyle={{ fontSize: 20, color: "#0275D8" }}
          />
        </View>

        {button}
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  center: {
    alignItems: "center"
  },
  inline: {
    flexWrap: "wrap",
    alignItems: "flex-start",
    flexDirection: "row"
  },
  taskText: {
    fontSize: 18,
    color: "#555",
  },
  taskNum: {
    fontSize: 18, color: colors.tintColor
  }
});
export default Course;
