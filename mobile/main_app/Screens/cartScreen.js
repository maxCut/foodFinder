import React, {useState,useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Typography from '../components/typography';
import RecipeDetails from '../components/recipeDetails';
import ingredientHandler from '../Utils/ingredientHandler';

const CartScreen = props => {
  let {cartMealsGlobal, tryToReachCheckout} = props;
  const getIngredients = ingredientHandler.getIngredients;
  const getOneTime = ingredientHandler.getOneTime;
  const [cartMealsLocal, setCartMealsLocal] = useState(cartMealsGlobal);
  const [oneTimes, setOneTimes] = useState(props.oneTimesGlobal);


  const handleCartMeals = (event, meal, value) => {
    props.handleCartMeals(event,meal,value,setCartMealsLocal, cartMealsLocal)
  };
  const handleOneTimes = (key) => {
    props.handleOneTimes(key,setOneTimes)
  };

  useEffect(()=>{
    setCartMealsLocal(props.cartMealsGlobal)
  },[props.refreshTrigger])

  const oneTimeButton = key => {
    let value = oneTimes.includes(key);
    console.log(value)
    return (
      <TouchableOpacity
        style={value ? styles.oneTimeRemove : styles.oneTimeAdd}
        onPress={() => handleOneTimes(key)}>
        <Typography>{value ? '1 in your pre-cart' : '+'}</Typography>
      </TouchableOpacity>
    );
  };

  const cartCard = recipe => {
    console.log("one times", recipe.OneTimes)
    return (
      <View key = {recipe} style={styles.card}>
        <View style={styles.cardHeader}>
          <RecipeDetails
            isCart={true}
            recipe={recipe}
            key={recipe.Id}
            handleCartMeals={handleCartMeals}
            cartMeals={cartMealsLocal}
            imageCache = {props.imageCache}
          />
        </View>
        <View style={styles.ingredientsList}>
          <Typography variant="header3">Ingredients</Typography>
          <View
            style={{paddingBottom: 15, paddingLeft: 10}}>
            {Array.from(getIngredients(recipe)).map((item)=>{
            let [key, value] = item;
            return (
            <View style={styles.listItem}>
            <Typography>{`\u2022 ${key.Name}`}</Typography>
            <Typography>
              {value} {key.Options[0].Unit}
            </Typography>
          </View>
          );
            })}
          </View>
          <Typography variant="header3">Pantry Ingredients</Typography>
          <Typography>Ingredients you might already have</Typography>

          <View
            style={{paddingLeft: 10}}
          >
            
            {
              recipe.OneTimes.map((item) => {
                let oneTimeDetails = getOneTime(item);
                return (
                  <View style={styles.listItem}>
                    <Typography>{`\u2022 ${oneTimeDetails.Name}`}</Typography>
                    {oneTimeButton(item)}
                  </View>
                );
              })
            }

          </View>
        </View>
      </View>
    );
  };
  return (
    <View style={styles.background}>
      {cartMealsLocal.size > 0 ? (
        <View style={styles.checkoutFooter}>
          <TouchableOpacity
            onPress={async () => {
              tryToReachCheckout();
            }}
            style={styles.checkoutButton}>
            <Typography>Add to Amazon Cart</Typography>
          </TouchableOpacity>
        </View>
      ) : null}

      <ScrollView
        keyboardShouldPersistTaps="always"
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.scroll}>
        <View style={styles.cartHeader}>
          <Typography variant="header1">Pre-Cart</Typography>
          <Typography>{cartMealsLocal.size} recipes selected</Typography>
        </View>
        {cartMealsLocal.size == 0 ? (
          <View
            style={{
              ...styles.card,
              padding: 15,
            }}>
            <Typography style={{textAlign: 'center'}}>
              Your pre-cart is empty!
            </Typography>
          </View>
        ) : (
          <View>
            {Array.from(cartMealsLocal).map(([key, value]) => {
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
