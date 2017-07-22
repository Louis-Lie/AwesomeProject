import React, { Component } from "react";
import {
  StyleSheet,
} from "react-native";
import { List, ListItem } from "react-native-elements";

import { window } from "styles/common";


class SearchResult extends Component {


  constructor(props) {
    super(props);

    this.renderEntry = this.renderEntry.bind(this);
    this.renderRow = this.renderRow.bind(this);
  }

  renderEntry(entry) {
    console.log("this. render entry", this, this.props);
    this.props.navigation.navigate("Entry", {
      entry,
      onGoBack: this.props.onGoBack
    });
  }

  renderRow(item) {
    let title;
    if (item.word) {
      title = `${item.kana} 【${item.word}】`;
    } else {
      title = item.kana;
    }

    return (
      <ListItem
        onPress={() => this.renderEntry(item)}
        key={item.id}
        title={title}
        subtitle={item.first_definition}
        hideChevron
      />
    );
  }

  render() {
    return (
      <List style={styles.container}>
        {
          this.props.dataSource.map(item => (
            this.renderRow(item)
          ))
        }
      </List>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    height: window.height
  }
});

export default SearchResult;
