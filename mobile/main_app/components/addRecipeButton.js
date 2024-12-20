import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const AddRecipeButton = props => {
  const setViewRecipe = props.setViewRecipe;
  const navigation = useNavigation();
  return (
    <View style={{display: 'flex', justifyContent: 'center', height: 40}}>
    <TouchableOpacity
      style={styles.button}
      onPress={event => {
        setViewRecipe(null);
        navigation.navigate('EditRecipe')
        }}>
      <Text style={{...styles.buttonText, fontWeight: 'bold'}}>
        New Recipe
      </Text>
    </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flexDirection: 'row',
    backgroundColor: '#34383F',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
    width: 350,
  },
  button: {
    borderColor: '#040435',
    borderWidth: 1,
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 40,
    alignItems: 'center',
  },
  inCartText: {color: '#fff', fontSize: 10},
  image: {
    flex: 1,
  },
  buttonText: {
    color: '#040435',
  },
});

export default AddRecipeButton;
