import {Card} from 'react-native-paper';
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  TouchableOpacity,
  View,
  Image,
  Button,
} from 'react-native';

const RecipeCard = props => {
  let meal = props.recipe;

  let inCart = false;
  if (props.cartMeals.has(meal)) {
    inCart = true;
  }
  const AddToCartButton = () => {
    return (
      <View>
        {inCart ? (
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              style={styles.circleButton}
              onPress={event =>
                props.handleCartMeals(event, meal, 'decrement')
              }>
              <Text style={{...styles.buttonText, fontWeight: 'bold'}}>-</Text>
            </TouchableOpacity>
            <View style={{alignItems: 'center', flex: 1}}>
              <Text style={styles.inCartText}>
                {props.cartMeals.get(meal)} in your cart
              </Text>
              <Text style={styles.inCartText}>
                {props.recipe.IncrementAmount} servings
              </Text>
            </View>
            <TouchableOpacity
              style={styles.circleButton}
              onPress={event =>
                props.handleCartMeals(event, meal, 'increment')
              }>
              <Text style={{...styles.buttonText, fontWeight: 'bold'}}>+</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.button}
            onPress={event => props.handleCartMeals(event, meal, 'increment')}>
            <Text style={{...styles.buttonText, fontWeight: 'bold'}}>
              Add to Cart
            </Text>
            <Text style={{...styles.buttonText, fontSize: 10}}>
              {props.recipe.IncrementAmount} servings
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };
  return (
    // <Card
    // //   theme={{colors: {surfaceVariant: '#9EF662'}}}
    //   type="contained"
    //   elevation={0}
    //   style={{display: 'flex'}}>
    //   <Card.Cover source={{uri: props.recipe.Image}} />
    //   <Card.Title title={props.recipe.Name} />
    //   <Card.Content>
    //     <Text>{props.recipe.description}</Text>
    //   </Card.Content>
    // </Card>
    <View style={styles.background}>
      <Image
        styles={styles.image}
        source={{width: 150, height: 150, uri: props.recipe.Image}}
      />
      <View style={{flex: 1, padding: 15}}>
        <View style={{flex: 1}}>
          <Text style={{fontWeight: 'bold', color: '#fff'}}>
            {props.recipe.Name}
          </Text>
          <Text style={{fontSize: 10, color: '#fff'}}>
            {props.recipe.description}
          </Text>
          <Text style={{fontSize: 10, color: '#fff'}}>
            {props.recipe.cookTime} min | {props.recipe.IncrementAmount}{' '}
            servings
          </Text>
        </View>
        <AddToCartButton />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flexDirection: 'row',
    backgroundColor: '#34383F',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
    width: 350,
  },
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
});

export default RecipeCard;
