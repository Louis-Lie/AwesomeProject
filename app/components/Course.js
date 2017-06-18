import React, { Component } from 'react';

import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Keyboard,
} from 'react-native';

import { Card, ListItem, Button } from 'react-native-elements'

class Course extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user_course: {}
    };

    fetch("https://souka.io/course/user_courses/?finished=false", {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
    .then((response) => response.json())
    .then((data) => {
      console.log('get courses: ', data)
      this.setState({user_course: data['results'][0]});
      console.log('set user course', this.state.user_course);
    })
    .catch((error) => {
      console.warn(error);
    });
  }

  render(){
    let user_course = this.state.user_course;
    let course = user_course.course;
    return (
      <Card
        title={course && course.name || "Hello World"}
      >
        <Text style={{marginBottom: 10}}>
          {course && course.desc}
        </Text>
        <Text>
          今日任务: {user_course.quota}， 已完成：{user_course.num_today_finished}
        </Text>
        <Button
          icon={{name: 'code'}}
          backgroundColor='#03A9F4'
          buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
          title='开始学习' />
      </Card>
    )
  }
}

export default Course;
