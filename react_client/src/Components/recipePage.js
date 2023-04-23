import { Box, Typography, Link } from '@mui/material'
import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import mealsCopy from '../mealsCopy.json'
import ingredientsCopy from '../ingredientsCopy.json'
import SecondaryNav from './secondaryNav'
import timeHandler from '../utils/timeHandler'
import AddToCartButton from './addToCartButton'

const RecipePage = (props) => {
  let meals = props.meals
  let ingredients = props.ingredients
  const [searchParams] = useSearchParams()
  const recipeID = searchParams.get('recipeID')
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)

  let emptyIngredients = new Map()
  const [recipeIngredients, setRecipeIngredients] = useState(emptyIngredients)
  useEffect(() => {
    async function handleAsync() {
      //get recipe info
      let tmp = meals.filter((meal) => meal.Id == recipeID)[0]
      setRecipe(tmp)
      //get ingredient info
      let ingredientTmp = new Map()
      tmp.Ingredients.forEach(([key, quantity]) => {
        let ingredientDetails = ingredients.filter(
          (ingredient) => ingredient.Key == key
        )[0]
        ingredientTmp.set(ingredientDetails, quantity)
      })
      setRecipeIngredients(new Map(ingredientTmp))
      //get time info

      setLoading(false)
    }
    handleAsync()
  }, [])

  let timeDetails
  if (recipe) {
    let prepTime = timeHandler.formatTime(recipe.prepTime)
    let cookTime = timeHandler.formatTime(recipe.cookTime)
    let totalTime = timeHandler.getTotalTime(recipe.prepTime, recipe.cookTime)
    timeDetails = {
      'Prep Time': prepTime,
      'Cook Time': cookTime,
      'Total Time': totalTime
    }
  }

  const instructions = (instructions) => {
    if (typeof instructions[0] == 'object') {
      return (
        <>
          {recipe.instructions.map((step, index) => {
            return Object.keys(step).map((key) => {
              return (
                <>
                  <Typography variant='h5' sx={{marginTop: index == 0 ? '16px' : null}}>{key}</Typography>
                  <ol>
                    {step[key].map((subStep) => {
                      return (
                        <>
                          <li>{subStep}</li>
                        </>
                      )
                    })}
                  </ol>
                </>
              )
            })
          })}
        </>
      )
    } else {
      return (
        <ol>
          {instructions.map((step) => {
            return <li>{step}</li>
          })}
        </ol>
      )
    }
  }

  const getOneTime = (key) => {
    let oneTimeDetails = ingredientsCopy.filter(
      (ingredient) => ingredient.Key == key
    )[0]
    return oneTimeDetails
  }

  return (
    <>
      {loading ? (
        <>loading...</>
      ) : (
        <>
          {/* <SecondaryNav>Cookbook › Category › {recipe.Name}</SecondaryNav> */}
          <Box sx={{ width: {xs: '100%', md:'80%'}, margin: {xs: 'auto auto 20px auto', md: 'auto auto 80px auto'} }}>
            <Box sx={{ backgroundColor: 'secondary.main', minHeight: '100vh' }}>
              <Box id='recipe-header' sx={{ borderBottom: '1px solid #fff' }}>
                <Box
                  id='recipe-header-img'
                  sx={{ width: '100%', objectFit: 'cover', height: '300px' }}
                  component='img'
                  src={`${recipe.Image}`}
                />
                <Box
                  sx={{
                    padding: '30px 30px',
                    display: 'grid',
                    gridTemplateColumns: {xs: '100%', md: '60% auto'}
                  }}
                >
                  <Typography variant='h2' sx={{ gridColumn: '1/2' }}>
                    {recipe.Name}
                  </Typography>
                  <Typography sx={{ gridColumn: '1/2' }}>
                    {recipe.description}
                  </Typography>
                  <Link href={recipe.Recipe} color='inherit' target='_blank'>Source</Link>
                  <AddToCartButton
                    style={{ gridColumn: {md:'2/3'}, gridRow: {md: '1 /4'} }}
                    meal={recipe}
                    handleCartMeals={props.handleCartMeals}
                    cartMeals={props.cartMeals}
                  />
                </Box>
                {timeDetails ? (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-evenly',
                      paddingBottom: '20px'
                    }}
                  >
                    {Object.keys(timeDetails).map((key) => {
                      return (
                        <Box
                          key={key}
                          sx={{ textAlign: 'center', padding: '15px 15px' }}
                        >
                          <Typography fontWeight='bold'>{key}</Typography>
                          <Typography>{timeDetails[key]}</Typography>
                        </Box>
                      )
                    })}
                  </Box>
                ) : (
                  <></>
                )}
              </Box>
              <Box
                id='recipe-body'
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {xs: '100%', md: '30% auto'},
                  padding: '30px 30px',
                  gridGap: '40px'
                }}
              >
                <Box id='ingredients-list'>
                  <Typography variant='h4'>Ingredients</Typography>
                  <ul>
                    {Array.from(ingredients).map(([key, value]) => {
                      return (
                        <li>
                          <Box sx={{ display: 'flex' }}>
                            <Typography sx={{ flexGrow: 1 }}>
                              {key.Name}
                            </Typography>
                            <Typography>
                              {value} {key.Options[0].Unit}
                            </Typography>
                          </Box>
                        </li>
                      )
                    })}
                  </ul>
                  <Typography variant='h4'>Pantry Ingredients</Typography>
                  <Typography variant='body2'>
              Ingredients you might already have
            </Typography>
            <ul style={{ /*listStyle: 'none'*/ width: '95%' }}>
              {recipe.OneTimes.map((key) => {
                let oneTimeDetails = getOneTime(key)
                return (
                  <li>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography sx={{ flexGrow: 1 }}>
                        {oneTimeDetails.Name}
                      </Typography>
                      {/* <Typography>
                        {addOneTime(key, value)}
                      </Typography> */}
                    </Box>
                  </li>
                )
              })}
            </ul>
                </Box>
                {/* <Box id='nutrition-facts'>
                  <Typography variant='h4'>Nutrition Facts</Typography>
                </Box> */}
                <Box id='instructions'>
                  <Typography variant='h4'>Instructions</Typography>
                  {instructions(recipe.instructions)}
                </Box>
              </Box>
            </Box>
          </Box>
        </>
      )}
    </>
  )
}

export default RecipePage
