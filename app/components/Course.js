import React, { Component } from 'react';

import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';
import { Actions, ActionConst } from 'react-native-router-flux';
import * as Progress from 'react-native-progress';

import { colors } from "../styles/common.js";
import { Card, ListItem, Button } from 'react-native-elements';
import fetcher from '../utils/fetcher';

class Course extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user_course: {},
      isLoading: true
    };

    let url = 'https://souka.io/course/user_courses/?finished=false';
    fetcher.get(url, (data) => {
      this.setState({user_course: data['results'][0], isLoading: false});
    });
  }

  render(){
    let user_course = this.state.user_course;
    let course = user_course.course;
    let cover_url = course && course.cover || '';
    let button = null;
    if (this.state.isLoading) {
      button = <View style={{marginTop: 20}}><ActivityIndicator /></View>;
    } else {
      button = <Button
        style={{marginTop: 25}}

        backgroundColor= { colors.primaryColor }
        buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
        onPress={() => {this.props.start_learning(course)}}
        title='开始学习' />
    }
    return (
      <View>
        <Card
          title={course && course.name || "Hello World"}>
          <View style={{alignItems:'center'}}>
            <View
            style={{
              marginBottom: 10,
              flexWrap: 'wrap',
              alignItems: 'flex-start',
              flexDirection:'row'}}>
              <Text
                style={{ fontSize: 18, color:colors.tintColor}}>
                今日任务： {user_course && user_course.num_today_finished}/{user_course && user_course.quota}
              </Text>
            </View>

            <Progress.Circle
              size={160}
              color={ colors.tintColor }
              progress={0.3}
              animated={false}
              showsText={true}
              textStyle={{fontSize: 20, color: "#0275D8"}} />
          </View>

          {button}
          </Card>
        </View>
      )
  }
}

export default Course;
