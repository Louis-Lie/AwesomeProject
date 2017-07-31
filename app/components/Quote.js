import React, { Component } from "react";

import {
  Text,
  StyleSheet,
} from "react-native";

import { Card } from "react-native-elements";

import RubyText from "components/RubyText";
import { colors } from "styles/common";
import fetcher from "utils/fetcher";


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
    let source = "";
    if (quote.author && quote.source) {
      source = [quote.author, quote.source].join("，");
    } else {
      source = quote.author || quote.source;
    }

    return (
      <Card containerStyle={styles.card}>
        <RubyText
          style={styles.content}
          textStyle={styles.textContent}
          childrenProps={{ selectable: true }}
        >
          {quote.ruby}
        </RubyText>
        <Text style={styles.translation} selectable>{quote.translation}</Text>
        <Text style={styles.source} selectable>― {source}</Text>
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 0
  },
  content: {
    marginBottom: 10,
  },
  textContent: {
    color: colors.textColor,
    marginBottom: 3,
  },
  translation: {
    fontSize: 13,
    color: "#aaa",
    marginBottom: 12,
  },
  source: {
    fontSize: 13,
    color: colors.textColor
  }
});
export default Quote;
