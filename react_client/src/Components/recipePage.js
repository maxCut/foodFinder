import { Box, Typography } from '@mui/material'
import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import mealsCopy from '../mealsCopy.json'
import ingredientsCopy from '../ingredientsCopy.json'
import SecondaryNav from './secondaryNav'
import timeHandler from '../utils/timeHandler'

const RecipePage = () => {
  const [searchParams] = useSearchParams()
  const recipeID = searchParams.get('recipeID')
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)

  let emptyIngredients = new Map()
  const [ingredients, setIngredients] = useState(emptyIngredients)

  useEffect(() => {
    async function handleAsync() {
      //get recipe info
      let tmp = mealsCopy.filter((meal) => meal.Id == recipeID)[0]
      setRecipe(tmp)
      //get ingredient info
      let ingredientTmp = new Map()
      tmp.Ingredients.forEach(([key, quantity]) => {
        let ingredientDetails = ingredientsCopy.filter(
          (ingredient) => ingredient.Key == key
        )[0]
        ingredientTmp.set(ingredientDetails, quantity)
      })
      setIngredients(new Map(ingredientTmp))
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

  return (
    <>
      {loading ? (
        <>loading...</>
      ) : (
        <>
          <SecondaryNav>Cookbook > Category > {recipe.Name}</SecondaryNav>
          <Box sx={{ width: '80%', margin: 'auto auto' }}>
            <Box sx={{ backgroundColor: 'secondary.main', minHeight: '100vh' }}>
              <Box id='recipe-header' sx={{ borderBottom: '1px solid #fff' }}>
                <Box
                  sx={{ width: '100%', objectFit: 'cover', height: '300px' }}
                  component='img'
                  src={`${recipe.Image}`}
                />
                <Box sx={{ padding: '15px 15px' }}>
                  <Typography variant='h2'> {recipe.Name}</Typography>
                  <Typography>{recipe.description}</Typography>
                </Box>
                {timeDetails ? (
                  <Box sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
                    {Object.keys(timeDetails).map((key) => {
                      return (
                        <Box sx={{ textAlign: 'center', padding: '15px 15px' }}>
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
                  gridTemplateColumns: '30% auto',
                  padding: '15px 15px',
                  gridGap: '10px'
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
                            <Typography>{value}</Typography>
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
                  {recipe.instructions.map((step) => {
                    if (typeof step == 'object') {
                      return (
                        Object.keys(step).map((key) =>  {
                          return (
                            <>
                            <Typography>{key}</Typography>
                            {step[key].map((subStep) => {
                              return (
                                <>
                                <li>{subStep}</li>
                                </>
                              )
                            })}
                            </>
                          )
                        })
                      )

                      console.log(step)
                    } else {
                      return (
                        <>
                          <li>{step}</li>
                        </>
                      )
                    }
                  })}
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
