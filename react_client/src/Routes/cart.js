import React, { useEffect, useState } from 'react'
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

  // const getOneTimes = (recipe) => {
  //   let oneTimesTmp = new Map()
  //   recipe.OneTimes.forEach((key) => {
  //     let oneTimeDetails = ingredientsCopy.filter(ingredient => ingredient.Key == key)[0]
  //     oneTimesTmp.set(oneTimeDetails, false)
  //   })
  //   return oneTimesTmp
  // }

  // const addOneTime = (key, value) => {

  //   return (
  //     <>
  //     <Button variant='outlined'>
  //       {value ? '-' : '+'}
  //     </Button>
  //     </>
  //   )
  // }

  const getOneTime = (key) => {
    let oneTimeDetails = ingredientsCopy.filter(
      (ingredient) => ingredient.Key == key
    )[0]
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
  document.addEventListener('purchaseRequestSuccess', function (event) {
    onCheckoutAmazonSuccess()
  })
  document.addEventListener('purchaseRequestFailed', function (event) {
    onNeedToLogInToAmazon()
  })

  const [addingToCart, setAddingToCart] = useState(false)
  const [loadPercent, setLoadPercent] = useState('0%')
  

  const getCart = () => {
    let tmpCart = []
    props.cartMeals.forEach((value, key) => {
      key.Ingredients.forEach((ingredient) => {
        let tmpOptions = []
        let details = ingredientsCopy.filter(
          (obj) => obj.Key == ingredient[0]
        )[0]
        details.Options.forEach((item) => {
          tmpOptions.push({ asin: item.ASIN, quantity: value })
        })
        tmpCart.push(tmpOptions)
      })
    })
    props.oneTimes.forEach((key) => {
      let tmpOptions = []
      let details = ingredientsCopy.filter((obj) => obj.Key == key)[0]
      details.Options.forEach((item) => {
        tmpOptions.push({ asin: item.ASIN, quantity: 1 })
      })
      tmpCart.push(tmpOptions)
    })
    return tmpCart
  }

  const chunkSize = 1
  const requestDelayInMilliseconds = 600
  var numActiveChunks = 0
  var chunkProgress = 0
  function checkoutAmazon() {
    //fires on button click
    // if (!containsProperChromeExtension) {
    //   //check for chrome extension
    //   return
    // }
    console.log('checkout')
    if (addingToCart) {
      return
    }
    var cart = getCart() //returns array of arrays of object options [[{asin, quantity}]]
    console.log(cart)
    var numChunks = Math.ceil(cart.length / chunkSize)
    chunkProgress = numChunks
    numActiveChunks = numChunks
    updateLoadPercent()
    for (let i = 0; i < numChunks; i++) {
      setTimeout(function () {
        console.log('going')
        sendCartChunkToAmazon(
          cart.slice(i * chunkSize, Math.min(cart.length, (i + 1) * chunkSize))
        )
      }, requestDelayInMilliseconds * i)
    }
    setTimeout(
      onAmazonRequestTimeout(),
      numChunks * requestDelayInMilliseconds + 10000
    ) //change to random number so amazon likes it better
    setAddingToCart(true)
  }
  function sendCartChunkToAmazon(chunk) {
    console.log('yay')
    var event = new CustomEvent('purchaseRequest', { detail: chunk })
    document.dispatchEvent(event)
  }
  function updateLoadPercent() {
    setLoadPercent(
      Math.floor(((chunkProgress - numActiveChunks) / chunkProgress) * 100) +
        '%'
    )
    console.log(loadPercent)
  }
  function onCheckoutAmazonSuccess() {
    if (addingToCart) {
      numActiveChunks--
      updateLoadPercent()
      if (numActiveChunks <= 0) {
        //once the chunks are all sent, open the amazon cart window
        setTimeout(function () {
          setAddingToCart(false)
          window.open(
            'https://www.amazon.com/cart/localmarket?ref_=cart_go_cart_btn_fresh&almBrandId=QW1hem9uIEZyZXNo&tag=foodfinder00-20',
            '_blank'
          )
        }, 3500)
      }
    }
  }

  function onAmazonRequestTimeout() {
    setAddingToCart(false) //stop the spinner
  }

  function onNeedToLogInToAmazon() {
    //show warning if you are not logged into amazon
    setAddingToCart(false)
    document.getElementById('checkout-login-required').style.display = 'block'
  }

  // function getCart() {
  //   precart = Object.assign(
  //     {},
  //     getOneTimeForPurchase(),
  //     getIngredientsForPurchase()
  //   )
  //   cart = []
  //   Object.keys(precart).forEach((ingredientKey) => {
  //     //cart.push({asin:asinElement,quantity:precart[asinElement]})
  //     cart.push(precart[ingredientKey])
  //   })
  //   return cart
  // }

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
                      <Typography sx={{ flexGrow: 1 }}>
                        {oneTimeDetails.Name}
                      </Typography>
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
              {loadPercent}
              <Button variant='contained' onClick={() => checkoutAmazon()}>Proceed to Checkout</Button>
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
