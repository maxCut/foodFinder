import React, {useCallback, useState, useRef} from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Platform,
} from 'react-native';
import mealVals from '../mealsCopy.json';
import RecipeDetails from '../Components/recipeDetails';
import Typography from '../Components/typography';
import { useNavigation } from '@react-navigation/native';

const RecipeLandingScreen = props => {
  const setViewRecipe = props.setViewRecipe
  const navigation = useNavigation()
  // let navigation = props.navigation;
  let CATEGORIES = [
    {name: 'Quick and Easy'},
    {name: 'Sheet Pan'},
    {name: 'Cooking Mastery'},
  ];
  // const useComponentSize = () => {
  //   const [size, setSize] = useState(null);

  //   const onLayout = useCallback(event => {
  //     const {x, y, width, height} = event.nativeEvent.layout;
  //     setSize({x, y, width, height});
  //   }, []);

  //   return [size, onLayout];
  // };
  // const [size, onLayout] = useComponentSize();

  const scrollView = useRef();
  const [currentView, setCurrentView] = useState(0);
  return (
    <View style={{backgroundColor: '#1B2428', flex: 1}}>
      <FlatList
        style={styles.navigationList}
        horizontal
        data={CATEGORIES}
        renderItem={({item, index}) => {
          let isCurrentCategory = false;
          if (
            (index == 0 && currentView < 150) ||
            (currentView >= 150 * index && currentView < 150 * (index + 1))
          ) {
            isCurrentCategory = true;
          }
          return (
            <View style={{height: 50, marginRight: 10}}>
              <TouchableOpacity
                style={
                  isCurrentCategory ? styles.currentCategory : styles.category
                }
                onPress={() => {
                  scrollView.current.scrollTo({x: 0, y: 150 * index});
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
                <TouchableOpacity
                  style={styles.recipeCard}
                  onPress={() => {
                    setViewRecipe(meal)
                    navigation.navigate('Recipe')}}>
                  <RecipeDetails
                    // <RecipeCard
                    recipe={meal}
                    key={meal.Id}
                    handleCartMeals={props.handleCartMeals}
                    cartMeals={props.cartMeals}
                  />
                </TouchableOpacity>
              ))}
            </>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
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
  currentCategory: {
    backgroundColor: '#E56A25',
    borderWidth: 1,
    borderColor: '#E56A25',
    borderRadius: 40,
    alignItems: 'center',
  },
  category: {
    // backgroundColor: '#E56A25',
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 40,
    // marginRight: 10,
    justifyContent: 'center',
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
