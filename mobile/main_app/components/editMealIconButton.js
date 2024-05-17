import React, { useEffect,useState } from 'react';
import {View, TouchableOpacity, Text, StyleSheet, Modal, TextInput} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import iconWrapper from '../Utils/iconWrapper';
import Icons from 'react-native-vector-icons/MaterialIcons';
import CustomButton from './customButton';

import DropShadow from 'react-native-drop-shadow';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


const EditMealIconButton = props => {
  const setRecipe = props.setRecipe;
  const recipe = props.recipe;
  const [modalVisible, setModalVisible] = useState(false)
  return (
    <View style = {styles.buttonEditIcon}>
      <TouchableOpacity
        onPress={() => {setModalVisible(true)}}>
        <Icons name="edit" size={25} color="#030436" />
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
          <View style= {styles.centeredView}>

    <DropShadow
style={{
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 0,
  },
  shadowOpacity: 1,
  shadowRadius: 3,
}}
>
            <View style = {styles.modalView}>
              
              {
                iconWrapper.getSupportedIcons().map((icon,index)=>
                {
                  FontIcon = iconWrapper.getIconFont(icon.family)
                  return (
                    <View key={index} style = {styles.iconImageWrapper}>
                      <TouchableOpacity
                  onPress={() => {
                    setRecipe({...recipe,Image:null,Icon:icon.icon, IconFamily:icon.family})
                    setModalVisible(false)
                    }} style={styles.iconImageCircle}>
                       <FontIcon name={icon.icon} style={styles.iconImage}/>
                  </TouchableOpacity>
                       </View>)
                })
              }
          </View>
          </DropShadow>
            </View>
        </Modal>
    </View>
  );
};

const styles = StyleSheet.create({

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 10,
    backgroundColor: '#fff' ,
    borderRadius: 10,
    padding: 35,
    alignItems: 'center',
    width: 370,
    flexWrap: 'wrap',
    alignItems: "flex-start",
    flexDirection:'row',
  },
  buttonEditIcon: {
    paddingLeft: 5,
    textAlign:"right",
    flexDirection:'row',
    justifyContent:"flex-end",
    marginRight: 15,
    marginTop: -40,
  },

  iconImageWrapper:
  {
    height:150,width:150,
    alignItems:"center",
    justifyContent: 'center',
},
  iconImageCircle:{
    borderColor:"#7bffda",
    borderWidth: 5,
  padding: 10,
   backgroundColor:"#030436",
     borderRadius:1000 
    },
  iconImage:{
    color:"#fff",
   fontSize:80,
  }
});

export default EditMealIconButton;
