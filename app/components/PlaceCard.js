import React from "react";
import {
  View,
  TouchableHighlight,
} from "react-native";

const PlaceCard = () => (
  <TouchableHighlight
    style={this.props.style}
    underlayColor="white"
    onPress={this.props.onPress}
  >
    {/* A TouchableHighlight must have a child*/}
    <View />
  </TouchableHighlight>
);

export default PlaceCard;
