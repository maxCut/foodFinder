import React from 'react'
import { Button, Box, Typography } from '@mui/material'

const AddToCartButton = (props) => {
  let meal = props.meal

  let inCart = false
  if (props.cartMeals.has(meal)) {
    inCart = true
  }

  return (
    <Box
      sx={{
        height: '70px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}
    >
      {inCart ? (
        <>
          {' '}
          <Box sx={{ display: 'flex', width: '100%' }}>
            <Button
              variant='contained'
              onClick={(event) =>
                props.handleCartMeals(event, meal, 'decrement')
              }
            >
              -
            </Button>
            <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
              <Typography fontWeight='bold'>
                {props.cartMeals.get(meal)} in your cart
              </Typography>
              <Typography>
                {props.cartMeals.get(meal) * meal.IncrementAmount} servings
              </Typography>
            </Box>
            <Button
              variant='contained'
              onClick={(event) =>
                props.handleCartMeals(event, meal, 'increment')
              }
            >
              +
            </Button>
          </Box>
        </>
      ) : (
        <>
          <Button
            variant='contained'
            sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}
            onClick={(event) => props.handleCartMeals(event, meal, 'increment')}
          >
            <Typography fontWeight='bold'>Add to Cart</Typography>
            <Typography>{meal.IncrementAmount} servings</Typography>
          </Button>
        </>
      )}
    </Box>
  )
}

export default AddToCartButton
