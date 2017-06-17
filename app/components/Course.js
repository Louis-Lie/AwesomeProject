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
      this.setState({user_course: data});
    })
    .catch((error) => {
      console.warn(error);
    });
  }

  render(){

    return (
      <Card
        title='HELLO WORLD'
        image={require('../images/pic2.png')}>
        <Text style={{marginBottom: 10}}>
          The idea with React Native Elements is more about component structure than actual design.
        </Text>
        <Button
          icon={{name: 'code'}}
          backgroundColor='#03A9F4'
          buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
          title='VIEW NOW' />
      </Card>
    )
  }
}

export default Course;
