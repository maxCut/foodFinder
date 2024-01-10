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
import EditRecipeScreen from './Screens/editRecipeScreen';
import MyRecipeScreen from './Screens/myRecipeScreen';
import {NavigationContainer} from '@react-navigation/native';
import Icons from 'react-native-vector-icons/MaterialIcons';
import amazonUtils from './Utils/amazonUtils';
import imageCacheUtils from './Utils/imageCacheUtils';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import analytics from '@react-native-firebase/analytics';
import AmazonCheckoutFlow from './Screens/amazonCheckoutFlow';
import storage from './components/storage';

/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
 * LTI update could not be added via codemod */

const cartMealsGlobal = new Map();
const oneTimesGlobal = [];
const App = () => {
  // const isDarkMode = useColorScheme() === 'dark';
  // const backgroundStyle = {
  //   backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  // };
  const [pageState, setPageState] = useState('Main');
  const [pageUrl, setPageUrl] = useState('');
  const [viewRecipe, setViewRecipe] = useState(null);
  const [itemsToAdd,setItemsToAdd] = useState(1);
  const [itemsAdded,setItemsAdded] = useState(0);

  const [mealVals, setMealVals] = useState(require("./meals.json"))
  const [userMealVals, setUserMealVals] = useState([])
  const [imageCache, setImageCache] = useState(new Map())
  const [refreshTrigger, setRefreshTrigger] = useState(false)
useEffect(() => {
  fetch('https://www.chefbop.com/shared/meals.json').then((response)=>{
    response.json().then((json)=>
    {
      setMealVals(json)
    })
  }).catch(()=>{})
}, [setMealVals]);

useEffect(() => {
  storage
  .load({
    key: 'recipes',
  })
  .then(ret => {
    console.log(ret);
    setUserMealVals(ret.recipeList)
  })

}, [setUserMealVals]);

useEffect(()=>{
  setImageCache(imageCacheUtils.loadImageCache([...mealVals,userMealVals]))
},[mealVals,userMealVals])


  const Tab = createBottomTabNavigator();
  const Stack = createStackNavigator();

  const handleOneTimes = (key, setOneTimes) => {
    if (oneTimesGlobal.includes(key)) {
      oneTimesGlobal.splice(oneTimesGlobal.indexOf(key), 1);
    } else {
      oneTimesGlobal.push(key);
    }
    setOneTimes([...oneTimesGlobal])
  };
  
  
const handleCartMeals = (event, meal, value, setCartMealsLocal, cartMealsLocal) => {
  if (cartMealsGlobal.has(meal)) {
    if (value == 'increment') {
      cartMealsGlobal.set(meal,cartMealsGlobal.get(meal)+1)
    } else {
      if (cartMealsGlobal.get(meal) == 1) {
        cartMealsGlobal.delete(meal);
      } else {
        cartMealsGlobal.set(meal,cartMealsGlobal.get(meal)-1)
      }
    }
  } else {
    if (value == 'increment') {
      cartMealsGlobal.set(meal, 1);
    }
  }
  setCartMealsLocal(new Map(cartMealsGlobal));
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
      analytics().logEvent('fail', {
       "error": error,
       "detail" : "loading url failed"
      })
    }
  }

async function checkout() {

  const ingredientDatas = amazonUtils.getIngredientsForPurchase(cartMealsGlobal,oneTimesGlobal);
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
  setPageState("Cart")
  cartMealsGlobal.clear() //empty the cart after added to amazon
}

function addNewMealVal(meal)
{
  setUserMealVals([...userMealVals,meal])
}
function updateMealVal(meal,index)
{
  //TODO
}


  const MainScreens = props => {
    return (
      <Tab.Navigator
        screenOptions={({route}) => ({
          headerShown: false,
          tabBarStyle: {backgroundColor: '#34383F'},
          tabBarIcon: ({focused}) => {
            let iconName;
            let iconColor;
            if (route.name === 'Featured Recipes') {
              iconName = 'star';
            } else if (route.name === 'Pre-Cart') {
              iconName = 'shopping-cart';
            } else if (route.name === 'My Recipes') {
            iconName = 'list-alt';
          }
            iconColor = focused ? '#E56A25' : '#C8D0D4';
            return <Icons name={iconName} size={25} color={iconColor} />;
          },
          tabBarActiveTintColor: '#E56A25',
          tabBarInactiveTintColor: 'gray',
        })}
        screenListeners={{tabPress:()=>{
          setPageState("Main")
          setRefreshTrigger(!refreshTrigger)}}}>
          <Tab.Screen
            name="Featured Recipes"
            children={() => (
              <RecipeLandingScreen
              handleCartMeals={handleCartMeals}
                setViewRecipe={setViewRecipe}
                cartMealsGlobal={cartMealsGlobal}
                mealVals = {mealVals}
                imageCache = {imageCache}
                refreshTrigger = {refreshTrigger}
  
              />
            )}
          />
          <Tab.Screen
            name="My Recipes"
            children={() => (
              <MyRecipeScreen
                setPageState = {setPageState}
              handleCartMeals={handleCartMeals}
                setViewRecipe={setViewRecipe}
                cartMealsGlobal={cartMealsGlobal}
                mealVals = {mealVals}
                imageCache = {imageCache}
                refreshTrigger = {refreshTrigger}
                userMealVals = {userMealVals}
                setUserMealVals = {setUserMealVals}
  
              />
            )}
          />
        <Tab.Screen
          name="Pre-Cart"
          children={
            () => {
              if(pageState==='Main')
              {
                
              return (
            <CartScreen
              handleOneTimes={handleOneTimes}
              cartMealsGlobal={cartMealsGlobal}
              oneTimesGlobal={oneTimesGlobal}
              handleCartMeals={handleCartMeals}
              oneTimes={oneTimesGlobal}
              tryToReachCheckout={tryToReachCheckout}
              imageCache = {imageCache}
              refreshTrigger = {refreshTrigger}
            />
          )
        }
        else{
    return(<AmazonCheckoutFlow 
      pageState = {pageState} 
      setPageState = {setPageState} 
      checkIfUserLoggedIn = {checkIfUserLoggedIn} 
      pageUrl = {pageUrl} 
      itemsToAdd = {itemsToAdd} 
      itemsAdded= {itemsAdded}/>)
        }
      }}
        />
      </Tab.Navigator>
    );
  };
    return (
      <NavigationContainer >
        <Stack.Navigator>
          <Stack.Screen
            name="Main"
            component={MainScreens}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Recipe"
            options={{headerShown: false}}
            children={()=>{return (<RecipeScreen 
              recipe={viewRecipe}
              handleCartMeals={handleCartMeals}
              cartMealsGlobal={cartMealsGlobal}/>)}}
              refreshTrigger = {refreshTrigger}
            
          />
          <Stack.Screen
            name="EditRecipe"
            options={{headerShown: false}}
            children={()=>{return (<EditRecipeScreen recipe = {viewRecipe}
            onSave = {(result)=>{addNewMealVal(result)}}/>)}}
          />
        </Stack.Navigator>
        
      </NavigationContainer>
    );
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
