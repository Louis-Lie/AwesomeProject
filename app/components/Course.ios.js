import React, { Component } from "react";

import {
  ActivityIndicator,
  AppState,
  Text,
  TouchableHighlight,
  StyleSheet,
  View
} from "react-native";
import { NavigationActions } from "react-navigation";
import Icon from "react-native-vector-icons/FontAwesome";
import { Button, Card } from "react-native-elements";
import * as Progress from "react-native-progress";

import { colors } from "styles/common";
import fetcher from "utils/fetcher";


class Course extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userCourse: null,
      task: null,
      isLoading: true,
      appState: AppState.currentState
    };

    fetcher.get("/course/user_courses/?active=1").then((res) => {
      const data = res.data;
      if (data.results.length) {
        this.setState({ userCourse: data.results[0] }, () => {
          this.updateTasks();
        });
      } else {
        // TODO: render no user course
      }
    });

    this.startLearning = this.startLearning.bind(this);
    this.updateTasks = this.updateTasks.bind(this);
    this.selectCourse = this.selectCourse.bind(this);
    this.resetCourse = this.resetCourse.bind(this);
  }

  componentDidMount() {
    AppState.addEventListener("change", this.handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener("change", this.handleAppStateChange);
  }

  handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === "active") {
      console.log("App has come to the foreground!");
      this.updateTasks();
    }
    this.setState({ appState: nextAppState });
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

  selectCourse() {
    console.log("select course");
    const navigateAction = NavigationActions.navigate({
      routeName: "Profile",
      params: {},
      action: NavigationActions.navigate({ routeName: "Course" })
    });
    this.props.navigation.dispatch(navigateAction);
  }

  resetCourse() {
    console.log("reset course");
    const userCourse = this.state.userCourse;
    fetcher.put(`course/user_courses/${userCourse.id}/reset/`).then((res) => {
      this.updateTasks();
    });
  }

  renderPreviewProgress(task) {
    const taskTitle = "今日任务";
    const numToday = (task && task["0"].length + task["1"].length + task["2"].length) || 0;
    const numLearned = numToday - task["0"].length;
    return (<View style={styles.center}>
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
  }

  renderDictationProgress(task) {
    const numToday = (task && task["0"].length + task["1"].length + task["2"].length) || 0;
    const numLearned = numToday - task["1"].length;
    return (<View style={styles.center}>
      <Text style={styles.taskTitle}>
        听写 {numLearned} / {numToday}
      </Text>
      <Progress.Circle
        style={styles.circle}
        size={140}
        color={colors.yellow}
        thickness={6}
        progress={(numToday && numLearned / numToday) || 0}
        animated={false}
        showsText
        textStyle={{ fontSize: 20, color: "#537780" }}
      />
    </View>);
  }

  renderReviewProgress() {
    return (<View style={styles.center}>
      <Progress.Circle
        style={styles.circle}
        size={140}
        color={colors.yellow}
        thickness={6}
        progress={1}
        animated={false}
        showsText
        textStyle={{ fontSize: 20, color: "#537780" }}
      />
    </View>);
  }
  render() {
    const userCourse = this.state.userCourse;
    const course = userCourse && userCourse.course;

    const task = this.state.task;
    const numToday = (task && task["0"].length + task["1"].length + task["2"].length) || 0;
    const numLearned = 0;
    const taskTitle = "今日任务";
    let buttonColor = colors.buttonColor;
    let buttonTitle = "开始学习";
    let ButtonView = null;
    let PreviewHeader = null;
    let LearningProgress = null;
    let reviewFinished = false;
    if (task) {
      if (task["0"].length) {
        LearningProgress = this.renderPreviewProgress(task);
      } else if (task["1"].length) {
        PreviewHeader = (<View style={styles.preview}>
          <Text style={styles.taskTitle}>预习完成</Text>
          <Icon name="star" size={18} color={colors.yellow} style={{ marginLeft: 5 }} />
        </View>);
        LearningProgress = this.renderDictationProgress(task);
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
        LearningProgress = this.renderReviewProgress();

        if (task["2"].length === task["3"].length) {
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
        }
      } else if (userCourse.finished) {
        PreviewHeader = (<View style={{ alignItems: "center" }}>
          <Text style={styles.taskTitle}>课程已学完</Text>
          <View style={styles.finishStars}>
            <Icon name="star" size={18} color={colors.yellow} style={{ marginLeft: 5 }} />
            <Icon name="star" size={18} color={colors.yellow} style={{ marginLeft: 5 }} />
            <Icon name="star" size={18} color={colors.yellow} style={{ marginLeft: 5 }} />
          </View>
        </View>);

        ButtonView = (<View>
          <Button
            backgroundColor="#3D84A8"
            buttonStyle={{ borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0 }}
            onPress={this.selectCourse}
            title="切换课程"
          />

          <TouchableHighlight
            onPress={this.resetCourse}
            style={styles.finishHintWrap}
            underlayColor="transparent"
          >
            <Text
              style={styles.finishHint}
            >再学一遍</Text>
          </TouchableHighlight>
        </View>);
      }
    }

    if (this.state.isLoading) {
      if (task) {
        ButtonView = <ActivityIndicator />;
      } else {
        ButtonView = (<View style={{ alignItems: "center" }}>
          <Progress.Circle
            style={styles.circle}
            size={140}
            color={colors.yellow}
            thickness={6}
            indeterminate
          />
        </View>);
      }
    }

    if (!reviewFinished && !ButtonView) {
      ButtonView = (<Button
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
          containerStyle={styles.card}
        >
          {PreviewHeader}
          {LearningProgress}
          {ButtonView}
        </Card>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 0,
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  finishStars: {
    flexDirection: "row",
    marginVertical: 15
  },
  finishHintWrap: {
    alignItems: "center"
  },
  finishHint: {
    marginVertical: 20,
    fontSize: 13,
    color: colors.textColor,
    textDecorationLine: "underline"
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
    marginVertical: 10
  }
});
export default Course;
