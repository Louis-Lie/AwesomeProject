import {
  Dimensions,
  StyleSheet,
} from 'react-native';
import { colors } from './common';

let { height, width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
    alignItems: "center",
    justifyContent: "center"
  },
  progressBar: {
    zIndex:1000,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top:0,
    width: width,
    backgroundColor: '#f3e3b0'
  },
  progressText:{
    zIndex:1000,
    color: 'white'
  },
  progress:{
    zIndex:1000,
    position:'absolute',
    left:0,
    height: 16,
    backgroundColor: '#FFCA61'
  },
  flipCard: {
    width: width*0.8,
    height: 100,
    backgroundColor: 'white',
    borderWidth:1,
    borderColor: '#e1e8ee',
    padding: 15,
    marginTop: 60,
    marginBottom: 60
  },
  face:{
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  back:{
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  frontText:{
    fontSize: 48,
    color:"#546576"
  },
  backText:{
    fontSize: 48,
    color:"#546576",
    marginBottom:5
  },
  word:{
    fontSize: 24,
    color: "#87939f",
    marginBottom:5,

  },
  roman:{
    color: "#87939f",
    marginBottom:5,
  },
  examplesHeader:{
    color: "#999",
    fontSize:13,
    marginBottom:3
  },
  exampleContent:{
    color:"#546576",
    marginBottom:3
  },
  exampleTran:{
    color: "#777"
  },
  volumeIcon: {
    padding: 12,
    position: 'absolute',
    bottom: 5,
    right: 5
  },
  header: {
    width: width*0.8,
    backgroundColor: 'white',
    position: 'absolute',
    top: 0,
    height: 30
  },
  footer: {
    width:width*0.8,
    height: 30,
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 1
  }
});

export default styles;
