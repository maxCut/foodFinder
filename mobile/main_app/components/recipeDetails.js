import React, {memo} from 'react';
import {StyleSheet, Image, View, Text} from 'react-native';
import AddToCartButton from './addToCartButton';
import Typography from './typography';
import timeHandler from '../Utils/timeHandler';

const RecipeDetails = props => {
  let {recipe, handleCartMeals, cartMeals, isCart} = props;

  let inCart = false;
  if (props.cartMeals.has(recipe)) {
    inCart = true;
  }
  return (
    <>{
    props.imageCache.get(recipe.Id)}
      <View style={{flex: 1, padding: 10}}>
        <View style={{flex: 1}}>
          <Typography variant="header2">{props.recipe.Name}</Typography>
          {isCart ? null : (
            <Text style={{fontSize: 10, color: '#fff'}}>
              {props.recipe.description}
            </Text>
          )}
          <Text style={{fontSize: 10, color: '#fff'}}>
            {timeHandler.getTotalTime(recipe.prepTime, recipe.cookTime)} min |{' '}
            {recipe.IncrementAmount} servings
          </Text>
        </View>
        <AddToCartButton
          inCart={inCart}
          recipe={recipe}
          handleCartMeals={handleCartMeals}
          cartMeals={cartMeals}
        />
      </View>
    </>
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
    backgroundColor: '#E56A25',
    padding: 5,
    borderRadius: 40,
    alignItems: 'center',
  },
  circleButton: {
    backgroundColor: '#E56A25',
    padding: 5,
    borderRadius: 40,
    alignItems: 'center',
    width: 28,
  },
  inCartText: {color: '#fff', fontSize: 10},
  image: {
    flex: 1,
  },
  buttonText: {
    color: '#fff',
  },
});

export default memo(RecipeDetails);
