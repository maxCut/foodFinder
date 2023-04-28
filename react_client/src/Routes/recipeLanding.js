import React, { useEffect, useState, useRef } from 'react'
import { Box, Button, Typography, Grid } from '@mui/material'
import RecipeCard from '../Components/recipeCard'
import ingredientsCopy from '../ingredientsCopy.json'
import mealsCopy from '../mealsCopy.json'
import { useNavigate } from 'react-router-dom'
import AddToCartButton from '../Components/addToCartButton'
import SecondaryNav from '../Components/secondaryNav'

const RecipeLanding = (props) => {
  let meals = props.meals
  let ingredients = props.ingredients
  // const [meals, setMeals] = useState([])
  // const [ingredients, setIngredients] = useState([])
  // useEffect(() => {
  //   async function handleAsync() {
  //     setMeals(mealsCopy)
  //     setIngredients(ingredientsCopy)
  //   }
  //   handleAsync()
  // }, [])
  // useEffect(() => {
  //   async function handleAsync() {
  //     fetch('../shared/mealsCopy.json')
  //     .then((response) => {
  //       return response.json()
  //     })
  //     .then((mealsData) => {
  //       setMeals(mealsData)
  //     })
  //     fetch('../shared/ingredientsCopy.json')
  //     .then((response) => {
  //       return response.json()
  //     })
  //     .then((ingredientsData) => {
  //       setIngredients(ingredientsData)
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
  const navigate = useNavigate()
  const navigateToRecipe = (recipeID) => {
    navigate({ pathname: 'recipe', search: `?recipeID=${recipeID}` })
  }

  const getDimensions = (ele) => {
    const { height } = ele.getBoundingClientRect()
    const offsetTop = ele.offsetTop
    const offsetBottom = offsetTop + height

    return {
      height,
      offsetTop,
      offsetBottom
    }
  }

  const scrollTo = (element) => {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const [visibleSection, setVisibleSection] = useState('Quick and Easy')
  const headerRef = useRef(null)

  let quickAndEasyRef = useRef(null)
  let sheetPanRef = useRef(null)
  let cookingMasteryRef = useRef(null)

  let CATEGORIES = [
    { name: 'Quick and Easy', ref: quickAndEasyRef },
    { name: 'Sheet Pan', ref: sheetPanRef },
    { name: 'Cooking Mastery', ref: cookingMasteryRef }
  ]

  useEffect(() => {
    const handleScroll = () => {
      const { height: headerHeight } = getDimensions(headerRef.current)
      const scrollPosition = window.scrollY + headerHeight + 114

      const selected = CATEGORIES.find(({ name, ref }) => {
        const ele = ref.current
        if (ele) {
          const { offsetBottom, offsetTop } = getDimensions(ele)
          return scrollPosition > offsetTop && scrollPosition < offsetBottom
        }
      })
      if (selected && selected.name !== visibleSection) {
        setVisibleSection(selected.name)
      } else if (!selected && visibleSection) {
        setVisibleSection('Quick and Easy')
      }
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [visibleSection])
  return (
    <Box>
      <SecondaryNav
        containsProperChromeExtension={props.containsProperChromeExtension}
        ref={headerRef}
      >
        {/* <Box sx={{ borderBottom: '1px solid #fff', padding: '10px 10px', position: 'sticky', top: '65px', backgroundColor: '#1B2428', zIndex: 9 }}> */}
        {CATEGORIES.map((category) => {
          let buttonVariant = 'outlined'
          if (visibleSection == category.name) {
            buttonVariant = 'contained'
          }
          return (
              <Button
                variant={buttonVariant}
                key={`${category.name} button`}
                sx={{ margin: {xs: '10px 10px', md: 'auto 10px'} }}
                onClick={() => {
                  scrollTo(category.ref.current)
                }}
              >
                {category.name}
              </Button>
          )
        })}
      </SecondaryNav>
      {/* </Box> */}
      <Box sx={{ width: '90%', maxWidth: '1000px', margin: 'auto auto 100px auto' }}>
        {CATEGORIES.map((category, index) => {
          let categoryMeals = meals.filter(
            (meal) => meal.category == category.name
          )
          return (
            <Box
            id={`${category.name} section`}
              ref={category.ref}
              sx={{ paddingTop: '40px' }}
              key={category.name}
            >
              <Typography variant='h2' sx={{ margin: '0px 0px 10px 0px' }}>
                {category.name}
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridGap: '20px',
                  gridTemplateColumns: {
                    xs: 'repeat(1, minmax(0, 1fr))',
                    sm: 'repeat(2, minmax(0, 1fr))',
                    md: 'repeat(3, minmax(0, 1fr))'
                  }
                  // padding: '20px 20px'
                }}
              >
                {categoryMeals.map((recipe) => {
                  return (
                      <RecipeCard
                        key={recipe.Id}
                        onClick={navigateToRecipe}
                        recipe={recipe}
                        handleCartMeals={props.handleCartMeals}
                        cartMeals={props.cartMeals}
                      />
                  )
                })}
              </Box>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}

export default RecipeLanding
