import React, { Component } from "react";

import SwipeCards from "react-native-swipe-cards";

import Entry from "components/Entry";
import TaskFinished from "components/TaskFinished";


class Review extends Component {
  constructor(props) {
    super(props);

    this.handleYup = this.handleYup.bind(this);
    this.handleNope = this.handleNope.bind(this);
    this.handleMaybe = this.handleMaybe.bind(this);
  }

  handleYup(card) {
    console.log("yup", card);
    this.props.prevTask();
  }

  handleNope(card) {
    console.log("nope", card);
    this.props.nextTask();
  }

  handleMaybe(card) {
    console.log("maybe", card);
    console.log(this, this.state);
  }

  render() {
    const entries = this.props.entries;

    return (
      <SwipeCards
        style={{ flex: 1, }}
        cards={entries}
        initial_index={this.props.index}
        renderCard={cardData => <Entry entry={cardData} />}
        renderNoMoreCards={() => <TaskFinished goBack={this.props.goBack} title="已完成所有复习任务" />}
        handleYup={this.handleYup}
        handleNope={this.handleNope}
        handleMaybe={this.handleMaybe}
        hasMaybeAction
        yupText="上一个"
        nopeText="下一个"
      />
    );
  }
}

export default Review;
