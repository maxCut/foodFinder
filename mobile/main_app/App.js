/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, Component, useEffect} from 'react';
import {Button, TouchableOpacity} from 'react-native';
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
import RecipeCard from './components/recipeCard';
import RecipeLandingScreen from './Screens/recipeLandingScreen';
import CartScreen from './Screens/cartScreen';
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

const webPages = {
  checkout:
    'https://www.amazon.com/cart/localmarket?ref_=ewc_gtc&almBrandId=QW1hem9uIEZyZXNo',
};
/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
 * LTI update could not be added via codemod */
const Section = ({children, title}): Node => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const Counter = ({mealId, mealSectionStates, setMealSectionStates}): Node => {
  const [state, setState] = useState(0);

  useEffect(() => {
    setMealSectionStates(mealSectionStates.set(mealId, state));
  }, [mealId, mealSectionStates, setMealSectionStates, state]);
  return (
    <View style={{alignItems: 'flex-end', flexDirection: 'row'}}>
      <Button
        onPress={() => {
          if (state > 0) {
            setState(state - 1);
          }
        }}
        title="-"
      />
      <Text>{state}</Text>
      <Button
        onPress={() => {
          setState(state + 1);
        }}
        title="+"
      />
    </View>
  );
};

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const [meals, setMeals] = useState([]);
  const [oneTimes, setOneTimes] = useState([]);
  const [pageState, setPageState] = useState('Main');
  const [html, setHtml] = useState('<html>Loading</html>');
  const [pageUrl, setPageUrl] = useState('');
  const mealSectionRef = React.useRef(null);
  const [mealSectionStates, setMealSectionStates] = useState(new Map());
  let emptyCart = new Map();
  const [cartMeals, setCartMeals] = useState(emptyCart);

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
    // event.stopPropagation()
    // console.log('handle cart meals');
    console.log(cartMeals);
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
    //setMeals(mealVals);
    setMeals(mealVals);
    updateWebPage();
  }, []);

  const Tab = createBottomTabNavigator();

  const Body = props => {
    return (
      <SafeAreaView
        style={{backgroundColor: '#1B2428', alignItems: 'center', flex: 1}}>

          {props.children}

      </SafeAreaView>
    );
  };

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({route}) => ({
          headerShown: false,
          tabBarStyle: {backgroundColor: '#34383F'},
          tabBarIcon: ({focused, color, size}) => {
            let iconName;
            let iconColor;

            if (route.name === 'Home') {
              iconName = 'home';
            } else if (route.name === 'Cart') {
              iconName = 'shopping-cart';
            }
            iconColor = focused ? '#E56A25' : '#C8D0D4';

            // You can return any component that you like here!
            return <Icons name={iconName} size={25} color={iconColor} />;
          },
          tabBarActiveTintColor: '#E56A25',
          tabBarInactiveTintColor: 'gray',
        })}>
        <Tab.Screen
          name="Home"
          children={() => (
            // <Body>
              <RecipeLandingScreen
                // ref={mealSectionRef}
                handleCartMeals={handleCartMeals}
                cartMeals={cartMeals}
              />
            // </Body>
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
              />
          )}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );

  //setMeals([{id: 2, name: 'foo'}]);
  if (pageState === 'Main') {
    return (
      <SafeAreaView style={backgroundStyle}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor}
        />
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={backgroundStyle}>
          <View
            style={{
              // backgroundColor: isDarkMode ? Colors.black : Colors.white,
              backgroundColor: '#1B2428',
            }}>
            <Section id="meals" title="Step One">
              <RecipeLandingScreen
                ref={mealSectionRef}
                handleCartMeals={handleCartMeals}
                cartMeals={cartMeals}
              />
            </Section>
            <Button
              title="Checkout"
              onPress={async () => {
                setPageState('Web');
              }}
            />
            <Section title="Select any spices you don't have">
              <ReloadInstructions />
            </Section>
            <Section title="Debug">
              <DebugInstructions />
            </Section>
            <Section title="Learn More">
              Read the docs to discover what to do next:
            </Section>
            <LearnMoreLinks />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  } else if (pageState === 'Web') {
    //fetch('http://www.google.com').then(response => {
    //const html = response.text();
    //const parser = new DOMParser.DOMParser();
    //parsed = parser.parseFromString(html, 'text/html');
    //parsed.getElementsByAttribute('class', 'b');
    //});
    return (
      <View
        style={{
          flex: 1,
        }}>
        <Button
          title="Back"
          onPress={async () => {
            setPageState('Main');
          }}
        />
        <WebView
          source={{uri: pageUrl}}
          style={{marginTop: 20}}
          onNavigationStateChange={({url, _}) => {
            updateWebPage();
          }}
        />
      </View>
    );
  }
};

const styles = StyleSheet.create({
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
