import React, { Component } from "react";
import {
  TabNavigator,
  NavigationActions
} from "react-navigation";

import { colors } from "styles/common";
import HomeStack from "./Home/Home";
// import ReadScreen from "./screens/Read";
import ForumStack from "./Forum/Forum";
import ProfileStack from "./Profile/Profile";

const RouteConfigs = {
  Home: {
    screen: HomeStack,
  },
  // Read: {
  //   screen: ReadScreen,
  // },
  Forum: {
    screen: ForumStack,
  },
  Profile: {
    screen: ProfileStack,
  }
};
const AppNavigator = TabNavigator(RouteConfigs, {
  lazy: true,
  tabBarPosition: "bottom",
  swipeEnabled: false,
  tabBarOptions: {
    showIcon: true,
    activeTintColor: colors.tintColor,
    inactiveTintColor: "#929292",
    style: {
      backgroundColor: "#fafafa",
    },
    labelStyle: {
      marginBottom: 1
    },
  }
});

function getCurrentRouteName(navigationState) {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // dive into nested navigators
  if (route.routes) {
    return getCurrentRouteName(route);
  }
  return route.routeName;
}

class App extends Component {
  constructor(props) {
    super(props);
    this.onNavigationStateChange = this.onNavigationStateChange.bind(this);
  }

  onNavigationStateChange(prevState, currentState) {
    const currScreen = getCurrentRouteName(currentState);
    const prevScreen = getCurrentRouteName(prevState);

    if (prevScreen !== currScreen) {
      // the line below uses the Google Analytics tracker
      // change the tracker here to use other Mobile analytics SDK.
      console.log("prevScreen: ", prevScreen);
      console.log("currScreen: ", currScreen);
      console.log("prevState: ", prevState);
      console.log("currState: ", currentState);
      const stack = currentState.routes[currentState.index];
      if (prevState.index !== 0 && currentState.index === 0 && stack.index === 0) {
        const resetAction = NavigationActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({ routeName: stack.routeName })
          ]
        });
        this.navigator._navigation.dispatch(resetAction);
      }
    }
  }

  render() {
    return (
      <AppNavigator
        ref={(nav) => { this.navigator = nav; }}
        onNavigationStateChange={this.onNavigationStateChange}
      />);
  }
}

export default App;
