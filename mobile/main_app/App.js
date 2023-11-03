/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect,memo} from 'react';
import {Button, Platform} from 'react-native';
// import mealVals from './meals.json';
import {WebView} from 'react-native-webview';
import DOMParser from 'react-native-html-parser';
import {LogBox} from 'react-native';
import Typography from './components/typography';
import {ActivityIndicator} from 'react-native';
import {
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';
import RecipeLandingScreen from './Screens/recipeLandingScreen';
import CartScreen from './Screens/cartScreen';
import RecipeScreen from './Screens/recipeScreen';
import {NavigationContainer} from '@react-navigation/native';
import Icons from 'react-native-vector-icons/MaterialIcons';
import amazonUtils from './Utils/amazonUtils';
import imageCacheUtils from './Utils/imageCacheUtils';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import analytics from '@react-native-firebase/analytics';
import LoadingScreen from './Screens/loadingScreen';
import AmazonWebView from './Screens/amazonWebView';
import AmazonLogin from './Screens/amazonLogin';
import CookieManager from '@react-native-cookies/cookies';

/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
 * LTI update could not be added via codemod */

const App = () => {
  // const isDarkMode = useColorScheme() === 'dark';
  // const backgroundStyle = {
  //   backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  // };
  const [oneTimes, setOneTimes] = useState([]);
  const [pageState, setPageState] = useState('Main');
  const [pageUrl, setPageUrl] = useState('');
  let emptyCart = new Map();
  const [cartMeals, setCartMeals] = useState(emptyCart);
  const [viewRecipe, setViewRecipe] = useState(null);
  const [itemsToAdd,setItemsToAdd] = useState(1);
  const [itemsAdded,setItemsAdded] = useState(0);

  const [mealVals, setMealVals] = useState(require("./mealsCopy.json"))
  const [imageCache, setImageCache] = useState(new Map())
useEffect(() => {
  fetch('https://www.chefbop.com/shared/mealsCopy.json').then((response)=>{
    response.json().then((json)=>
    {
      setMealVals(json)
    })
  }).catch(()=>{})
}, [setMealVals]);

useEffect(()=>{
  setImageCache(imageCacheUtils.loadImageCache(mealVals))
},[mealVals])

useEffect(()=>{
// clear cookies
CookieManager.clearAll()
})

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

  var webPageState = null;
  async function checkIfUserLoggedIn() {
    var loggedIn = await amazonUtils.checkLoggedIn();
    if (loggedIn) {
      if (webPageState === 'Checkout') {
        return;
      }
      webPageState = 'Checkout';
     await checkout();
    } 
    else {
      if (webPageState === 'Login') {
        return;
      }
      webPageState = 'Login';
      await loadLoginPrompt();
      setPageState("Login")
    }
  }
  
  async function tryToReachCheckout()
  {
    setPageState("Loading")
    checkIfUserLoggedIn();
  }
  
  async function loadLoginPrompt(){
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
    } catch(error) {
      
      console.log('error loading url may be web error : ', error)
    }
  }


async function checkout() {

  const ingredientDatas = amazonUtils.getIngredientsForPurchase(cartMeals,oneTimes);
  let cart = [];
  for(const element of ingredientDatas.keys() )
  {
    cart.push(ingredientDatas.get(element))
  }
  analytics().logEvent('checkout', {
   "cart": cart
  })
  
  setPageState("Loading")
  setItemsToAdd(cart.length)
  await amazonUtils.sendToCart(cart,(itemsAdded)=>{setItemsAdded(itemsAdded)});
  setCartMeals(emptyCart) //empty the cart after added to amazon
  setPageState("Cart")
}


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
              mealVals = {mealVals}
              imageCache = {imageCache}
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
              tryToReachCheckout={tryToReachCheckout}
              imageCache = {imageCache}
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
            component={memo(MainScreens)}
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
  } else if (pageState === 'Login') {
    return (
      <AmazonLogin setPageState = {setPageState} checkIfUserLoggedIn = {checkIfUserLoggedIn} pageUrl = {pageUrl}/>
    );
  }
  else if(pageState === 'Loading')
  {
    return (<LoadingScreen itemsToAdd = {itemsToAdd} itemsAdded= {itemsAdded}/>);
  }
  else if(pageState === 'Cart')
  {
    return (
      <AmazonWebView setPageState = {setPageState}/>
    );
  }
};
const styles = StyleSheet.create({
  background: {backgroundColor: '#1B2428', flex: 1},
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
