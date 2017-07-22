import React, { Component } from "react";

import {
    StyleSheet,
    Text,
    View
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { Button, Card } from "react-native-elements";
import { colors, window } from "styles/common";

class TaskFinished extends Component {
  render() {
    console.log(this, this.props);
    return (
      <View>
        <Card>
          <View style={{ alignItems: "center", padding: 10, width: window.width * 0.618 }}>
            <Icon name="trophy" size={48} color="#FCE38A" />
            <Text style={styles.text}>{this.props.title}</Text>
          </View>

        </Card>
        <Button
          style={styles.button}
          backgroundColor="#3D84A8"
          buttonStyle={{ borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0 }}
          onPress={this.props.goBack}
          title="休息一会"
        />
      </View>
    );
  }
}


const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    color: colors.textColor,
    marginTop: 15
  },
  button: {
    marginTop: 20
  }
});

export default TaskFinished;
