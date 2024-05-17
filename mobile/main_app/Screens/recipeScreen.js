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
import FontAwesomeIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import ingredientHandler from '../Utils/ingredientHandler';
import iconWrapper from '../Utils/iconWrapper';
import DropShadow from "react-native-drop-shadow";

import FastImage from 'react-native-fast-image'

const RecipeScreen = props => {
  let {recipe} = props;
  const setViewRecipe = props.setViewRecipe;
  const getIngredients = ingredientHandler.getIngredients;
  const getOneTime = ingredientHandler.getOneTime;
  const [cartMealsLocal, setCartMealsLocal] = useState(props.cartMealsGlobal);
  const windowWidth = Dimensions.get('window').width;
  const navigation = useNavigation();
  const setRefreshTrigger = props.setRefreshTrigger
  const MealFontIcon = iconWrapper.getIconFont(recipe.IconFamily)


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
          onPress={() => {navigation.goBack(null); setRefreshTrigger(!props.refreshTrigger)}}
          style={styles.backButton}>
          <Icons name="arrow-back" size={25} color="#1B2428" />
        </TouchableOpacity>
      </View>
      <View style={styles.addToCartFooter}>
        <AddToCartButton
          inCart={inCart}
          recipe={recipe}
          handleCartMeals={handleCartMeals}
          cartMeals={cartMealsLocal}
          displayView={true}
        />
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
      { recipe.Image? 
        <FastImage
          style = {{height:350,width: windowWidth}}
          styles={styles.image}
          source={{width: windowWidth, height: 350, uri: recipe.Image}}
        />:
        <View style = {styles.iconImageWrapper}>
          <View  style = {styles.iconImageCircle}>
            <MealFontIcon name={recipe.Icon} style = {styles.iconImage}/>
          </View>
        </View>}
        <View style = {styles.editButtonWrapper}>
        {recipe.customizable ?
          <TouchableOpacity 
            style = {styles.editButton} 
            onPress = {()=>{
                setViewRecipe(recipe)
                navigation.navigate('EditRecipe')
              }}>
                <FontAwesomeIcons name="file-edit" size={25}/>
          </TouchableOpacity>
          :<></>
          }

        </View>

        <DropShadow
                style={{
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 0,
                  },
                  shadowOpacity: 1,
                  shadowRadius: 3,
                }}
                >
        <View style={{borderRadius:20, backgroundColor:'#fff'}} >
          <View style={{paddingTop: 20, alignItems:'center'}}>
            <Typography variant="header2" style={{fontSize:30}} >{props.recipe.Name} </Typography>
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
            {
              recipe.NamedIngredients?
            <View style={{...styles.list, paddingTop: 0}}>
              {recipe.NamedIngredients.map((ingredient,index) => {
                let [name, value,unitName] = ingredient;
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
              })}
            </View>
            :
            <View style={{...styles.list, paddingTop: 0}}>
            { 
            Array.from(getIngredients(recipe)).map((ingredient,index) => {
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

            }

            
            <Typography variant="header3">Pantry Ingredients</Typography>
            <Typography>Ingredients you might already have</Typography>
            <View style={{...styles.list, paddingTop: 0}}>
              {
            recipe.NamedPantryIngredients?
            recipe.NamedPantryIngredients.map((ingredient,index) => {
              return (
                <View key = {index} style={styles.listItem}>
                  <Typography>{`\u2022 ${ingredient}`}</Typography>
                </View>
              );
            })
            :
              recipe.OneTimes.map((oneTime,index) => {
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
    </DropShadow>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {backgroundColor: '#fff', flex: 1, paddingBottom: 50},
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
    backgroundColor: '#030436',
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
    maxWidth:"70%",
  },
  itemQuantity:{
    flexDirection: 'row-reverse',
    right: 5,

  },
  iconImageWrapper:
  {
    height:350,width: "100%",
    alignItems:"center",
    justifyContent: 'center',
},
  iconImageCircle:{

    borderColor:"#7bffda",
    borderWidth: 5,
  padding: 10,
   backgroundColor:"#030436",
     borderRadius:1000 
    },
  iconImage:{
    color:"#fff",
    padding: 30,
   fontSize:200,
  },
  editButton:{
    borderWidth:1,
    borderColor:'rgba(0,0,0,0.2)',
    alignItems:'center',
    justifyContent:'center',
    width:40,
    height:40,
    backgroundColor:'#fff',
    borderRadius:100,
    boxShadow:'rgb(47, 79, 79)',
    fontSize: 31,
    padding: 4,
    margin: 5
  },
  editButtonWrapper:{
    flexDirection: "row-reverse",
    marginTop: -40,
    flexDirection: "row-reverse"
  },
});

export default RecipeScreen;
