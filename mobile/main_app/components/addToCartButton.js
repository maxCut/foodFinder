import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';

const AddToCartButton = props => {
  let inCart = props.inCart;
  let recipe = props.recipe;
  let displayView = props.displayView;

  return (
    <View style={{display: 'flex', justifyContent: 'center', height: 40}}>
      {inCart ? (
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            style={styles.circleButton}
            onPress={event => props.handleCartMeals(event, recipe, 'decrement')}>
            <Text style={{...styles.circleButtonText, fontWeight: 'bold'}}>-</Text>
          </TouchableOpacity>
          <View style={{alignItems: 'center', flex: 1}}>
            <Text style={displayView?{...styles.inCartDisplayViewText, fontWeight:'bold'}:{...styles.inCartText, fontWeight: 'bold'}}>
              {props.cartMeals.get(recipe)} in your cart
            </Text>
            <Text style={displayView?{...styles.inCartDisplayViewText}:{...styles.inCartText}}>
              {props.recipe.IncrementAmount * props.cartMeals.get(recipe)} servings
            </Text>
          </View>
          <TouchableOpacity
            style={styles.circleButton}
            onPress={event => props.handleCartMeals(event, recipe, 'increment')}>
            <Text style={{...styles.circleButtonText, fontWeight: 'bold'}}>+</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.button}
          onPress={event => props.handleCartMeals(event, recipe, 'increment')}>
          <Text style={{...styles.buttonText, fontWeight: 'bold'}}>
            Add to Pre-Cart
          </Text>
          <Text style={{...styles.buttonText, fontSize: 10}}>
            {props.recipe.IncrementAmount} servings
          </Text>
        </TouchableOpacity>
      )}
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
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 40,
    alignItems: 'center',
    borderColor: '#030234',
    borderWidth: 1,
  },
  circleButton: {
    backgroundColor: '#030234',

    borderColor: '#fff',
    borderWidth: 1,
    padding: 4.5,
    borderRadius: 40,
    alignItems: 'center',
    width: 28,
    height: 28,
  },
  inCartText: {color: '#030234', fontSize: 10},
  image: {
    flex: 1,
  },
  inCartDisplayViewText: {color: '#fff', fontSize: 13},
  image: {
    flex: 1,
  },
  buttonText: {
    color: '#030234',
  },
  circleButtonText: {
    color: '#fff',
  },

});

export default AddToCartButton;
