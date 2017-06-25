import { StyleSheet } from "react-native";

let iconSize = 24;

let colors = {
  primaryColor: '#0E91A1',
  backgroundColor: '#F2F1ED',
  tintColor: '#6BCFDF',
}
export { colors };

export default StyleSheet.create({
 icon: {
   height: iconSize,
   width: iconSize,
   borderRadius: iconSize / 2 //make this a circle
 }
});
