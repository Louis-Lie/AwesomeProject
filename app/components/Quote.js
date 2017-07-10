import React, { Component } from "react";

import {
  Text,
  StyleSheet,
} from "react-native";

import { Card } from "react-native-elements";
import { colors } from "../styles/common";
import fetcher from "../utils/fetcher";

class Quote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quote: {}
    };
    fetcher.get("/quote/").then((res) => {
      const quote = res.data;
      this.setState({ quote });
    });
  }

  render() {
    const quote = this.state.quote;
    const source = [quote.author, quote.source].join("，");

    return (
      <Card>
        <Text style={styles.content} selectable>{quote.content}</Text>
        <Text style={styles.translation} selectable>{quote.translation}</Text>
        <Text style={styles.source} selectable>― {source}</Text>
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    fontSize: 13,
    color: colors.textColor,
    marginBottom: 8
  },
  translation: {
    fontSize: 13,
    color: "#aaa",
    marginBottom: 10
  },
  source: {
    fontSize: 13,
    color: colors.textColor
  }
});
export default Quote;
