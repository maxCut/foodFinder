import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import RecipeCard from '../components/recipeCard';
import mealVals from '../mealsCopy.json';
import allIngredients from '../ingredientsCopy.json';
import AddToCartButton from '../components/addToCartButton';
import Typography from '../components/typography';
import RecipeDetails from '../components/recipeDetails';

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
    console.log(oneTimes);
    let value = oneTimes.includes(key);
    return (
      <TouchableOpacity
        style={value ? styles.oneTimeRemove : styles.oneTimeAdd}
        onPress={() => props.handleOneTimes(key)}>
        <Typography>{value ? '1 in your cart' : '+'}</Typography>
      </TouchableOpacity>
    );
  };

  const cartCard = recipe => {
    let inCart = false;
    if (cartMeals.has(recipe)) {
      inCart = true;
    }
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <RecipeDetails
          isCart={true}
            recipe={recipe}
            key={recipe.Id}
            handleCartMeals={props.handleCartMeals}
            cartMeals={props.cartMeals}
          />
        </View>
        <View style={styles.ingredientsList}>
          <Typography variant="header3">Ingredients</Typography>
          <FlatList
            style={{paddingBottom: 15, paddingLeft: 10}}
            data={Array.from(getIngredients(recipe))}
            renderItem={({item, index}) => {
              let [key, value] = item;
              return (
                <View
                  style={{
                    ...styles.listItem,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Typography>{`\u2022 ${key.Name}`}</Typography>
                  <Typography>
                    {value} {key.Options[0].Unit}
                  </Typography>
                </View>
              );
            }}
          />
          <Typography variant="header3">Pantry Ingredients</Typography>
          <Typography>Ingredients you might already have</Typography>
          <FlatList
            style={{paddingLeft: 10}}
            data={recipe.OneTimes}
            renderItem={({item}) => {
              let oneTimeDetails = getOneTime(item);
              return (
                <View
                  style={{
                    ...styles.listItem,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <Typography>{`\u2022 ${oneTimeDetails.Name}`}</Typography>
                  {oneTimeButton(item)}
                </View>
              );
            }}
          />
        </View>
      </View>
    );
  };
  return (
    <View style={{          backgroundColor: '#1B2428', flex: 1}}>
      <View style={styles.checkoutFooter}>
        <TouchableOpacity style={styles.button}>
          <Typography>Proceed to Checkout</Typography>
        </TouchableOpacity>
      </View>
      <ScrollView
        keyboardShouldPersistTaps="always"
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'flex-start',

          padding: 10,
          flexDirection: 'column',
          paddingBottom: 80,
        }}>
        <View style={styles.cartHeader}>
          <Typography variant="header1">Cart</Typography>
          <Typography>{cartMeals.size} recipes selected</Typography>
        </View>
        <View>
          {Array.from(cartMeals).map(([key, value]) => {
            return cartCard(key);
          })}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  cartHeader: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#34383F',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
    width: 365,
    alignSelf: 'center'
  },
  cardHeader: {
    borderBottomColor: '#fff',
    borderBottomWidth: 1,
    flexDirection: 'row',
  },
  ingredientsList: {
    padding: 15,
  },
  listItem: {
    paddingTop: 10,
  },
  checkoutFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    padding: 15,
    backgroundColor: '#34383F',
  },

  button: {
    backgroundColor: '#E56A25',
    padding: 5,
    borderRadius: 40,
    alignItems: 'center',
  },
  oneTimeAdd: {
    backgroundColor: '#E56A25',
    padding: 5,
    borderRadius: 40,
    alignItems: 'center',
    width: 28,
  },
  oneTimeRemove: {
    // backgroundColor: '#E56A25',
    borderWidth: 1,
    borderColor: '#fff',
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 40,
    alignItems: 'center',
    // width: 28,
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
