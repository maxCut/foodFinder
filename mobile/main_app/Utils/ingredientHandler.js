import allIngredients from '../ingredientsCopy.json';

const getIngredients = recipe => {
  let ingredientsTmp = new Map();
  recipe.Ingredients.forEach(([key, quantity]) => {
    let ingredientDetails = allIngredients.filter(
      ingredient => ingredient.Key == key,
    )[0];
    ingredientsTmp.set(ingredientDetails, quantity);
  });
  return ingredientsTmp;
};

const getOneTime = key => {
  let oneTimeDetails = allIngredients.filter(
    ingredient => ingredient.Key == key,
  )[0];
  return oneTimeDetails;
};

const ingredientHandler = {getIngredients, getOneTime};
export default ingredientHandler;
