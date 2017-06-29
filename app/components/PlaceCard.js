import React,  { Component } from 'react';
import {
  View,
  TouchableHighlight,
} from 'react-native';

class PlaceCard extends Component {
  render(){
    return (
      <TouchableHighlight style={this.props.style}
        underlayColor='white'
        onPress={ this.props.onPress } >
        <View />
      </TouchableHighlight>
    )
  }
}

export default PlaceCard;
