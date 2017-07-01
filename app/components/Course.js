import React, { Component } from "react";

import {
  ActivityIndicator,
  Text,
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
      userCourse: {},
      isLoading: true
    };

    const url = "https://souka.io/course/user_courses/?finished=false";
    fetcher.get(url, (data) => {
      this.setState({ userCourse: data.results[0], isLoading: false });
    });

    console.log("this props", this.props);
    this.startLearning = this.startLearning.bind(this);
  }

  startLearning() {
    console.log("start learning in course", this, this.props);
    this.props.startLearning(this.state.userCourse.course);
  }

  render() {
    const userCourse = this.state.userCourse;
    const course = userCourse && userCourse.course;

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
          title={(course && course.name) || "Hello World"}
        >
          <View style={{ alignItems: "center" }}>
            <View
              style={{
                marginBottom: 10,
                flexWrap: "wrap",
                alignItems: "flex-start",
                flexDirection: "row" }}
            >
              <Text
                style={{ fontSize: 18, color: colors.tintColor }}
              >
                今日任务： {userCourse && userCourse.num_today_finished}/{userCourse && userCourse.quota}
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
      </View>
    );
  }
}

export default Course;
