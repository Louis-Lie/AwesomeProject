import React, { Component } from 'react';
import {
  Text,
  View,
  ScrollView
} from 'react-native';

import { List, ListItem } from 'react-native-elements';

class SearchResult extends Component {
  constructor(props) {
    super(props);
    console.log(this, props)
    this.state = {entries:[]};
  }
  onLearnMore = (entry) => {
    this.props.navigation.navigate('Entry', { ...entry });
  };

  render() {
    return (
      <ScrollView>
        <List>
          {this.props.entries.map((entry) => (
            <ListItem
              key={entry.id}
              title={entry.kana}
              subtitle={entry.first_definition}
              onPress={() => this.onLearnMore(entry)}
            />
          ))}
        </List>
      </ScrollView>
    );
  }
}

export default SearchResult;
