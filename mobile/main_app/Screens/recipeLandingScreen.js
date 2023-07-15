import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import RecipeCard from '../components/recipeCard';
import mealVals from '../mealsCopy.json';
import RecipeDetails from '../components/recipeDetails';
import Typography from '../components/typography';

const RecipeLandingScreen = props => {
  let CATEGORIES = [
    {name: 'Quick and Easy'},
    {name: 'Sheet Pan'},
    {name: 'Cooking Mastery'},
  ];

  return (
    <View style={{backgroundColor: '#1B2428', flex: 1}}>
      <FlatList
        style={{padding: 10, borderBottomColor: '#fff', borderBottomWidth: 1}}
        horizontal
        data={CATEGORIES}
        renderItem={({item}) => {
          return (
            <TouchableOpacity style={styles.currentCategory}>
              <Typography>{item.name}</Typography>
            </TouchableOpacity>
          );
        }}
      />
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
        {CATEGORIES.map((category, index) => {
          let categoryMeals = mealVals.filter(
            meal => meal.category == category.name,
          );
          return (
            <>
              <Typography variant="header1" style={{marginBottom: 5}}>
                {category.name}
              </Typography>
              {categoryMeals.map(meal => (
                <View style={styles.recipeCard}>
                  <RecipeDetails
                    // <RecipeCard
                    recipe={meal}
                    key={meal.Id}
                    handleCartMeals={props.handleCartMeals}
                    cartMeals={props.cartMeals}
                  />
                </View>
              ))}
            </>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  recipeCard: {
    flexDirection: 'row',
    backgroundColor: '#34383F',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
    width: 365,
    alignSelf: 'center',
  },
  currentCategory: {
    backgroundColor: '#E56A25',
    padding: 5,
    borderRadius: 40,
    alignItems: 'center',
  },
  category: {
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
  header: {
    color: '#fff',
    fontFamily: 'Archivo-Bold',
    fontSize: 20,
  },
});

export default RecipeLandingScreen;
