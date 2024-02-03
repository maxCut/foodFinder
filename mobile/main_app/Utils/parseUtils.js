import htmlParser from './htmlParser'
import moment from 'moment';
import { parse, combine } from 'recipe-ingredient-parser-v3';
import Qty from 'js-quantities';
import nlp from "compromise";

async function parseURLForRecipe(url)
{
    const inner = await htmlParser.parseURLForTagsThatContainSubstringAndReturnInnerHTML(url, `script type="application/ld`)
    
    if(inner == "")
    {
        throw new Error("This URL is not a Recipe")
    }
    let Recipe = {}
    for(i = 0; i<inner.length;i++)
    {
        let innerJsonString = inner[i].substring(inner[i].indexOf("{"),inner[i].lastIndexOf("}")+1)
        const innerJson = JSON.parse(innerJsonString)
        Recipe = {...Recipe,...innerJson}
        if(innerJsonString.includes(`"@graph"`))
        {
            innerJson["@graph"].forEach(element => {
                if(element["@type"]??"".toLowerCase()==="recipe")
                {
                    Recipe = {...Recipe,...element}
                }
            });
            Recipe = {...Recipe,}
        }
    }
    if(Recipe.innerJson)
    {
        Recipe = {...Recipe, ...Recipe.innerJson}
    }
    const ret =  {
    prepTime :parsePeriodOfTimeStringToMinutes(Recipe.prepTime),
    cookTime :parsePeriodOfTimeStringToMinutes(Recipe.cookTime), 
    Image: (Recipe.image??[null])[0],
    Icon: "local-dining",
    IconFamily: "MaterialIcons",
    Name: Recipe.name,
    description: parseRecipeDescription(Recipe.description),
    IncrementAmount: parseServings(Recipe.recipeYield),
    instructions:[...((Recipe.recipeInstructions??[]).map((partInstructions)=>{{
        return partInstructions.itemListElement? partInstructions.itemListElement.map(((step)=>{
            return step.text})) : partInstructions.text ?? partInstructions.name
    }}))].flat(1),
    Ingredients:[],
    NamedIngredients:[...parseNamedIngredients(Recipe.recipeIngredient)],
    NamedPantryIngredients:[...parsePantryIngredients(Recipe.recipeIngredient)],
    OneTimes: [],
    customizable: true,
    uid: Date.now()}
    return ret;
}

function parsePeriodOfTimeStringToMinutes(str) {
    let duration = moment.duration(str)
    return Math.round(Number(duration.asMinutes()));
  }

const MAXDESCLENGTH = 60
function  parseRecipeDescription(str)
{
    if(str?.length??0<MAXDESCLENGTH)
    {
        return str
    }
    return str.substring(0,MAXDESCLENGTH)
}
function  parseServings(input)
{
    if(Array.isArray(input))
    {
        if(input.length>0)
        {
            return input[0]
        }
    }
    return input??1
}

const KNOWNPANTRYINGREDIENTS = [ "oil", "optional"]
const KNOWNPANTRYINGREDIENTSEXACT = ["salt", "pepper"]

function isPantryIngredient(ingredientObj)
{
    for(let i = 0; i<KNOWNPANTRYINGREDIENTS.length; i++)
    {
        const knownIngredient = KNOWNPANTRYINGREDIENTS[i]
        if(ingredientObj.ingredient.toLowerCase().includes(knownIngredient))
        {
            return true
        }
    }
    for(let i = 0; i<KNOWNPANTRYINGREDIENTSEXACT.length; i++)
    {
        const knownIngredient = KNOWNPANTRYINGREDIENTS[i]
        if(ingredientObj.ingredient.toLowerCase()===(knownIngredient))
        {
            return true
        }
    }
    if(ingredientObj.quantity<=0)
    {
        return true
    }
    return false
}

function parsePantryIngredients(ingredient_set)
{
    let ingredienstNamedPantry = dedupIngredients(ingredient_set.map((ingredient)=>{
        return parseIngredient(ingredient)})
        .filter((ingredientObj)=>{return isPantryIngredient(ingredientObj)}))
        .map((ingredientObj)=>{return ingredientObj.ingredient})
    return ingredienstNamedPantry
}

function parseNamedIngredients(ingredient_set)
{
    let ingredienstNamed = dedupIngredients(ingredient_set.map((ingredient)=>{
        return parseIngredient(ingredient)})
        .filter((ingredientObj)=>{return !isPantryIngredient(ingredientObj)}))
        .map((ingredientObj)=>{return [ingredientObj.ingredient,ingredientObj.quantity,ingredientObj.unit]})
    return ingredienstNamed
}

function combineIngredientAmounts(amount1,unit1,amount2,unit2)
{
    qty1 = new Qty(amount1+unit1)
    qty2 = new Qty(amount2+unit2)
    if(!qty1.isCompatible(qty2))
    {
        return {amount:amount1, unit:unit1}
    }
    if(qty1.gte(qty2))
    {
        const ret = qty1.add(qty1).toString().split(" ")
        return {amount:ret[0], unit:ret[1]}
    }
    else
    {
        const ret = qty2.add(qty1).toString().split(" ")
        return {amount:ret[0], unit:ret[1]}
    }

}

function dedupIngredients(ingredientObjs)
{
    return combine(ingredientObjs).map((obj)=>{return obj}).reduce((ingredients,newIngredient)=>
    {
        for(let i = 0; i<ingredients.length;i++)
        {
            if(ingredients[i].ingredient.toLowerCase()===(newIngredient.ingredient.toLowerCase()))
            {
                const mergedUnits = combineIngredientAmounts(ingredients[i].quantity, ingredients[i].unit,newIngredient.quantity,newIngredient.unit)
                ingredients[i].quantity = Number(mergedUnits.amount).toPrecision(3)
                ingredients[i].unit = mergedUnits.unit
                if(newIngredient.ingredient.toLowerCase().includes(ingredients[i].ingredient.toLowerCase()))
                {
                    ingredients[i].ingredient = newIngredient.ingredient
                }
                return ingredients
            }
        }
        ingredients.push(newIngredient)
        return ingredients
    },initialValue=[])
}

function cleanIngredientName(name)
{
    return name
}

function parseIngredient(ingredient)
{
    let ingredientObj =  parse(ingredient, 'eng')
    ingredientObj.ingredient = cleanIngredientName(ingredientObj.ingredient)

    return ingredientObj
}

const checkURLIsValid = urlString=> {
    var urlPattern = new RegExp('^(https?:\\/\\/)?'+ // validate protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // validate domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // validate OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // validate port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // validate query string
  '(\\#[-a-z\\d_]*)?$','i'); // validate fragment locator
return !!urlPattern.test(urlString);
}

export default {checkURLIsValid,parseURLForRecipe}