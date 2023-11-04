import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';





const RecipeScreenComponent = props => {
  return (
    <RecipeScreen
      recipe={viewRecipe}
      handleCartMeals={handleCartMeals}
      cartMeals={cartMeals}
    />
  );
};


export default RecipeScreenComponent;
