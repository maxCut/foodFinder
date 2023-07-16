import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import allIngredients from '../ingredientsCopy.json';
import Typography from '../Components/typography';
import RecipeDetails from '../Components/recipeDetails';
import ingredientHandler from '../Utils/ingredientHandler';

const CartScreen = props => {
  let {cartMeals, oneTimes, handleCartMeals} = props;
  const getIngredients = ingredientHandler.getIngredients;
  const getOneTime = ingredientHandler.getOneTime;

  const oneTimeButton = key => {
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
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <RecipeDetails
            isCart={true}
            recipe={recipe}
            key={recipe.Id}
            handleCartMeals={handleCartMeals}
            cartMeals={cartMeals}
          />
        </View>
        <View style={styles.ingredientsList}>
          <Typography variant="header3">Ingredients</Typography>
          <FlatList
            style={{paddingBottom: 15, paddingLeft: 10}}
            data={Array.from(getIngredients(recipe))}
            renderItem={({item}) => {
              let [key, value] = item;
              return (
                <View style={styles.listItem}>
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
                <View style={styles.listItem}>
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
    <View style={styles.background}>
      {cartMeals.size > 0 ? (
        <View style={styles.checkoutFooter}>
          <TouchableOpacity style={styles.checkoutButton}>
            <Typography>Proceed to Checkout</Typography>
          </TouchableOpacity>
        </View>
      ) : null}

      <ScrollView
        keyboardShouldPersistTaps="always"
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.scroll}>
        <View style={styles.cartHeader}>
          <Typography variant="header1">Cart</Typography>
          <Typography>{cartMeals.size} recipes selected</Typography>
        </View>
        {cartMeals.size == 0 ? (
          <View
            style={{
              ...styles.card,
              padding: 15,
            }}>
            <Typography style={{textAlign: 'center'}}>
              Your cart is empty!
            </Typography>
          </View>
        ) : (
          <View>
            {Array.from(cartMeals).map(([key, value]) => {
              return cartCard(key);
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {backgroundColor: '#1B2428', flex: 1},
  checkoutFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    padding: 20,
    backgroundColor: '#34383F',
  },
  checkoutButton: {
    backgroundColor: '#E56A25',
    padding: 10,
    borderRadius: 40,
    alignItems: 'center',
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    padding: 10,
    flexDirection: 'column',
    paddingBottom: 80,
  },
  cartHeader: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#34383F',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
    width: 365,
    alignSelf: 'center',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
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
