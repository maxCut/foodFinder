import { Box, Typography } from '@mui/material'
import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import mealsCopy from '../mealsCopy.json'
import ingredientsCopy from '../ingredientsCopy.json'
import SecondaryNav from './secondaryNav'

const RecipePage = () => {
  const [searchParams] = useSearchParams()
  const recipeID = searchParams.get('recipeID')
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)

  let emptyIngredients = new Map()
  const [ingredients, setIngredients] = useState(emptyIngredients)

  useEffect(() => {
    async function handleAsync() {
      let tmp = mealsCopy.filter((meal) => meal.Id == recipeID)[0]
      setRecipe(tmp)
      let ingredientTmp = new Map()
      tmp.Ingredients.forEach(([key, quantity]) => {
        let ingredientDetails = ingredientsCopy.filter(
          (ingredient) => ingredient.Key == key
        )[0]
        ingredientTmp.set(ingredientDetails, quantity)
      })
      setIngredients(new Map(ingredientTmp))
      setLoading(false)
    }
    handleAsync()
  }, [])

  let TIME_DETAILS = [
    { type: 'Prep Time', time: '10min' },
    { type: 'Cook Time', time: '15min' },
    { type: 'Total Time', time: '25min' }
  ]

  return (
    <>
      {loading ? (
        <>loading...</>
      ) : (
        <>
        <SecondaryNav>
          Cookbook > Category > {recipe.Name}
        </SecondaryNav>
          <Box sx={{ width: '80%', margin: 'auto auto' }}>
            <Box sx={{ backgroundColor: 'secondary.main', height: '100vh' }}>
              <Box id='recipe-header' sx={{ borderBottom: '1px solid #fff' }}>
                <Box
                  sx={{ width: '100%', objectFit: 'cover', height: '300px' }}
                  component='img'
                  src={`${recipe.Image}`}
                />
                <Box sx={{padding: '15px 15px'}}>
                  <Typography variant='h2'> {recipe.Name}</Typography>
                  <Typography>Description description</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
                  {TIME_DETAILS.map((detail) => {
                    return (
                      <Box sx={{ textAlign: 'center', padding: '15px 15px' }}>
                        <Typography fontWeight='bold'>{detail.type}</Typography>
                        <Typography>{detail.time}</Typography>
                      </Box>
                    )
                  })}
                </Box>
              </Box>
              <Box
                id='recipe-body'
                sx={{ display: 'grid', gridTemplateColumns: '50% 50%', padding: '15px 15px', gridGap: '10px' }}
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
                <Box id='nutrition-facts'>
                  <Typography variant='h4'>Nutrition Facts</Typography>
                </Box>
                <Box>
                  <Typography variant='h4'>Instructions</Typography>
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
