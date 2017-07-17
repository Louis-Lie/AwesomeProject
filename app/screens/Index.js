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
  tabBarOptions: {
    activeTintColor: colors.tintColor,
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
      if (currentState.index === 0) {
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
