import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import RecipeCard from '../components/recipeCard';
import mealVals from '../mealsCopy.json';
import allIngredients from '../ingredientsCopy.json';
import AddToCartButton from '../components/addToCartButton';

const CartScreen = props => {
  let cartMeals = props.cartMeals;
  let oneTimes = props.oneTimes;

  const getIngredients = recipe => {
    let ingredientsTmp = new Map();
    recipe.Ingredients.forEach(([key, quantity]) => {
      let ingredientDetails = allIngredients.filter(
        ingredient => ingredient.Key == key,
      )[0];
      ingredientsTmp.set(ingredientDetails, quantity);
    });
    return ingredientsTmp;
  };

  const getOneTime = key => {
    let oneTimeDetails = allIngredients.filter(
      ingredient => ingredient.Key == key,
    )[0];
    return oneTimeDetails;
  };

  const oneTimeButton = key => {
    let value = oneTimes.includes(key);
    return (
      <TouchableOpacity
        style={
          value
            ? {
                ...styles.circleButton,
                backgroundColor: null,
                borderWidth: 1,
                borderColor: '#fff',
              }
            : styles.circleButton
        }
        onPress={() => props.handleOneTimes(key)}>
        <Text style={styles.buttonText}>{value ? '-' : '+'}</Text>
      </TouchableOpacity>
    );
  };

  const cartCard = recipe => {
    let inCart = false;
    if (cartMeals.has(recipe)) {
      inCart = true;
    }
    console.log(Array.from(getIngredients(recipe)));
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
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
            <AddToCartButton
              inCart={inCart}
              recipe={recipe}
              handleCartMeals={props.handleCartMeals}
              cartMeals={props.cartMeals}
            />
          </View>
        </View>
        <Text>Ingredients</Text>
        <FlatList
          data={Array.from(getIngredients(recipe))}
          renderItem={({item}) => {
            let [key, value] = item;
            return (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text>{key.Name}</Text>
                <Text>
                  {value} {key.Options[0].Unit}
                </Text>
              </View>
            );
          }}
        />
        <Text>Pantry Ingredients</Text>
        <Text>Ingredients you might already have</Text>
        <FlatList
          data={recipe.OneTimes}
          renderItem={({item}) => {
            let oneTimeDetails = getOneTime(item);
            return (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text>{oneTimeDetails.Name}</Text>
                {oneTimeButton(item)}
              </View>
            );
          }}
        />
      </View>
    );
  };
  return (
    <View style={{justifyContent: 'space-between'}}>
      <View>
        <Text style={styles.header}>Cart</Text>
        <Text style={styles.buttonText}>{cartMeals.size} recipes selected</Text>
      </View>
      <View style={{flex: 1}}>
        {Array.from(cartMeals).map(([key, value]) => {
          return cartCard(key);
        })}
      </View>
      <View>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    color: '#fff',
    fontFamily: 'Archivo-Bold',
    fontSize: 20,
  },
  card: {
    backgroundColor: '#34383F',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
    width: 350,
  },
  cardHeader: {
    borderBottomColor: '#fff',
    borderBottomWidth: 1,
    flexDirection: 'row',
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
