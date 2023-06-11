import React from 'react';
import {Text, View} from 'react-native';
import RecipeCard from '../components/recipeCard';
import mealVals from '../mealsCopy.json';

const RecipeLandingScreen = props => {
  return (
    <View ref={props.ref}>
      {mealVals.map((meal) => <RecipeCard recipe={meal} key={meal.Id} />)}
    </View>
  );
};

export default RecipeLandingScreen;
