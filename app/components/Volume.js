import React,  { Component } from 'react';
import {
  TouchableHighlight,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import playSound from '../utils/soundPlayer';

class Volume extends React.Component {
  constructor(props){
    super(props);
    this.state = {played: false};
  }

  play(){
      playSound(this.props.audio_url);
  }

  componentDidMount(){
    console.log('did mount');
    this.play();
  }

  componentDidUpdate(prevProps, prevState){
    if (prevProps.audio_url != this.props.audio_url){
      this.play();
    }
  }

  render(){
    return (
      <TouchableHighlight
        style={this.props.style}
        underlayColor='white'
        onPress={ this.play.bind(this) } >
        <Icon name='volume-up' size={24} style={{color: "#546576"}}/>
      </TouchableHighlight>
    )
  }
}

export default Volume;
