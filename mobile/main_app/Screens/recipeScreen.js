import React, { useEffect,useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
  Platform,
  TouchableOpacity,
} from 'react-native';
import Typography from '../components/typography';
import timeHandler from '../Utils/timeHandler';
import AddToCartButton from '../components/addToCartButton.js';
import Icons from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import ingredientHandler from '../Utils/ingredientHandler';

const RecipeScreen = props => {
  let {recipe} = props;
  const getIngredients = ingredientHandler.getIngredients;
  const getOneTime = ingredientHandler.getOneTime;
  const [cartMealsLocal, setCartMealsLocal] = useState(props.cartMealsGlobal);
  const windowWidth = Dimensions.get('window').width;
  const navigation = useNavigation();


useEffect(()=>{
  setCartMealsLocal(props.cartMealsGlobal)
},[props.refreshTrigger])

const handleCartMeals = (event, meal, value) => {
  props.handleCartMeals(event,meal,value,setCartMealsLocal, cartMealsLocal)
};

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

  let inCart = false;
  if (cartMealsLocal.has(recipe)) {
    inCart = true;
  }

  const instructions = () => {
    const InstructionListItems = ({steps}) => {
      return (
        <View>
          {steps.map((item, index) => {
            return (
              <View key = {index} style={{paddingTop: 15}}>
                <Typography>
                  {index + 1}. {item}
                </Typography>
              </View>
            );
          })}
        </View>
      );
    };

    if (typeof recipe.instructions[0] == 'object') {
      return (
        <>
          {recipe.instructions.map((step, index) => {
            return Object.keys(step).map(key => {
              return (
                <>
                  <Typography key = {index} style={{fontWeight: 'bold', marginTop: 20}}>
                    {key}
                  </Typography>
                  <InstructionListItems key = {index}steps={step[key]} />
                </>
              );
            });
          })}
        </>
      );
    } else {
      return <InstructionListItems steps={recipe.instructions} />;
    }
  };

  return (
    <View style={styles.background}>
      <View style={styles.backButtonContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack(null)}
          style={styles.backButton}>
          <Icons name="arrow-back" size={25} color="#1B2428" />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
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
            {timeDetails.map((item,index) => {
              return (
                <View key = {index} style={styles.timeDetailListItem}>
                  <Typography style={{fontWeight: 'bold'}}>
                    {item.key}
                  </Typography>
                  <Typography>{item.value}</Typography>
                </View>
              );
            })}
          </View>
          <View style={styles.list}>
            <Typography variant="header3">Ingredients</Typography>
            <Typography>{recipe.IncrementAmount} servings</Typography>
            <View style={{...styles.list, paddingTop: 0}}>
              {Array.from(getIngredients(recipe)).map((ingredient,index) => {
                let [key, value] = ingredient;
                return (
                  <View key = {index} style={styles.listItem}>
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
            <View style={{...styles.list, paddingTop: 0}}>
              {recipe.OneTimes.map((oneTime,index) => {
                let oneTimeDetails = getOneTime(oneTime);
                return (
                  <View key = {index} style={styles.listItem}>
                    <Typography>{`\u2022 ${oneTimeDetails.Name}`}</Typography>
                  </View>
                );
              })}
            </View>
          </View>
          <View style={styles.list}>
            <Typography variant="header2">Instructions</Typography>
            {instructions()}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {backgroundColor: '#1B2428', flex: 1, paddingBottom: 50},
  backButtonContainer: {
    position: 'absolute',
    zIndex: 1,
    left: 10,
    ...Platform.select({ios: {top: 40}, android: {top: 20}}),
  },
  backButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 50,
  },
  addToCartFooter: {
    position: 'absolute',
    bottom: 0,
    height: 80,
    left: 0,
    right: 0,
    padding: 20,
    zIndex: 1,
    backgroundColor: '#34383F',
    ...Platform.select({ios: {paddingBottom: 20}, android: {paddingBottom: 0}}),
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    flexDirection: 'column',
    paddingBottom: 80,
  },
  image: {
    flex: 1,
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
  timeDetailListItem: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {padding: 15},
  listItem: {
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default RecipeScreen;
