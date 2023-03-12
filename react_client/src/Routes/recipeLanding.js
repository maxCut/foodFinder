import React, { useEffect } from 'react'
import { Box, Button, Typography } from '@mui/material'
import RecipeCard from '../Components/recipeCard'

const RecipeLanding = () => {
  // useEffect(() => {
  //   async function handleAsync() {
  //     fetch('.../shared/meals.json')
  //     .then((response) => {
  //       return response.json()
  //     })
  //     .then((jsondata) => {
  //       console.log(jsondata)
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

  const TEMP_RECIPES = [
    {
      Id: 'm2',
      Name: 'Baked Eggs over Sweet Potato',
      Recipe: 'https://naturallyella.com/sweet-potatoes-baked-eggs/',
      Image:'http://t2.gstatic.com/licensed-image?q=tbn:ANd9GcQQufw1pZI2sGqRfdnWLyw9RT2HhpwTqvsBlEv0UA3HFwTS8GNde_cIqbs1hEFtFSmLa9HFiPve4cm2Sxk',
      Ingredients: [
        ['f4', 1.0],
        ['f5', 0.25],
        ['f6', 2.0],
        ['f16', 2.0]
      ],
      OneTimes: ['p2', 'p3', 'p6', 'p7', 'p8'],
      IncrementAmount: 2
    },
    {
      Id: 'm4',
      Name: 'Yogurt Parfait',
      Recipe: 'https://www.simplysissom.com/simpleyogurtparfaits/',
      Image:
        'https://i0.wp.com/www.simplysissom.com/wp-content/uploads/2017/01/parfaityogurt-copy.jpg?w=680&ssl=1',
      Ingredients: [
        ['f14', 2.5],
        ['f10', 1.0],
        ['f11', 1.0],
        ['f12', 1.0],
        ['f15', 8.0]
      ],
      OneTimes: ['p9'],
      IncrementAmount: 4
    }
  ]
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
      <Typography variant='h2'>Category Name</Typography>
      <Box sx={{display: 'flex', padding: '20px 20px'}}>
        {TEMP_RECIPES.map((recipe) => {
          console.log(recipe)
          return <RecipeCard recipe={recipe} />
        })}
      </Box>
    </Box>
  )
}

export default RecipeLanding
