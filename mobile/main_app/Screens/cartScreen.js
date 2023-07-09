import React from 'react';
import {Text, View, StyleSheet, Image} from 'react-native';
import RecipeCard from '../components/recipeCard';
import mealVals from '../mealsCopy.json';
import AddToCartButton from '../components/addToCartButton';

const CartScreen = props => {
  let cartMeals = props.cartMeals;

  const cartCard = recipe => {

    let inCart = false;
    if (cartMeals.has(recipe)) {
      inCart = true;
    }
    return (
      <View style={styles.background}>
        <Image
          styles={styles.image}
          source={{width: 150, height: 150, uri: recipe.Image}}
        />
        <View style={{flex: 1, padding: 15}}>
          <View style={{flex: 1}}>
            <Text style={{fontWeight: 'bold', color: '#fff'}}>
              {recipe.Name}
            </Text>
            <Text style={{fontSize: 10, color: '#fff'}}>
              {recipe.description}
            </Text>
            <Text style={{fontSize: 10, color: '#fff'}}>
              {recipe.cookTime} min | {recipe.IncrementAmount} servings
            </Text>
          </View>
          <AddToCartButton inCart={inCart} recipe={recipe} handleCartMeals={props.handleCartMeals} cartMeals={props.cartMeals} />
        </View>
      </View>
    );
  };
  return (
    <View>
      <View>
        <Text style={styles.header}>Cart</Text>
        <Text style={styles.buttonText}>{cartMeals.size} recipes selected</Text>
      </View>
      {Array.from(cartMeals).map(([key, value]) => {
        return cartCard(key);
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    color: '#fff',
    fontFamily: 'Archivo-Bold',
    fontSize: 20,
  },
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

export default CartScreen;
