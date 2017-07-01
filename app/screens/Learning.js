import React,  { Component } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import store from 'react-native-simple-store';
import { NavigationActions } from 'react-navigation'
import { Card, ListItem, Button } from 'react-native-elements'
import { Actions, ActionConst } from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/FontAwesome';

import SwipeCards from '../components/SwipeCards';
import Entry from '../components/Entry';
import ProgressBar from '../components/ProgressBar';
import PlaceCard from '../components/PlaceCard';
import { colors, window } from '../styles/common';
import { sounds } from '../utils/soundPlayer'
import fetcher from '../utils/fetcher';


class LearningScreen extends Component {
  constructor(props) {
    super(props);
    let course = this.props.navigation.state.params.course;
    this.state = {
      task:{},
      entries:[],
      course: course,
      isLoading: true,
      learning_type:'',
      right_ids:[],
      wrong_ids:[],
      current_tasks:[],
      current_index:0
    }
  }

  static navigationOptions = ({ navigation, screenProps }) => ({
    title: navigation.state.params.title,
    tabBarLabel: '单词',
    tabBarIcon: ({ tintColor }) => (
      <Icon name="clone" size={ 24 } color={tintColor} />
    ),
    headerStyle: {
      backgroundColor: colors.primaryColor
    },
    headerTitleStyle:{
      color: 'white'
    },
    headerLeft: (
      <TouchableHighlight
        style={{ padding: 12}}
        underlayColor={colors.primaryColor}
        onPress={ () => { navigation.goBack()}} >
        <Icon name='close' size={18} color='white' />
      </TouchableHighlight>
     )
  })

  componentWillMount(){
    let task_url = `https://souka.io/course/courses/${this.state.course.id}/task/`;
    fetcher.get(task_url, (data) => {
      this.setState({task: data});
      this.prepareTask();
    })
  }

  prepareTask(){
    let task = this.state.task;
    let task_ids = null;
    if (task['0'].length) {
      learningType = 'memory';
      task_ids = task['0'];
    } else if (task['1'].length) {
      learningType = 'dictation';
      task_ids = task['1'];
    } else {
      learningType = 'review';
      task_ids =task['2']
    }

    this.setState({
      learningType: learningType,
    });
    let title = {
      memory: '预习',
      dictation: '听写',
      review: '复习'
    }[learningType];
    this.props.navigation.setParams({title: title})
    store.get('entries').then( entries => {
      let stored_entries = entries || [];
      console.log('get stored entries: ', stored_entries);
      this.fetchEntries(stored_entries, task_ids);
    });
  }

  fetchEntries(stored_entries, ids){
    let entries = stored_entries.filter(e => ids.includes(e.id));
    let entry_ids = entries.map(e => e.id);
    let miss_ids = ids.filter(i => !entry_ids.includes(i));
    if (miss_ids.length){
      let url = "https://souka.io/vocab/entry/?ids=" + miss_ids.join(',');
      fetcher.get(url, (data) => {
        store.save('entries', stored_entries.concat(data));
        this.setState({current_tasks: entries.concat(data), isLoading: false});
      })
    } else {
      this.setState({current_tasks: entries, isLoading: false});
    }
  }

  prevTask() {
    console.log('prevTask');
    if (this.state.current_index == 0){
      return;
    }
    let index = this.state.current_index-1;
    this.setState({current_index: index});
  }

  nextTask() {
    console.log('nextTask');
    let index = this.state.current_index + 1;
    if (index == this.state.current_tasks.length){
      consol.log('finished');
    } else {
      this.setState({current_index: index});
    }
  }

  render() {
    // If we have completed loading the cookie choose to show Login WebView or the LoggedIn component, else just show an empty View.
    if (this.state.isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator />
        </View>
      );
    }
    let tasks = this.state.current_tasks;
    let index = this.state.current_index;

    return (
      <View style={styles.container}>
        <ProgressBar
          index={this.state.current_index}
          length={this.state.current_tasks.length}
        />

        <SwipeCards
          style={{flex: 1}}
          cards={tasks}
          renderCard={(cardData) => <Entry entry={cardData} />}
          handleYup={(card) => this.handleYup(card)}
          handleNope={(card) => this.handleNope(card)}
          yupText="上一个"
          nopeText="下一个"
        />
      </View>
    );
  }

  handleYup (card) {
    console.log("yup")
    this.prevTask()
  }

  handleNope (card) {
    console.log("nope")
    this.nextTask();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
    alignItems: "center",
    justifyContent: "center"
  },
  swiper: {

  },
  header: {
    width: window.width*0.8,
    backgroundColor: 'white',
    position: 'absolute',
    top: 0,
    height: 40
  },
  footer: {
    width: window.width*0.8,
    height: 35,
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 1
  }
});

export default LearningScreen;
