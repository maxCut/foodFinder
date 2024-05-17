import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import Typography from '../components/typography';
const LoadingScreen = props => {
  return(<View style={{...styles.background, padding:80}}>
    <View style={{top:"25%"}}>
    <Typography style = {{textAlign:'center', margin: 10}} variant="header2">Adding items to cart</Typography>
    <ActivityIndicator style = {{textAlign:'center'}} size={"large"}/>
    <Typography style = {{textAlign:'center', margin: 10}} variant="header2">{(100*props.itemsAdded/props.itemsToAdd).toPrecision(3)}%</Typography>
    <Text style = {{textAlign:'center',left:'50%', marginTop: 40}} >
    </Text></View>
  </View>)
}

const styles = StyleSheet.create({
  background: {backgroundColor: '#fff', flex: 1},
});

export default LoadingScreen;
