import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
  FlatList,
  Platform,
} from 'react-native';
import Typography from '../Components/typography';
import timeHandler from '../Utils/timeHandler';
import AddToCartButton from '../Components/addToCartButton.js';
import mealVals from '../mealsCopy.json';
import allIngredients from '../ingredientsCopy.json';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const RecipeScreen = props => {
  let {recipe, handleCartMeals, cartMeals, isCart} = props;
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const navigation = useNavigation()

  let timeDetails;
  if (recipe) {
    let prepTime = timeHandler.formatTime(recipe.prepTime);
    let cookTime = timeHandler.formatTime(recipe.cookTime);
    let totalTime = timeHandler.getTotalTime(recipe.prepTime, recipe.cookTime);
    timeDetails = [
      {key: 'Prep Time', value: prepTime},
      {key: 'Cook Time', value: cookTime},
      {key: 'Total Time', value: totalTime},
    ];
  }

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
  let inCart = false;
  if (props.cartMeals.has(recipe)) {
    inCart = true;
  }

  const instructions = instructions => {
    console.log(instructions);
    const InstructionListItems = ({steps}) => {
      return (
        <FlatList
          data={steps}
          renderItem={({item, index}) => {
            console.log(item);
            return (
              <View style={{paddingTop: 15}}>
                <Typography>
                  {index + 1}. {item}
                </Typography>
              </View>
            );
          }}
        />
      );
    };

    if (typeof instructions[0] == 'object') {
      return (
        <>
          {recipe.instructions.map((step, index) => {
            return Object.keys(step).map(key => {
              return (
                <>
                  <Typography style={{fontWeight: 'bold', marginTop: 20}}>
                    {key}
                  </Typography>
                  {/* <ol> */}
                  <InstructionListItems steps={step[key]} />
                  {/* </ol> */}
                </>
              );
            });
          })}
        </>
      );
    } else {
      return (
        // <ol>
        <>
          <InstructionListItems steps={instructions} />
        </>
        // </ol>
      );
    }
  };

  return (
    <View style={{backgroundColor: '#1B2428', flex: 1}}>
      <View style={{position: 'absolute', zIndex: 1, left: 10, top: 10}}>
        <TouchableOpacity
        onPress={() => navigation.goBack(null)}
          style={{backgroundColor: '#fff', padding: 10, borderRadius: 50}}>
          <Icons name="arrow-back" size={25} />
        </TouchableOpacity>
      </View>
      <View style={styles.addToCartFooter}>
        <AddToCartButton
          inCart={inCart}
          recipe={recipe}
          handleCartMeals={handleCartMeals}
          cartMeals={cartMeals}
        />
      </View>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'flex-start',
          // padding: 10,
          flexDirection: 'column',
          paddingBottom: 80,
        }}>
        <Image
          styles={styles.image}
          source={{width: windowWidth, height: 350, uri: recipe.Image}}
        />
        <View style={{flex: 1}}>
          <View style={{padding: 15}}>
            <Typography variant="header1">{props.recipe.Name}</Typography>
            <Typography>{props.recipe.description}</Typography>
          </View>
          <View style={styles.timeDetailList}>
            {timeDetails.map(item => {
              return (
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Typography style={{fontWeight: 'bold'}}>
                    {item.key}
                  </Typography>
                  <Typography>{item.value}</Typography>
                </View>
              );
            })}
          </View>
          <View style={styles.ingredientsList}>
            <Typography variant="header3">Ingredients</Typography>
            <Typography>{recipe.IncrementAmount} servings</Typography>
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
                  </View>
                );
              }}
            />
          </View>
          <View style={styles.instructionList}>
            <Typography variant="header2">Instructions</Typography>
            {instructions(recipe.instructions)}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  addToCartFooter: {
    position: 'absolute',
    bottom: 0,
    height: 80,
    left: 0,
    right: 0,
    padding: 15,
    zIndex: 1,
    padding: 15,
    backgroundColor: '#34383F',
    ...Platform.select({ios: {paddingBottom: 15}, android: {paddingBottom: 0}}),
  },
  background: {
    flexDirection: 'row',
    backgroundColor: '#34383F',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
    width: 350,
  },
  timeDetailList: {
    backgroundColor: '#34383F',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    flex: 1,
    paddingTop: 20,
    paddingBottom: 20,
  },
  ingredientsList: {padding: 15},
  instructionList: {padding: 15},
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
  listItem: {paddingTop: 10},
});

export default RecipeScreen;
