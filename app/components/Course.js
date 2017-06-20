import React, { Component } from 'react';

import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  Keyboard,
} from 'react-native';

import { Card, ListItem, Button } from 'react-native-elements'
import * as Progress from 'react-native-progress';

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
    let cover_url = course && course.cover || '';
    return (
<View>
      <Card
        title={course && course.name || "Hello World"}

      >
        <View
          style={{ flexDirection:'row', flexWrap:'wrap', marginBottom: 20 }}
        >
          <Image
            style={{width: 100, height: 100, marginRight: 15}}
            source={{uri: cover_url }}
          />
          <View>
            <Text style={{marginBottom: 5}}>
              开始日期：{user_course && user_course.created_date}
            </Text>
            <Text>
              学习进度：{user_course && user_course.progress || 0}%
            </Text>
            <Text style={{marginTop: 15, marginBottom:5}}>
              今日任务：{user_course.num_today_finished}/{user_course.quota}
            </Text>
            <Progress.Bar progress={0.3} color="#6BCFDF" style={{alignSelf: 'stretch'}}/>
          </View>
        </View>

        <Button
        style={{marginTop: 25}}
          icon={{name: 'code'}}
          backgroundColor='#6BCFDF' //'#5CB85C'
          buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
          title='开始学习' />
      </Card>

        </View>
    )
  }
}

export default Course;
