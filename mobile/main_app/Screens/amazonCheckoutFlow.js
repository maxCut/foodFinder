import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  Button,
} from 'react-native';
import Typography from '../components/typography';
import timeHandler from '../Utils/timeHandler';
import AddToCartButton from '../components/addToCartButton.js';
import Icons from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import ingredientHandler from '../Utils/ingredientHandler';
import {WebView} from 'react-native-webview';
import LoadingScreen from './loadingScreen';
import AmazonWebView from './amazonWebView';
import AmazonLogin from './amazonLogin';

const AmazonCheckoutFlow = props => {
    if (props.pageState === 'Login') {
    return (
      <AmazonLogin setPageState = {props.setPageState} checkIfUserLoggedIn = {props.checkIfUserLoggedIn} pageUrl = {props.pageUrl}/>
    );
  }
  else if(props.pageState === 'Loading')
  {
    return (<LoadingScreen itemsToAdd = {props.itemsToAdd} itemsAdded= {props.itemsAdded}/>);
  }
  else if(props.pageState === 'Cart')
  {
    return (
      <AmazonWebView setPageState = {props.setPageState}/>
    );
  }
}

const styles = StyleSheet.create({
  background: {backgroundColor: '#1B2428', flex: 1},
  webView: {flex: 1, ...Platform.select({ios: {marginTop: 40}})},
});

export default AmazonCheckoutFlow;
