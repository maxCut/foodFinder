import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import RecipeCard from '../components/recipeCard';
import mealVals from '../mealsCopy.json';

const RecipeLandingScreen = props => {
  let CATEGORIES = [
    {name: 'Quick and Easy'},
    {name: 'Sheet Pan'},
    {name: 'Cooking Mastery'},
  ];

  return (
    <>
      <View ref={props.ref}>
        {CATEGORIES.map((category, index) => {
          let categoryMeals = mealVals.filter(
            meal => meal.category == category.name,
          );
          return (
            <>
              <Text style={styles.header}>{category.name}</Text>
              {categoryMeals.map(meal => (
                <RecipeCard
                  recipe={meal}
                  key={meal.Id}
                  handleCartMeals={props.handleCartMeals}
                  cartMeals={props.cartMeals}
                />
              ))}
            </>
          );
        })}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    color: '#fff',
    fontFamily: 'Archivo-Bold',
    fontSize: 20,
  },
});

export default RecipeLandingScreen;
