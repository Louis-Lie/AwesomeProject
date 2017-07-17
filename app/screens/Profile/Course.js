import React, { Component } from "react";
import {
  Alert,
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from "react-native";

import Icon from "react-native-vector-icons/FontAwesome";

import fetcher from "utils/fetcher";
import { colors } from "styles/common";


const COURSES_URL = "https://souka.io/course/courses/";


class CourseScreen extends Component {
  static navigationOptions = {
    title: "课程",
    tabBarLabel: "我",
    tabBarIcon: ({ tintColor }) => (
      <Icon name="user-o" size={24} color={tintColor} />
    ),
    headerStyle: {
      backgroundColor: colors.primaryColor,
    },
    headerTintColor: "white",
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      courses: [],
    };
  }

  componentWillMount() {
    this.fetchCourses();
  }

  fetchCourses() {
    fetcher.get(COURSES_URL).then((res) => {
      const courses = res.data.results;
      this.setState({ courses, isLoading: false });
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

    return (
      <ScrollView style={styles.container}>
        {
        this.state.courses.map((c, i) => (
          <TouchableHighlight
            key={c.id}
            underlayColor="transparent"
            onPress={() =>
              Alert.alert(
                c.name,
                "切换正在学习的课程",
                [
                  { text: "确认",
                    onPress: () => {
                      const userCourse = this.props.navigation.state.params.userCourse;
                      userCourse.course.name = c.name;
                      const setUserCourse = this.props.navigation.state.params.setUserCourse;
                      setUserCourse(userCourse);
                      fetcher.post("/course/user_courses/activate/", { course_id: c.id });
                    }
                  },
                  { text: "取消", onPress: () => console.log("Cancel Pressed"), style: "cancel" },
                ]
              )
            }
          >
            <View style={styles.course}>
              <Image
                style={styles.cover}
                resizeMode="cover"
                source={{ uri: c.cover }}
              />
              <View style={{ flexWrap: "wrap", flex: 1 }}>
                <Text style={styles.name}>{c.name}</Text>
                <Text style={styles.desc}>{c.desc}</Text>
              </View>
            </View>
          </TouchableHighlight>
          )
        )
      }
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 15,
  },
  course: {
    borderWidth: 0,
    flexDirection: "row",
    marginVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
    paddingBottom: 15
  },
  cover: {
    width: 64,
    height: 64,
    marginRight: 15
  },
  name: {
    color: colors.textColor,
    marginBottom: 5,
    fontSize: 16,
  },
  desc: {
    color: "#999",
    fontSize: 13
  }
});

export default CourseScreen;
