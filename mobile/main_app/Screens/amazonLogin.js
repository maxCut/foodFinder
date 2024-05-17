import React, {useState,useEffect} from 'react';
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
  Modal,
} from 'react-native';
import Typography from '../components/typography';
import timeHandler from '../Utils/timeHandler';
import AddToCartButton from '../components/addToCartButton.js';
import Icons from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import ingredientHandler from '../Utils/ingredientHandler';
import {WebView} from 'react-native-webview';
import CustomButton from '../components/customButton';

const AmazonLogin = props => {

  const [ErrorModalVisable, SetErrorModalVisable] = useState(false)
  return(
    <View style={styles.webView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={ErrorModalVisable}>
      <View style= {styles.centeredView}>
        <View style = {styles.modalView}>
          <Typography>An unexpected error occured, please check your network connection</Typography>
          <View style = {styles.errorModalWrapper}>
            <CustomButton style = {styles.errorModalButton} title = "Ok"
            onClick = {()=>{
              SetErrorModalVisable(false)
              props.setPageState("Main")
            }}/>
          </View>
          </View>
          </View>
    </Modal>
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
        onError={(error)=>{
          SetErrorModalVisable(true)
        }}
      />
    </View>)
}

const styles = StyleSheet.create({
  background: {backgroundColor: '#1B2428', flex: 1},
  webView: {flex: 1, ...Platform.select({ios: {marginTop: 40}})},

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 10,
    backgroundColor: '#030436' ,
    borderRadius: 10,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  errorModalWrapper: {
    flexDirection: 'row'
  },
  errorModalButton: {
    margin : 5,
    marginTop: 10,
    width: 80
  }
});

export default AmazonLogin;
