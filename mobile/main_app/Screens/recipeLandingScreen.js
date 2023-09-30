import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Platform,
} from 'react-native';
import RecipeDetails from '../Components/recipeDetails';
import Typography from '../Components/typography';
import {useNavigation} from '@react-navigation/native';

const RecipeLandingScreen = props => {
  const setViewRecipe = props.setViewRecipe;
  const navigation = useNavigation();
  const scrollView = useRef();
  const [currentView, setCurrentView] = useState(0);
  const [mealVals, setMealVals] = useState(require("../mealsCopy.json"))

useEffect(() => {
  fetch('https://www.chefbop.com/shared/mealsCopy.json').then((response)=>{
    response.json().then((json)=>
    {
      setMealVals(json)
    })
  }).catch(()=>{})
}, [setMealVals]);

useEffect(() => {
  CATEGORIES = getCategories();
},[mealVals]);


function getCategories()
{

  let categories = []
  for(meal of mealVals)
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
      <FlatList
        style={styles.navigationList}
        horizontal
        data={CATEGORIES}
        renderItem={({item, index}) => {
          let isCurrentCategory = false;
          if (
            (index === 0 && currentView < 150) ||
            (currentView >= 150 * index && currentView < 150 * (index + 1))
          ) {
            isCurrentCategory = true;
          }
          return (
            <View style={styles.categoryContainer}>
              <TouchableOpacity
                style={
                  isCurrentCategory ? styles.currentCategory : styles.category
                }
                onPress={() => {
                  scrollView.current.scrollTo({x: 0, y: 150 * index}); //height of card multiplied by index
                }}>
                <Typography style={{padding: 10}}>{item.name}</Typography>
              </TouchableOpacity>
            </View>
          );
        }}
      />
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
          let categoryMeals = mealVals.filter(
            meal => meal.category == category.name,
          );

          return (
            <View key={category.name}>
              <Typography variant="header1" style={{marginBottom: 5}}>
                {category.name}
              </Typography>
              {categoryMeals.map(meal => (
                <TouchableOpacity
                  key={meal.Id}
                  style={styles.recipeCard}
                  onPress={() => {
                    setViewRecipe(meal);
                    navigation.navigate('Recipe');
                  }}>
                  <RecipeDetails
                    recipe={meal}
                    key={meal.Id}
                    handleCartMeals={props.handleCartMeals}
                    cartMeals={props.cartMeals}
                  />
                </TouchableOpacity>
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
});

export default RecipeLandingScreen;
