import React, { useEffect, useState } from 'react'
import { Box, Button, Typography, Grid } from '@mui/material'
import RecipeCard from '../Components/recipeCard'
import ingredientsCopy from '../ingredientsCopy.json'
import mealsCopy from '../mealsCopy.json'
import { useNavigate } from 'react-router-dom'
import AddToCartButton from '../Components/addToCartButton'
import SecondaryNav from '../Components/secondaryNav'

const RecipeLanding = (props) => {
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

  // const AddToCartButton = (meal) => {
  //   let inCart = false
  //   if (props.cartMeals.has(meal)) {
  //     inCart = true
  //   }

  //   return (
  //     <Box sx={{height: '70px', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
  //       {inCart ? (
  //         <>
  //           {' '}
  //           <Box sx={{display: 'flex', width: '100%'}}>
  //             <Button variant='contained' onClick={(event) => props.handleCartMeals(event, meal, 'decrement')}>
  //               -
  //             </Button>
  //             <Box sx={{flexGrow: 1, textAlign: 'center'}}>
  //               <Typography fontWeight='bold'>{props.cartMeals.get(meal)} in your cart</Typography>
  //               <Typography>{props.cartMeals.get(meal)*meal.IncrementAmount} servings</Typography>
  //             </Box>
  //             <Button variant='contained' onClick={(event) => props.handleCartMeals(event, meal, 'increment')}>
  //               +
  //             </Button>
  //           </Box>
  //         </>
  //       ) : (
  //         <>
  //           <Button
  //             variant='contained'
  //             sx={{width: '100%', display: 'flex', flexDirection: 'column'}}
  //             onClick={(event) => props.handleCartMeals(event, meal, 'increment')}
  //           >
  //             <Typography fontWeight='bold'>Add to Cart</Typography>
  //             <Typography>{meal.IncrementAmount} servings</Typography>
  //           </Button>
  //         </>
  //       )}
  //     </Box>
  //   )
  // }

  let CATEGORIES = ['Quick and Easy', 'Sheet Pan', 'Cooking Mastery']

  const navigate = useNavigate()
  const navigateToRecipe = (recipeID) => {
    navigate({ pathname: 'recipe', search: `?recipeID=${recipeID}` })
  }
  return (
    <Box>
      <SecondaryNav containsProperChromeExtension={props.containsProperChromeExtension}>
        {/* <Box sx={{ borderBottom: '1px solid #fff', padding: '10px 10px', position: 'sticky', top: '65px', backgroundColor: '#1B2428', zIndex: 9 }}> */}
        {CATEGORIES.map((category) => {
          let buttonVariant = 'outlined'
          if (category == 'Breakfast') {
            buttonVariant = 'contained'
          }
          return (
            <>
              <Button
                variant={buttonVariant}
                key={category}
                sx={{ margin: 'auto 10px' }}
              >
                {category}
              </Button>
            </>
          )
        })}
      </SecondaryNav>
      {/* </Box> */}
      <Box sx={{ width: '90%', margin: 'auto auto' }}>
        {CATEGORIES.map((category, index) => {
          let categoryMeals = meals.filter((meal) => meal.category == category)
          return (
            <React.Fragment key={category}>
              <Typography variant='h2' sx={{ margin: '40px 0px 10px 0px' }}>
                {category}
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridGap: '20px',
                  gridTemplateColumns:
                  {xs:'repeat(2, minmax(0, 1fr))', md: 'repeat(3, minmax(0, 1fr))'}
                  // padding: '20px 20px'
                }}
              >
                {categoryMeals.map((recipe) => {
                  return (
                    <>
                      <RecipeCard
                        key={recipe.Id}
                        onClick={navigateToRecipe}
                        recipe={recipe}
                        handleCartMeals={props.handleCartMeals}
                        cartMeals={props.cartMeals}
                      />
                    </>
                  )
                })}
              </Box>
            </React.Fragment>
          )
        })}
      </Box>
    </Box>
  )
}

export default RecipeLanding
