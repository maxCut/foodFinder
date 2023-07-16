/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, Component, useEffect} from 'react';
import {Button, TouchableOpacity, Platform} from 'react-native';
import type {Node} from 'react';
// import mealVals from './meals.json';
import mealVals from './mealsCopy.json';
import ingredientVals from './ingredients.json';
import {Linking, NavState} from 'react-native';
import {WebView} from 'react-native-webview';
import DOMParser from 'react-native-html-parser';
import {LogBox} from 'react-native';
var HTMLParser = require('fast-html-parser');
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import RecipeLandingScreen from './Screens/recipeLandingScreen';
import CartScreen from './Screens/cartScreen';
import RecipeScreen from './Screens/recipeScreen';
import {NavigationContainer} from '@react-navigation/native';
import Icons from 'react-native-vector-icons/MaterialIcons';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {wrap} from 'module';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';

const webPages = {
  checkout:
    'https://www.amazon.com/cart/localmarket?ref_=ewc_gtc&almBrandId=QW1hem9uIEZyZXNo',
};
/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
 * LTI update could not be added via codemod */

const App: () => Node = () => {
  // const isDarkMode = useColorScheme() === 'dark';
  // const backgroundStyle = {
  //   backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  // };
  const [meals, setMeals] = useState([]);
  const [oneTimes, setOneTimes] = useState([]);
  const [pageState, setPageState] = useState('Main');
  const [html, setHtml] = useState('<html>Loading</html>');
  const [pageUrl, setPageUrl] = useState('');
  const [mealSectionStates, setMealSectionStates] = useState(new Map());
  let emptyCart = new Map();
  const [cartMeals, setCartMeals] = useState(emptyCart);
  const [viewRecipe, setViewRecipe] = useState(null);

  const Tab = createBottomTabNavigator();
  const Stack = createStackNavigator();

  const handleOneTimes = (key, value) => {
    if (oneTimes.includes(key)) {
      let tmp = oneTimes;
      tmp.splice(tmp.indexOf(key), 1);
      setOneTimes(Array.from(tmp));
    } else {
      setOneTimes(prev => {
        prev.push(key);
        return Array.from(prev);
      });
    }
  };

  const handleCartMeals = (event, meal, value) => {
    if (cartMeals.has(meal)) {
      if (value == 'increment') {
        setCartMeals(prev => new Map(prev.set(meal, prev.get(meal) + 1)));
      } else {
        setCartMeals(prev => {
          let quantity = prev.get(meal);
          if (quantity == 1) {
            prev.delete(meal);
            return new Map(prev);
          } else {
            return new Map(prev.set(meal, quantity - 1));
          }
        });
      }
    } else {
      if (value == 'increment') {
        setCartMeals(prev => new Map(prev.set(meal, 1)));
      }
    }
  };

  function mealAddedEvent(id) {
    meals[id].OneTimes.forEach(oneTimeId => {
      var oneTimeIngredient = ingredientVals[oneTimeId];
      addOneTime(
        oneTimeIngredient.Name,
        oneTimeIngredient.Options[0].Img,
        oneTimeId,
        meals[id].IncrementAmount,
      );
    });
  }

  function mealRemovedEvent(id) {
    meals[id].OneTimes.forEach(oneTimeId => {
      var oneTimeIngredient = ingredientVals[oneTimeId];
      //removeOneTime(oneTimeId, meals[id].IncrementAmount);
    });
  }

  function addOneTime(oneTime) {
    setOneTimes([...oneTimes, oneTime]);
  }

  async function fetchOffer(element) {
    const response = await fetch(
      `https://www.amazon.com/gp/product/${element.asin}?almBrandId=QW1hem9uIEZyZXNo&fpw=alm&linkCode=ll1&tag=foodfinder00-20`,
    );
    const html2 = await response.text();
    const parser = new DOMParser.DOMParser({
      errorHandler: {
        warning: function (w) {},
        error: function (e) {},
        fatalError: function (e) {
          console.error(e);
        },
      },
    });

    const parsed = parser.parseFromString(html2);
    const listingId = parsed.getElementById('offerListingID');
    const addToCartForm = parsed.getElementById('addToCart');
    const csfrToken = Array.from(addToCartForm.elements).filter(_element => {
      return _element.name === 'CSRF';
    });
    if (csfrToken.length > 0) {
      return [listingId, csfrToken[0].value];
    }
    throw Error("can't get token");
  }

  async function addFirstListedItemToCart(element) {
    let offer = '';
    let token = '';
    for (const option of element) {
      [offer, token] = fetchOffer(option);
      if (offer === '') {
        continue;
      }
      let body = {
        asin: option.asin,
        brandId: 'QW1hem9uIEZyZXNo',
        clientID: 'fresh-nereid',
        offerListingID: offer,
        quantity: option.quantity,
        csrfToken: token,
      };
      try {
        await fetch('https://www.amazon.com/alm/addtofreshcart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
          body: JSON.stringify(body),
        });
      } catch {
        continue;
      }
      return;
    }
  }
  async function sendToCart(asin_set) {
    for (const element of asin_set) {
      addFirstListedItemToCart(element);
    }
  }

  async function checkout() {
    const meals = getSelectedItems();
    return;
    await sendToCart(meals);
  }
  function getSelectedItems() {
    const meals = mealSectionStates.keys;
    let ingredients = new Map();
    for (const meal in meals) {
    }
  }

  async function checkLoggedIn() {
    try {
      const response = await fetch('https://www.amazon.com');
      const html2 = await response.text();
      const parser = new DOMParser.DOMParser({
        errorHandler: {
          warning: function (w) {},
          error: function (e) {},
          fatalError: function (e) {
            console.error(e);
          },
        },
      });

      const parsed = parser.parseFromString(html2);
      return parsed
        .getElementById('nav-link-accountList')
        .toString()
        .includes('nav_youraccount_btn');
    } catch {}
    return false;
  }

  var webPageState = null;
  async function updateWebPage() {
    var loggedIn = await checkLoggedIn();
    if (loggedIn) {
      if (webPageState === 'Checkout') {
        return;
      }
      webPageState = 'Checkout';
      checkout();
      setPageUrl(webPages.checkout); //TODO this should happen after added to cart
    } else {
      if (webPageState === 'Login') {
        return;
      }
      webPageState = 'Login';
      await loadLoginPrompt();
    }
  }

  async function loadLoginPrompt() {
    LogBox.ignoreAllLogs();
    try {
      const response = await fetch('https://www.amazon.com');
      const html2 = await response.text();
      const parser = new DOMParser.DOMParser({
        errorHandler: {
          warning: function (w) {},
          error: function (e) {},
          fatalError: function (e) {
            console.error(e);
          },
        },
      });
      const parsed = parser.parseFromString(html2);
      const loginURL = parsed.getElementById('nav-flyout-ya-signin').firstChild
        .attributes[0].nodeValue;
      setPageUrl(loginURL);
    } catch {}
  }

  useEffect(() => {
    setMeals(mealVals);
    updateWebPage();
  }, []);

  const MainScreens = () => {
    return (
      <Tab.Navigator
        screenOptions={({route}) => ({
          headerShown: false,
          tabBarStyle: {backgroundColor: '#34383F'},
          tabBarIcon: ({focused}) => {
            let iconName;
            let iconColor;
            if (route.name === 'Home') {
              iconName = 'home';
            } else if (route.name === 'Cart') {
              iconName = 'shopping-cart';
            }
            iconColor = focused ? '#E56A25' : '#C8D0D4';
            return <Icons name={iconName} size={25} color={iconColor} />;
          },
          tabBarActiveTintColor: '#E56A25',
          tabBarInactiveTintColor: 'gray',
        })}>
        <Tab.Screen
          name="Home"
          children={() => (
            <RecipeLandingScreen
              setViewRecipe={setViewRecipe}
              handleCartMeals={handleCartMeals}
              cartMeals={cartMeals}
            />
          )}
        />
        <Tab.Screen
          name="Cart"
          children={() => (
            <CartScreen
              handleCartMeals={handleCartMeals}
              handleOneTimes={handleOneTimes}
              cartMeals={cartMeals}
              oneTimes={oneTimes}
              setPageState={setPageState}
            />
          )}
        />
      </Tab.Navigator>
    );
  };

  const RecipeScreenWithProps = () => {
    return (
      <RecipeScreen
        recipe={viewRecipe}
        handleCartMeals={handleCartMeals}
        cartMeals={cartMeals}
      />
    );
  };
  
  if (pageState === 'Main') {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Main"
            component={MainScreens}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Recipe"
            component={RecipeScreenWithProps}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  } else if (pageState === 'Web') {
    return (
      <View style={styles.webView}>
        <Button
          title="Back"
          onPress={async () => {
            setPageState('Main');
          }}
        />
        <WebView
          source={{uri: pageUrl}}
          onNavigationStateChange={({url, _}) => {
            updateWebPage();
          }}
        />
      </View>
    );
  }
};
const styles = StyleSheet.create({
  webView: {flex: 1, ...Platform.select({ios: {marginTop: 40}})},
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
