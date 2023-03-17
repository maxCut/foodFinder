import React, { useEffect, useState } from 'react'
import { Box, Button, Typography, Grid } from '@mui/material'
import RecipeCard from '../Components/recipeCard'
import ingredientsCopy from '../ingredientsCopy.json'
import mealsCopy from '../mealsCopy.json'
import { useNavigate } from 'react-router-dom'

const RecipeLanding = () => {
  const [meals, setMeals] = useState([])
  const [ingredients, setIngredients] = useState([])
  useEffect(() => {
    async function handleAsync() {
      setMeals(mealsCopy)
      setIngredients(ingredientsCopy)
    }
    handleAsync()
  }, [])
  // useEffect(() => {
  //   async function handleAsync() {
  //     fetch('../shared/meals.json')
  //     .then((response) => {
  //       return response.json()
  //     })
  //     .then((jsondata) => {
  //       console.log(jsondata)
  //       setMeals(jsondata)
  //       // jsondata.forEach(element => {

  //       //     meals[element.Id] = element;
  //       //     addMeal(element.Name,element.Image,element.Id,element.Recipe)
  //       // });
  //     })
  //   }
  //   handleAsync()
  // }, [])

  const CATEGORIES = [
    { name: 'Protein' },
    { name: 'Veggie' },
    { name: 'Pasta' }
  ]

  let tmpMealsCopy = [...meals]

  const navigate = useNavigate()
  const navigateToRecipe = (recipeID) => {
    navigate({ pathname: 'recipe', search: `?recipeID=${recipeID}` })
  }
  return (
    <Box>
      <Box sx={{ borderBottom: '1px solid #fff', padding: '20px 10px' }}>
        {CATEGORIES.map((category) => {
          return (
            <>
              <Button
                variant='outlined'
                key={category.name}
                sx={{ margin: 'auto 10px' }}
              >
                {category.name}
              </Button>
            </>
          )
        })}
      </Box>
      {CATEGORIES.map((category, index) => {
        let categoryMeals = tmpMealsCopy.splice(0, 2)
        return (
          <>
            <Typography variant='h2'>{category.name}</Typography>
            <Box
              sx={{
                display: 'grid',
                gridGap: '10px',
                gridTemplateColumns:
                  categoryMeals.length > 2 ? '33% 33% 33%' : '50% 50%',
                padding: '20px 20px'
              }}
            >
              {categoryMeals.map((recipe) => {
                console.log(recipe)
                return (
                  <>
                    <RecipeCard onClick={navigateToRecipe} recipe={recipe} />
                  </>
                )
              })}
            </Box>
          </>
        )
      })}
    </Box>
  )
}

export default RecipeLanding
