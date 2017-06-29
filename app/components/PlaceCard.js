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
        {/* A TouchableHighlight must have a child*/}
        <View />
      </TouchableHighlight>
    )
  }
}

export default PlaceCard;
