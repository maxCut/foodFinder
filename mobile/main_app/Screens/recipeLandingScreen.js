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
          return (
            <TouchableOpacity
              style={
                currentView >= 150 * index && currentView < 150 * (index + 1)
                  ? styles.currentCategory
                  : styles.category
              }
              onPress={() => {
                scrollView.current.scrollTo({x: 0, y: 150 * index});
              }}>
              <Typography>{item.name}</Typography>
            </TouchableOpacity>
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
