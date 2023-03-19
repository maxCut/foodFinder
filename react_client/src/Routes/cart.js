import React, { useEffect } from 'react'
import { Box, Button, Card, CardContent, CardMedia, Typography } from '@mui/material'
import AddToCartButton from '../Components/addToCartButton'

const Cart = (props) => {
  let cartQuantity
  if (props.cartMeals.size > 0) {
    cartQuantity = [...props.cartMeals.values()].reduce((a, b) => a + b)
  } else {
    cartQuantity = 0
  }

  const cartCard = (recipe) => {
    console.log(recipe)
    return (
      <>
        <Card sx={{ backgroundColor: '#34383F', marginTop: '20px'  }}>
          <Box sx={{display: 'flex', borderBottom: '1px solid #fff'}}>
            <CardMedia
              component='img'
              sx={{ width: '200px', height: '200px', objectFit: 'cover' }}
              image={recipe.Image}
            />
            <Box sx={{width: '100%', padding: '10px 10px', display: 'flex', flexDirection: 'column'}}>
              <Box sx={{flexGrow: 1}}>
                <Typography variant='h5'>{recipe.Name}</Typography>
                <Typography>Description</Typography>
                <Typography>15 min</Typography>
              </Box>
              <AddToCartButton handleCartMeals={props.handleCartMeals} cartMeals={props.cartMeals} meal={recipe}/>
            </Box>
          </Box>
          <CardContent>
<ul>
  {recipe.Ingredients.map((ingredient) => {
    return (
      <>
      <li>{ingredient[0]}: {ingredient[1]}</li>
      </>
    )
  })}
</ul>
          </CardContent>
        </Card>
      </>
    )
  }

  return (
    <Box>
      <Box sx={{ borderBottom: '1px solid #fff' }}>
        <Typography variant='h2'>Cart</Typography>
        <Typography>{cartQuantity} recipes selected</Typography>
      </Box>
      <Box sx={{ width: '90%', margin: 'auto auto', display: 'grid', gridTemplateColumns: 'auto 30%', gridGap: 10 }}>
        <Box>
          {Array.from(props.cartMeals).map(([key, value]) => {
            return <>{cartCard(key)}</>
          })}
        </Box>

          <Card sx={{backgroundColor: '#34383F', height: '100px'}}>
            <Button variant='contained'>Proceed to Checkout</Button>
          </Card>
      </Box>
      {/* Cart content */}
    </Box>
  )
}

export default Cart
