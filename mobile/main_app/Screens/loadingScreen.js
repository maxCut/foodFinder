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
    <Typography style = {{textAlign:'center', margin: 30}} variant="header2">Adding items to cart</Typography>
    <Text style = {{textAlign:'center'}} >
    <ActivityIndicator size={"large"}/>
    </Text>
    <Typography style = {{textAlign:'center', margin: 10}} variant="header2">{100*props.itemsAdded/props.itemsToAdd}%</Typography>
  </View>)
}

const styles = StyleSheet.create({
  background: {backgroundColor: '#1B2428', flex: 1},
});

export default LoadingScreen;
