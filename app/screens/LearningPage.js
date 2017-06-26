import React,  { Component } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';
import store from 'react-native-simple-store';
import { NavigationActions } from 'react-navigation'
import { Card, ListItem, Button } from 'react-native-elements'
import { Actions, ActionConst } from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/FontAwesome';
import FlipCard from 'react-native-flip-card'

import { colors } from '../styles/common';
import playSound from '../utils/soundPlayer';
import fetcher from '../utils/fetcher';

let { height, width } = Dimensions.get("window");

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
    alignItems: "center",
    justifyContent: "center"
  },
  flipCard: {
    width: width*0.7,
    height: 100,
    backgroundColor: 'white',
    borderWidth:1,
    borderColor: '#e1e8ee',
    padding: 15,
    margin: 25
  },
  face:{
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  back:{
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  cardText:{
    fontSize: 28
  }
});

class LearningPage extends Component {
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
    fetch(task_url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
    .then((response) => response.json())
    .then((data) => {
      console.log('get tasks: ', data)
      this.setState({task: data, isLoading: false});
      this.prepareTask();
    })
    .catch((error) => {
      console.warn(error);
    });
  }

  prepareTask(){
    let task = this.state.task;
    let task_ids = null;
    if (task['0'].length) {
      this.setState({
        learningType: 'memory',
      })
      task_ids = task['0']
    } else if (task['1'].length) {
      this.setState({
        learningType: 'dictation',
      })
      task_ids = task['1']
    } else {
      this.setState({
        learningType: 'review',
      })
      task_ids =task['2']
    }

    let title = {
      memory: '预习',
      dictation: '听写',
      review: '复习'
    }[this.state.learningType];
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
        this.setState({current_tasks: entries.concat(data)});
      })
    } else {
      this.setState({current_tasks: entries});
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


    let entry = this.state.current_tasks && this.state.current_tasks[this.state.current_index] || null;
    return (
      <View style={styles.container}>
        <View>
        {/* progress bar */}
        </View>
        <View>
          <FlipCard
          style={styles.flipCard}
          friction={6}
          perspective={1000}
          flipHorizontal={false}
          flipVertical={true}
          flip={false}
          clickable={true}
          onFlipped={(isFlipped)=>{console.log('isFlipped', isFlipped)}}
          >
            {/* Face Side */}
            <View style={styles.face}>
              <Text style={styles.cardText}>{entry && entry.word}</Text>
              <TouchableHighlight
                style={{ padding: 12, position: 'absolute', bottom: 5, right: 5}}
                underlayColor='white'
                onPress={ () => { playSound(`https://souka.io/${entry.audio_url}.mp3`)}} >
                <Icon name='volume-up' size={24} />
              </TouchableHighlight>
            </View>

            {/* Back Side */}
            <View style={styles.back}>
              <Text style={styles.cardText}>{entry && entry.kana}</Text>
              <TouchableHighlight
                style={{ padding: 12, position: 'absolute', bottom: 5, right: 5}}
                underlayColor='white'
                onPress={ () => { playSound(`https://souka.io/${entry.audio_url}.mp3`)}} >
                <Icon name='volume-up' size={24} />
              </TouchableHighlight>
            </View>
          </FlipCard>
        </View>
      </View>
    );
  }
}

export default LearningPage;
