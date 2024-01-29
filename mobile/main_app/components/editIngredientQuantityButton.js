import React, { useEffect,useState } from 'react';
import {View, TouchableOpacity, Text, StyleSheet, Modal, TextInput} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icons from 'react-native-vector-icons/MaterialIcons';
import CustomButton from './customButton';

const EditIngredientQuantityButton = props => {
  const setRecipe = props.setRecipe;
  const recipe = props.recipe;
  const field = props.fieldName??"NamedIngredients";
  const fieldIndex = props.fieldIndex;
  const numeric = props.numeric ?? false
  const [modalVisible, setModalVisible] = useState(false)
  let ingredientQuantity = recipe[field][fieldIndex][1].toString()
  let ingredientUnit = recipe[field][fieldIndex][2]??"Units".toString()
  return (
    <View style = {styles.buttonEditIcon}>
      <TouchableOpacity
        onPress={() => {setModalVisible(true)}}>
        <Icons name="edit" size={15} color="#fff" />
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!false);
        }}>

<View style={styles.centeredView}>
          <View style={styles.modalView}>
          <TextInput
            style={styles.input}
            placeholder= {ingredientQuantity}
            keyboardType="text"
            defaultValue={ingredientQuantity}
            onChangeText={(text)=>{ingredientQuantity=text}}
          />
          <TextInput
            style={styles.input}
            placeholder= {ingredientUnit}
            keyboardType="text"
            defaultValue={ingredientUnit}
            onChangeText={(text)=>{ingredientUnit=text}}
          />
            <CustomButton title = {"Save"} onClick = {
              () => {
              recipeNew = {...recipe}
              let parsedQuantity = parseInt(ingredientQuantity)
              recipeNew[field][fieldIndex][1] = parsedQuantity
              recipeNew[field][fieldIndex][2] = ingredientUnit
              setRecipe(recipeNew)
              setModalVisible(!modalVisible)}
            }/>
          </View>
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
    backgroundColor: '#34383F' ,
    borderRadius: 10,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
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

export default EditIngredientQuantityButton;
