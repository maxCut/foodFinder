import { Box, Typography } from '@mui/material'
import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import mealsCopy from '../mealsCopy.json'

const RecipePage = () => {
  const [searchParams] = useSearchParams()
  const recipeID = searchParams.get('recipeID')
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    async function handleAsync() {
      let tmp = mealsCopy.filter((meal) => meal.Id == recipeID)[0]
      setRecipe(tmp)
      setLoading(false)
    }
    handleAsync()
  }, [])

  return (
    <>
      {loading ? (
        <>loading...</>
      ) : (
        <>
          <Box sx={{ width: '80%', margin: 'auto auto' }}>
            <Box sx={{ backgroundColor: 'secondary.main', height: '100vh' }}>
              <Box sx={{borderBottom: '1px solid #fff'}}>
                  <Box
                  sx={{width: '100%', objectFit: 'cover', height: '300px'}}
                  component='img'
                  src={`${recipe.Image}`} />
                  <Typography variant='h2'> {recipe.Name}</Typography>
                  <Typography>Description description</Typography>
                  <Box sx={{display: 'flex', justifyContent: 'space-evenly'}}>
                          <Typography>Prep Time</Typography>
                          <Typography>Cook Time</Typography>
                          <Typography>Total Time</Typography>
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
