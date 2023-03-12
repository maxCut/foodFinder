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
import mealVals from './meals.json';
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

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {wrap} from 'module';

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
const Counter: () => Node = () => {
  const [state, setState] = useState(0);
  return (
    <View style={{alignItems: 'flex-end', flexDirection: 'row'}}>
      <Button
        onPress={() => {
          setState(state - 1);
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
      setPageUrl(webPages.checkout);
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
    var loggedIn = await checkLoggedIn();
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
              backgroundColor: isDarkMode ? Colors.black : Colors.white,
            }}>
            <Section title="Step One">
              <View>
                <Text>Select yoour meals</Text>
                {meals.map(item => (
                  <View key={item.Id}>
                    <Text>{item.Name}</Text>
                    <Counter />
                  </View>
                ))}
              </View>
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