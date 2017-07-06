import React, { Component } from "react";

import {
    StyleSheet,
    Text,
    View
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { Button, Card } from "react-native-elements";
import { colors, window } from "../styles/common";

class TaskFinished extends Component {
  constructor(props) {
    super(props);

    this.goHome = this.goHome.bind(this);
  }

  goHome() {
    console.log(this, this.props);
    this.props.navigation.goBack();
  }

  render() {
    console.log(this, this.props);
    return (
      <View>
        <Card>
          <View style={{ alignItems: "center", padding: 10, width: window.width * 0.618 }}>
            <Icon name="trophy" size={48} color="#FCE38A" />
            <Text style={styles.text}>已完成所有预习任务</Text>
          </View>

        </Card>
        <Button
          style={styles.button}
          backgroundColor="#3D84A8"
          buttonStyle={{ borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0 }}
          onPress={this.goHome}
          title="休息一会"
        />
        <Button
          style={styles.button}
          backgroundColor="#3FC1C9"
          buttonStyle={{ borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0 }}
          onPress={this.props.startDictation}
          title="继续听写"
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
