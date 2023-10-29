/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState} from 'react';
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
} from 'react-native';
import RecipeLandingScreen from './Screens/recipeLandingScreen';
import CartScreen from './Screens/cartScreen';
import RecipeScreen from './Screens/recipeScreen';
import {NavigationContainer} from '@react-navigation/native';
import Icons from 'react-native-vector-icons/MaterialIcons';
import ingredientHandler from './Utils/ingredientHandler';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';

const webPages = {
  checkout:
    'https://www.amazon.com/cart/localmarket?ref_=ewc_gtc&almBrandId=QW1hem9uIEZyZXNo',
};
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
  const getIngredient = ingredientHandler.getOneTime;
  const [itemsToAdd,setItemsToAdd] = useState(1);
  const [itemsAdded,setItemsAdded] = useState(0);

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


  function getFirstGreaterThanTarget(target, arr) {
    lowerBound = 0;
    upperBound = arr.length;
    if (arr[lowerBound] > target) {
        return arr[lowerBound];
    }
    while (lowerBound < upperBound) {
        pivot = Math.floor((lowerBound + upperBound) / 2);
        if (arr[pivot] == target) {
            return arr[pivot + 1];
        } else if (arr[pivot] < target) {
            lowerBound = pivot;
        } else {
            upperBound = pivot;
        }
        if (upperBound == lowerBound) {
            return arr[upperBound + 1];
        }
        if (upperBound - lowerBound == 1) {
            return arr[upperBound];
        }
    }
}

  function parseHtmlForTagsThatContainSubString(html, searchword) {
    allTags = [...html.matchAll(new RegExp("<[^<>]+>", "gi"))].map(
        (a) => a.index
    );
    searchwordTags = [
        ...html.matchAll(new RegExp("<[^<>]*" + searchword + "[^<>]*>", "gi")),
    ].map((a) => a.index);
    retTags = [];
    searchwordTags.forEach((index) => {
        closeIndex = getFirstGreaterThanTarget(index, allTags);
        retTags.push(html.substring(index, closeIndex));
    });
    return retTags;
}
  async function fetchOffer(element){
    const response = await fetch(
      `https://www.amazon.com/gp/product/${element.asin}?almBrandId=QW1hem9uIEZyZXNo&fpw=alm&linkCode=ll1&tag=chefbop-20`,
    );
    const html2 = await response.text();
    let tags = parseHtmlForTagsThatContainSubString(
      html2,
      "data-fresh-add-to-cart"
  )
    for (let i = 0; i < tags.length; i++) {
      let tag = tags[i];
      let addToCartStartIndex = tag.search("{&quot;");
      let addToCartStopIndex = tag.search("&quot;}") + 7;
      let unformatedString = tag.substring(
          addToCartStartIndex,
          addToCartStopIndex
      );
      let formatedString = unformatedString.replaceAll("&quot;", '"');
      let addToCart = JSON.parse(formatedString);

      if (addToCart.asin == element.asin) {
          token = addToCart.csrfToken;
          offer = addToCart.offerListingID;
          return [offer, token];
      }
  }
    return [null,null]
  }

  async function addFirstListedItemToCart(element) {
    let offer = '';
    let token = '';
    for (const option of element) {
      try{

      [offer, token] = await fetchOffer(option);
      }
      catch(exception)
      {}
      if(1>0) //TODO remove
      {
        return;
      }
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
    console.log("here1")
    setItemsToAdd(asin_set.length)
    let count = 0;
    for (const element of asin_set) {
      count+=1;
      setItemsAdded(count)
      console.log("here 2")
      await addFirstListedItemToCart(element);
    }
  }

  async function checkout() {
    const ingredientDatas = getIngredientsForPurchase();
    let cart = [];
    for(const element of ingredientDatas.keys() )
    {
      cart.push(ingredientDatas.get(element))
    }
    console.log("here")
    setPageState("Loading")
    await sendToCart(cart);
    console.log("now here")
    setPageState("Cart")
  }

  function getOptionQuantity(neededAmount,ingredientData,oneTime)
  {
      if(oneTime)
      {
        return {asin:ingredientData.ASIN,quantity:1}
      }
      return {asin:ingredientData.ASIN,quantity:Math.ceil(neededAmount/ingredientData.Unit_Size)}
  }
  function getOptionQuantities(neededAmount,ingredientDatas, oneTime)
  {
      optionArray = []
      ingredientDatas.forEach(ingredientData => {
          optionArray.push(getOptionQuantity(neededAmount, ingredientData, oneTime))
      });
      return optionArray
  }

  function getIngredientsForPurchase()
  {
      const neededTotalIngredientsMap = getSelectedItems()
      let ingredientPurchaseMap = new Map()
      
    for (const ingredient of neededTotalIngredientsMap.keys()) 
          {
              const neededAmount = neededTotalIngredientsMap.get(ingredient)
              //ingredientData = ingredients[ingredient].Options[0]
              const isOneTime = ingredient[0]=='p'
              const optionQuantities =  getOptionQuantities(neededAmount,getIngredient(ingredient).Options,isOneTime)
              ingredientPurchaseMap.set(ingredient,optionQuantities)
          }

      return ingredientPurchaseMap
  }

  function getSelectedItems() {
    let ingredients = new Map();
    for (const [meal, quantity] of cartMeals.entries()) { //ingredients
      for (const [ingredient, amount] of meal.Ingredients) {
        if (ingredients.has(ingredient)) {
          ingredients.set(
            ingredient,
            ingredients.get(ingredient) + amount * quantity,
          );
          ingredients[ingredient] += amount * quantity;
        } else {
          ingredients.set(ingredient, amount * quantity);
        }
      }
    }
    for(const oneTime of oneTimes)
    {
      ingredients.set(oneTime,1)
    }
    return ingredients
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
     await checkout();
    } 
    else {
      if (webPageState === 'Login') {
        return;
      }
      webPageState = 'Login';
      await loadLoginPrompt();
    }
  }

  async function tryToReachCheckout()
  {
    console.log("here")
    setPageState("Loading")
    var loggedIn = await checkLoggedIn();
    if (loggedIn) {
      updateWebPage();
    }
    else{
      setPageState("Web")
    }
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
              tryToReachCheckout={tryToReachCheckout}
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
  else if(pageState === 'Loading')
  {
    console.log("loading")
    return (<View style={{...styles.background, padding:80}}>
      <Typography style = {{textAlign:'center', margin: 30}} variant="header2">Adding items to cart</Typography>
      <Text style = {{textAlign:'center'}} >
      <ActivityIndicator size={"large"}/>;
      </Text>
      <Typography style = {{textAlign:'center', margin: 10}} variant="header2">{100*itemsAdded/itemsToAdd}%</Typography>
    </View>);
  }
  else if(pageState === 'Cart')
  {
    console.log("cart")
    return (
      <View style={styles.webView}>
        <Button
          title="Back"
          onPress={async () => {
            setPageState('Main');
          }}
        />
        <WebView
          source={{uri: webPages.checkout}}
        />
      </View>
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
