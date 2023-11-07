
import DOMParser from 'react-native-html-parser';
import ingredientHandler from './ingredientHandler';
import analytics from '@react-native-firebase/analytics';
const getIngredient = ingredientHandler.getOneTime;

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
        const token = addToCart.csrfToken;
        const offer = addToCart.offerListingID;
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

      console.log("trying here")
      const res = await fetchOffer(option);
    offer = res[0];
    token = res[1];
    }
    catch(exception)
    {
      console.log("exception getting item " + exception)

analytics().logEvent('error', {
  "error": exception,
  "detail" : "getting item failed",

  "asin": option.asin,
 })

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
    } catch(exception) {
      console.log("exception adding item " + exception)

analytics().logEvent('error', {
  "error": exception,
  "detail" : "adding item failed",
  "asin": option.asin,
 })
      continue;
    }
    return;
  }
}
async function sendToCart(asin_set, onItemAdded) {
  let count = 0;
  for (const element of asin_set) {
    count+=1;
    onItemAdded(count)
    await addFirstListedItemToCart(element);
  }
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

function getIngredientsForPurchase(cartMeals,oneTimes)
{
    const neededTotalIngredientsMap = getSelectedItems(cartMeals,oneTimes)
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

function getSelectedItems(cartMeals,oneTimes) {
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
  } catch(error) {
    console.log("error checking if logged in" +error)
  }
  return false;
}


const amazonUtils = {
  getIngredientsForPurchase,
  sendToCart,
  checkLoggedIn,
};
export default amazonUtils;