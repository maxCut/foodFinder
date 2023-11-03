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

const AmazonCheckoutFlow = props => {
  return(
    <View style={styles.webView}>
      <Button
        title="Back"
        onPress={async () => {
          props.setPageState('Main');
        }}
      />
      <WebView
      originWhitelist={['*']}
      thirdPartyCookiesEnabled={true}
      sharedCookiesEnabled={true}
        source={{uri: props.pageUrl}}
        onNavigationStateChange={({url, _}) => {
          props.checkIfUserLoggedIn();
        }}
      />
    </View>)
}

const styles = StyleSheet.create({
  background: {backgroundColor: '#1B2428', flex: 1},
  webView: {flex: 1, ...Platform.select({ios: {marginTop: 40}})},
});

export default AmazonCheckoutFlow;
