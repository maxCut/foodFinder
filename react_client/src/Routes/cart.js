import React, { useEffect } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography
} from '@mui/material'
import AddToCartButton from '../Components/addToCartButton'
import ingredientsCopy from '../ingredientsCopy.json'

const Cart = (props) => {
  let cartQuantity
  if (props.cartMeals.size > 0) {
    cartQuantity = [...props.cartMeals.values()].reduce((a, b) => a + b)
  } else {
    cartQuantity = 0
  }
  // const [ingredients, setIngredients] = useState(emptyIngredients)
  console.log(props.oneTimes)

  const getIngredients = (recipe) => {
    let ingredientsTmp = new Map()
    recipe.Ingredients.forEach(([key, quantity]) => {
      let ingredientDetails = ingredientsCopy.filter(
        (ingredient) => ingredient.Key == key
      )[0]
      ingredientsTmp.set(ingredientDetails, quantity)
    })
    return ingredientsTmp
  }

  const getOneTimes = (recipe) => {
    let oneTimesTmp = new Map()
    recipe.OneTimes.forEach((key) => {
      let oneTimeDetails = ingredientsCopy.filter(ingredient => ingredient.Key == key)[0]
      oneTimesTmp.set(oneTimeDetails, false)
    })
    return oneTimesTmp
  }

  const addOneTime = (key, value) => {
    
    return (
      <>
      <Button variant='outlined'>
        {value ? '-' : '+'}
      </Button>
      </>
    )
  }

  const getOneTime = (key) => {
    let oneTimeDetails = ingredientsCopy.filter(ingredient => ingredient.Key == key)[0]
    return oneTimeDetails
  }

  const oneTimeButton = (key) => {
    let value = props.oneTimes.includes(key)
    return (
      <>
      <Button variant='outlined' onClick={() => props.handleOneTimes(key)}>
        {value ? '-' : '+'}
      </Button>
      </>
    )
  }

  
  const cartCard = (recipe) => {
    return (
      <>
        <Card sx={{ backgroundColor: '#34383F', marginTop: '20px' }}>
          <Box sx={{ display: 'flex', borderBottom: '1px solid #fff' }}>
            <CardMedia
              component='img'
              sx={{ width: '200px', height: '200px', objectFit: 'cover' }}
              image={recipe.Image}
            />
            <Box
              sx={{
                width: '100%',
                padding: '10px 10px',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant='h5'>{recipe.Name}</Typography>
                <Typography>Description</Typography>
                <Typography>15 min</Typography>
              </Box>
              <AddToCartButton
                handleCartMeals={props.handleCartMeals}
                cartMeals={props.cartMeals}
                meal={recipe}
              />
            </Box>
          </Box>
          <CardContent>
            <Typography variant='h4'>Ingredients</Typography>
            <ul>
              {Array.from(getIngredients(recipe)).map(([key, value]) => {
                return (
                  <li>
                    <Box sx={{ display: 'flex' }}>
                      <Typography sx={{ flexGrow: 1 }}>{key.Name}</Typography>
                      <Typography>
                        {value} {key.Options[0].Unit}
                      </Typography>
                    </Box>
                  </li>
                )
              })}
            </ul>
            <Typography variant='h4'>Pantry Ingredients</Typography>
            <ul>
              {recipe.OneTimes.map((key) => {
                let oneTimeDetails = getOneTime(key)
                return (
                  <li>
                    <Box sx={{ display: 'flex' }}>
                                        <Typography sx={{ flexGrow: 1 }}>{oneTimeDetails.Name}</Typography>
                                        {oneTimeButton(key)}
                      {/* <Typography>
                        {addOneTime(key, value)}
                      </Typography> */}
                      </Box>
                  </li>
                )
              })}
            </ul>
            {/* <ul>
              {Array.from(getOneTimes(recipe)).map(([key, value]) => {
                return (
                  <li>
                    <Box sx={{ display: 'flex' }}>
                      <Typography sx={{ flexGrow: 1 }}>{key.Name}</Typography>
                      <Typography>
                        {addOneTime(key, value)}
                      </Typography>
                    </Box>
                  </li>
                )
              })}
            </ul> */}
          </CardContent>
        </Card>
      </>
    )
  }

  return (
    <>
      {props.cartMeals.size > 0 ? (
        <Box>
          <Box sx={{ borderBottom: '1px solid #fff' }}>
            <Typography variant='h2'>Cart</Typography>
            <Typography>{cartQuantity} recipes selected</Typography>
          </Box>
          <Box
            sx={{
              width: '90%',
              margin: 'auto auto',
              display: 'grid',
              gridTemplateColumns: 'auto 30%',
              gridGap: 10
            }}
          >
            <Box>
              {Array.from(props.cartMeals).map(([key, value]) => {
                return <>{cartCard(key)}</>
              })}
            </Box>

            <Card sx={{ backgroundColor: '#34383F', height: '100px' }}>
              <Button variant='contained'>Proceed to Checkout</Button>
            </Card>
          </Box>
          {/* Cart content */}
        </Box>
      ) : (
        <Box
          sx={{
            width: '50%',
            margin: 'auto auto',
            backgroundColor: '#34383F',
            textAlign: 'center',
            padding: '20px 20px'
          }}
        >
          Your cart is empty!
        </Box>
      )}
    </>
  )
}

export default Cart
