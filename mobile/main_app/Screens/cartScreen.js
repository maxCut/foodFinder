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
import NetInfo from "@react-native-community/netinfo";
import DropShadow from "react-native-drop-shadow";

const CartScreen = props => {
  let {cartMealsGlobal, tryToReachCheckout} = props;
  const getIngredients = ingredientHandler.getIngredients;
  const getOneTime = ingredientHandler.getOneTime;
  const [cartMealsLocal, setCartMealsLocal] = useState(cartMealsGlobal);
  const [oneTimes, setOneTimes] = useState(props.oneTimesGlobal);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
		const unsubscribe = NetInfo.addEventListener(state => {
			if (state.isInternetReachable === false) {
				setIsConnected(false);
			} else {
				setIsConnected(true);
			}
		});

		return () => unsubscribe();
	}, []);

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
    return (
      <TouchableOpacity
        style={value ? styles.oneTimeRemove : styles.oneTimeAdd}
        onPress={() => handleOneTimes(key)}>
        <Typography>{value ? '1 in your pre-cart' : '+'}</Typography>
      </TouchableOpacity>
    );
  };

  const cartCard = params => {
    const {recipe,index} = params
    return (
      <DropShadow
      style={{
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: .5,
        shadowRadius: 3,
      }}
      >
      <View key = {index} style={styles.card}>
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
            {
            
            recipe.NamedIngredients?
            recipe.NamedIngredients.map((ingredient,index)=>{
              let [name, value, unitName] = ingredient;
            return (
              <View key = {index} style={styles.listItem}>
                <View style = {styles.itemName}>
                <Typography>{`\u2022 ${name}`}
                </Typography>
                </View>
                
                <View style = {styles.itemQuantity}>
                <Typography>
                  {value} {unitName??"Units"}
                </Typography>
                </View>
              </View>
          );
            }):


            Array.from(getIngredients(recipe)).map((item,index)=>{
              let [key, value] = item;
              return (
              <View key = {index} style={styles.listItem}>
              <Typography>{`\u2022 ${key.Name}`}</Typography>
              <Typography>
                {value} {key.Options[0].Unit}
              </Typography>
            </View>
            );
              })
            
            }
          </View>
          <Typography variant="header3">Pantry Ingredients</Typography>
          <Typography>Ingredients you might already have</Typography>

          <View
            style={{paddingLeft: 10}}
          >
            
            {
              recipe.NamedPantryIngredients?
              recipe.NamedPantryIngredients.map((item,index) => {
                return (
                  <View key = {index} style={styles.listItem}>

                <View style = {styles.itemName}>
                    <Typography>{`\u2022 ${item}`}</Typography>
                </View>
                    {oneTimeButton(item)}
                  </View>
                );
              }):

              recipe.OneTimes.map((item,index) => {
                let oneTimeDetails = getOneTime(item);
                return (
                  <View key = {index} style={styles.listItem}>
                    <Typography>{`\u2022 ${oneTimeDetails.Name}`}</Typography>
                    {oneTimeButton(item)}
                  </View>
                );
              })
              
            }

          </View>
        </View>
      </View></DropShadow>
    );
  };
  return (
    <View style={styles.background}>
      {cartMealsLocal.size > 0 ? (
        <View style={styles.checkoutFooter}>
          <TouchableOpacity
          disabled={!isConnected}
            onPress={async () => {
              tryToReachCheckout();
            }}
            style={isConnected?styles.checkoutButton:styles.checkoutButtonDisabled}>
            <Typography>Add to Amazon Cart</Typography>
          </TouchableOpacity>
          {
          isConnected?
          <></>:
          <Typography  style={{textAlign: 'center', marginTop:10,}}>No Internet</Typography>
          }
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
            {Array.from(cartMealsLocal).map(([recipe, value],index) => {
              return cartCard({recipe,index});
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {backgroundColor: '#fff', flex: 1},
  checkoutFooter: {
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    padding: 20,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  checkoutButton: {
    backgroundColor: '#fff',
    borderWidth:1,
    borderColor: '#030436',
    padding: 10,
    borderRadius: 40,
    alignItems: 'center',
  },
  checkoutButtonDisabled: {
    backgroundColor: '#fff',
    borderWidth:1,
    borderColor: '#030436',
    padding: 10,
    borderRadius: 40,
    alignItems: 'center',
    opacity: .2,
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
    backgroundColor: '#fff',
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
    flexDirection: 'row',
    flexWrap:'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    verticalAlign:"center",
    textAlign:"center", 
    marginTop:10,
    width:"100%"
  },
  itemName:{
    maxWidth:"60%",
  },
  itemQuantity:{
    flexDirection: 'row-reverse',
    right: 5,

  },
  oneTimeAdd: {
    backgroundColor: '#fff',
    borderWidth:1,
    borderColor: '#030436',
    padding: 5,
    borderRadius: 40,
    alignItems: 'center',
    width: 28,
  },
  oneTimeRemove: {
    // backgroundColor: '#7bffda',
    borderWidth: 1,
    borderColor: '#030436',
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 40,
    alignItems: 'center',
    // width: 28,
  },
  circleButton: {
    backgroundColor: '#fff',
    borderWidth:1,
    borderColor: '#030436',
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
