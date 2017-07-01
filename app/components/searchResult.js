import React, { Component } from "react";
import {
  StyleSheet
} from "react-native";


import { List, ListItem } from "react-native-elements";


class SearchResult extends Component {
  static renderRow(item) {
    let title;
    if (item.word) {
      title = `${item.kana} 【${item.word}】`;
    } else {
      title = item.kana;
    }

    return (
      <ListItem
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
            this.constructor.renderRow(item)
          ))
        }
      </List>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // override default style
  }
});

export default SearchResult;
