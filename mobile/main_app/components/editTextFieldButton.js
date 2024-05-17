import React, { useEffect,useState } from 'react';
import {View, TouchableOpacity, Text, StyleSheet, Modal, TextInput} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icons from 'react-native-vector-icons/MaterialIcons';
import CustomButton from './customButton';
import DropShadow from 'react-native-drop-shadow';

const EditTextFieldButton = props => {
  const setRecipe = props.setRecipe;
  const recipe = props.recipe;
  const field = props.fieldName;
  const fieldIndex = props.fieldIndex;
  const fieldSubIndex= props.fieldSubIndex;
  const numeric = props.numeric ?? false
  const [modalVisible, setModalVisible] = useState(false)
  let fieldInputVal = recipe[field].toString()
  if(fieldIndex!=null)
  {
    fieldInputVal = recipe[field][fieldIndex].toString()
    if(fieldSubIndex!=null)
    {
      fieldInputVal = recipe[field][fieldIndex][fieldSubIndex].toString()
    }
  }
  return (
    <View style = {styles.buttonEditIcon}>
      <TouchableOpacity
        onPress={() => {setModalVisible(true)}}>
        <Icons name="edit" size={15} color="#030436" />
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!false);
        }}>

<View style={styles.centeredView}>

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
          <View style={styles.modalView}>
          <TextInput
            style={styles.input}
            placeholder= {fieldInputVal}
            keyboardType="text"
            defaultValue={fieldInputVal}
            onChangeText={(text)=>{fieldInputVal=text}}
          />
            <CustomButton title = {"Save"} onClick = {
              () => {
              recipeNew = {...recipe}
              let res = fieldInputVal
              if(numeric)
              {
                res = parseInt(fieldInputVal)
              }
              if(fieldSubIndex!=null)
              {
                recipeNew[field][fieldIndex][fieldSubIndex]=res
              }
              else if(fieldIndex!=null)
              {
                recipeNew[field][fieldIndex]=res
              }
              else{
                recipeNew[field]=res
              }
              setRecipe(recipeNew)
              setModalVisible(!modalVisible)}
            }/>
          </View>
          </DropShadow>
        </View>
        </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonEditIcon: {
    paddingLeft: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: '#fff' ,
    borderRadius: 10,
    padding: 35,
    alignItems: 'center',
    width: 365,
  },
  doneButton: {
    margin: 20,
    padding: 5
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    width: 350,
  },
});

export default EditTextFieldButton;
