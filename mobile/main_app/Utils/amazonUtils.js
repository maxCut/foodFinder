
import DOMParser from 'react-native-html-parser';
import ingredientHandler from './ingredientHandler';
import analytics from '@react-native-firebase/analytics';
import htmlParser from './htmlParser'
import nlp from "compromise";
const getIngredient = ingredientHandler.getOneTime;

async function fetchOffer(element){
  console.log("attempting ",`https://www.amazon.com/gp/product/${element.asin}?almBrandId=QW1hem9uIEZyZXNo&fpw=alm&linkCode=ll1&tag=chefbop-20` )
  const response = await fetch(
    `https://www.amazon.com/gp/product/${element.asin}?almBrandId=QW1hem9uIEZyZXNo&fpw=alm&linkCode=ll1&tag=chefbop-20`,
  );
  const html2 = await response.text();
  let tags = htmlParser.parseHtmlForTagsThatContainSubString(
    html2,
    "data-fresh-add-to-cart"
)
const innerHTML =  htmlParser.parseURLForTagsThatContainSubstringAndReturnInnerHTML(`https://www.amazon.com/gp/product/${element.asin}?almBrandId=QW1hem9uIEZyZXNo&fpw=alm&linkCode=ll1&tag=chefbop-20`,"data-fresh-add-to-cart")
console.log(innerHTML);
  for (let i = 0; i < tags.length; i++) {
    let tag = tags[i];
    let addToCartStartIndex = tag.search("{&quot;");
    let addToCartStopIndex = tag.search("&quot;}") + 7;
    let unformatedString = tag.substring(
        addToCartStartIndex,
        addToCartStopIndex
    );
    let formatedString = unformatedString.replaceAll("&quot;", '"');
    console.log("herer 3.5, ", formatedString);
    try
    {
    let addToCart = JSON.parse(formatedString);
    if (addToCart.asin == element.asin) {
      console.log("here4 ", addToCart.asin,element.asin)
        const token = addToCart.csrfToken;
        const offer = addToCart.offerListingID;
        if(offer!=null)
        {
          return [offer, token];
        }
        continue;
    }
    }
    catch
    {
      continue;
    }

}
  return [null,null]
}

async function findItem(searchTerm)
{
  if(searchTerm.length<=0)
  {
    return []
  }
  const sanitizedSearchTerm = searchTerm.replaceAll(" ","_").replaceAll(",","").replaceAll(/[^a-z0-9áéíóúñü \.,_-]/gim,"").trim()
  const URL = "https://www.amazon.com/s?k="+sanitizedSearchTerm+"&rh=p_n_alm_brand_id%3A18075438011"
  
  const response = await fetch(URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    }
  })

  const html2 = await response.text();

  results = htmlParser.parseHtmlForTagsThatContainSubString(html2,"s-result-item s-asin")
  optionQuantities = []
  for(i = 0; i<Math.min(results.length,3); i++)
  {
    const tag = results[i]
    const start = results[i].indexOf("data-asin=")+"data-asin=".length
    const partial = tag.substring(start+1)
    const end = partial.indexOf('\"')
    const result = partial.substring(0,end)
    optionQuantities.push({asin:result,quantity:1}) //TODO in the future this should be a calculated value not just 1
  }
  return optionQuantities
        
}

async function addFirstListedItemToCart(element) {
  let offer = '';
  let token = '';
  for (const option of element) {
    try{
      const res = await fetchOffer(option);
    offer = res[0];
    token = res[1];
    console.log("here2",res);
    }
    catch(exception)
    {
      console.log("exception getting item " + exception)
analytics().logEvent('fail', {
  "error": exception,
  "detail" : "getting item failed",
  "asin": option.asin,
 })

    }
    if (offer === '' ||offer===null) {
      console.log("skipping");
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

analytics().logEvent('fail', {
  "error": exception,
  "detail" : "adding item failed",
  "asin": option.asin,
 })
      continue;
    }
    return;
  }
}
async function sendToCart(ingredient_set, onItemAdded) {
  console.log("here1")
  let count = 0;
  for (const element of ingredient_set) {
    count+=1;
    onItemAdded(count)
    if(element.named)
    {
      const optionQuantities = await findItem(element.name)
      await addFirstListedItemToCart(optionQuantities);
    }
    else
    {
      await addFirstListedItemToCart(element.optionQuantities);
    }
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

function cleanIngredientText(ingredientName)
{
  const nlpName = nlp(ingredientName)
  try{
    const cleaned = nlpName.sentences().json()[0]["sentence"]["subject"]??ingredientName
    return cleaned
  }catch
  {
    return ingredientName
  }
}

function getIngredientsForPurchase(cartMeals,oneTimes)
{
    const neededTotalIngredientsMap = getSelectedItems(cartMeals,oneTimes)
    let ingredientPurchaseMap = new Map()
    
  for (const ingredient of neededTotalIngredientsMap.keys()) 
        {
            if(getIngredient(ingredient.ingredient))
            {
              const neededAmount = neededTotalIngredientsMap.get(ingredient)
              const isOneTime = ingredient["isOneTime"]
              const optionQuantities =  getOptionQuantities(neededAmount,getIngredient(ingredient.ingredient).Options,isOneTime)
              ingredientPurchaseMap.set(ingredient,{optionQuantities,named:false})
            }
            else
            {
              const neededAmount = neededTotalIngredientsMap.get(ingredient)
              ingredientPurchaseMap.set(ingredient,{neededAmount,named:true,name:cleanIngredientText(ingredient.ingredient)})
            }
        }

    return ingredientPurchaseMap
}


function getSelectedItems(cartMeals,oneTimes) {
  let ingredients = new Map();
  for (const [meal, quantity] of cartMeals.entries()) { //ingredients
    for (const [ingredient, amount] of [...meal.Ingredients,...(meal.NamedIngredients??[])]) {
      if (ingredients.has(ingredient)) {
        ingredients.set(
          {ingredient,isOneTime:false},
          ingredients.get({ingredient,isOneTime:false}) + amount * quantity,
        );
      } else {
        ingredients.set({ingredient,isOneTime:false}, amount * quantity)
      }
    }
  }
  for(const oneTime of oneTimes)
  {
    ingredients.set({ingredient:oneTime,isOneTime:true},1)
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
  }
  return false;
}


const amazonUtils = {
  getIngredientsForPurchase,
  sendToCart,
  checkLoggedIn,
};
export default amazonUtils;