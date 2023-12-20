import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Platform,
  Text,
  Button,
} from 'react-native';
import RecipeDetails from '../components/recipeDetails';
import Typography from '../components/typography';
import {useNavigation,useFocusEffect} from '@react-navigation/native';

const RecipeLandingScreen = props => {
  const setViewRecipe = props.setViewRecipe;
  const navigation = useNavigation();
  const scrollView = useRef();
  const [currentView, setCurrentView] = useState(0);
  const [cartMealsLocal, setCartMealsLocal] = useState(props.cartMealsGlobal);

useEffect(() => {
  CATEGORIES = getCategories();
},[props.mealVals]);

useEffect(()=>{
  setCartMealsLocal(props.cartMealsGlobal)
},[props.refreshTrigger])

const handleCartMeals = (event, meal, value) => {
  props.handleCartMeals(event,meal,value,setCartMealsLocal, cartMealsLocal)
};


function getCategories()
{
  let categories = []
  for(meal of props.mealVals)
  {
    if(meal.category)
    {
      categories.push(meal.category)
    }
  }
  categories = categories.filter((item,
    index) => categories.indexOf(item) === index);
  categories = categories.sort();
  return categories.map((cat)=>{return {name:cat}});
}
  let CATEGORIES = getCategories();

  return (
    <View style={styles.background}>
      <ScrollView
        ref={scrollView}
        onScroll={e => {
          setCurrentView(e.nativeEvent.contentOffset.y);
        }}
        scrollEventThrottle={16}
        keyboardShouldPersistTaps="always"
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.scroll}>
        {CATEGORIES.map((category, index) => {
          let categoryMeals = props.mealVals.filter(
            meal => meal.category == category.name,
          );

          return (
            <View key={category.name}>
              <Typography variant="header1" style={{marginBottom: 5}}>
                {category.name}
              </Typography>
              {categoryMeals.map(meal => (
                <View
                  key={meal.Id}
                  style={styles.recipeCard}>
                  <RecipeDetails
                    recipe={meal}
                    key={meal.Id}
                    handleCartMeals={handleCartMeals}
                    cartMeals={cartMealsLocal}
                    imageCache = {props.imageCache}
                  />
                  <TouchableOpacity 
                    style = {styles.info} 
                    onPress = {()=>{
                      setViewRecipe(meal);
                      navigation.navigate('Recipe');}}>
                    <Text style = {styles.infoText}>i</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {backgroundColor: '#1B2428', flex: 1},
  navigationList: {
    padding: 10,
    borderBottomColor: '#fff',
    borderBottomWidth: 1,
    ...Platform.select({ios: {marginTop: 40}}),
  },
  recipeCard: {
    flexDirection: 'row',
    backgroundColor: '#34383F',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
    width: 365,
    alignSelf: 'center',
  },
  categoryContainer: {height: 50, marginRight: 10},
  currentCategory: {
    backgroundColor: '#E56A25',
    borderWidth: 1,
    borderColor: '#E56A25',
    borderRadius: 40,
    alignItems: 'center',
  },
  category: {
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    padding: 10,
    flexDirection: 'column',
    paddingBottom: 80,
  },
  info:{
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
    opacity:.75,
    position: 'absolute',
    bottom: 5,
  },
  infoText:{
    fontStyle: 'italic',
    fontSize: 25,
    opacity:.75,
    color:'#222',
  },

});

export default RecipeLandingScreen;
