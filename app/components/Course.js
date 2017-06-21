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

  formatText(progress){
    console.log('progress', progress)
    return `今日任务： ${progress}`
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
        <View style={{alignItems:'center'}}>
          <View
            style={{
              marginBottom: 10,
              flexWrap: 'wrap',
              alignItems: 'flex-start',
              flexDirection:'row'}}
          >
            <Text
              style={{ fontSize: 18, color:"#48D6C7"}}
            >今日任务： {user_course && user_course.num_today_finished}/{user_course && user_course.quota}
            </Text>
          </View>

          <Progress.Circle
            size={160}
            color="#6BCFDF"
            progress={0.3}
            animated={false}
            showsText={true}
            textStyle={{fontSize: 20, color: "#0275D8"}}
          />
        </View>

        <Button
          style={{marginTop: 25}}
          icon={{name: 'code'}}
          backgroundColor='#6BCFDF' //'#6BCFDF' //'#5CB85C'
          buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
          title='开始学习' />
      </Card>
      </View>
    )
  }
}

export default Course;
