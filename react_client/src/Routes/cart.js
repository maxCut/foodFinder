import React, { useEffect, useState, useRef } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Checkbox,
  useMediaQuery,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material'
import AddToCartButton from '../Components/addToCartButton'
import ingredientsCopy from '../ingredientsCopy.json'
import timeHandler from '../utils/timeHandler'

const Cart = (props) => {
  let allIngredients = props.ingredients
  let cartQuantity
  if (props.cartMeals.size > 0) {
    cartQuantity = [...props.cartMeals.values()].reduce((a, b) => a + b)
  } else {
    cartQuantity = 0
  }
  // const [ingredients, setIngredients] = useState(emptyIngredients)

  let mobile = useMediaQuery((theme) => theme.breakpoints.down('md'))

  const getIngredients = (recipe) => {
    let ingredientsTmp = new Map()
    recipe.Ingredients.forEach(([key, quantity]) => {
      let ingredientDetails = allIngredients.filter(
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
    let oneTimeDetails = allIngredients.filter(
      (ingredient) => ingredient.Key == key
    )[0]
    return oneTimeDetails
  }

  const [hover, setHover] = useState(false)
  const oneTimeButton = (key) => {
    let value = props.oneTimes.includes(key)
    return (
      <>
        {value ? (
          <>
            {/* <Box sx={{ display: 'flex', width: '100%' }}> */}
            <Button
              variant='outlined'
              sx={{ minWidth: '150px' }}
              onClick={(event) => props.handleOneTimes(key)}
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
            >
              {hover ? 'Remove?' : '1 in your cart'}
            </Button>
            {/* <Button
                variant='contained'
                onClick={(event) => props.handleOneTimes(key)}
              >
                -
              </Button>
              <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Typography fontWeight='bold'>
                   in your cart
                </Typography>
                <Typography>
                   servings
                </Typography>
              </Box>
              <Button
                variant='contained'
                onClick={(event) => props.handleOneTimes(key)}
              >
                +
              </Button> */}
            {/* </Box> */}
          </>
        ) : (
          <>
            <Button
              variant='outlined'
              onClick={() => props.handleOneTimes(key)}
            >
              {value ? '-' : '+'}
            </Button>
          </>
        )}
      </>
    )
  }
  document.addEventListener('purchaseRequestSuccess', function (event) {
    console.log('success')
    onCheckoutAmazonSuccess()
  })
  document.addEventListener('purchaseRequestFailed', function (event) {
    console.log('failed')
    onNeedToLogInToAmazon()
  })

  // const [addingToCart, setAddingToCart] = useState(false)
  const addingToCart = useRef(false)
  const [loadPercent, setLoadPercent] = useState('0%')
  const [isLoading, setIsLoading] = useState(false);

  const getCart = () => {
    let tmpCart = []
    props.cartMeals.forEach((value, key) => {
      key.Ingredients.forEach((ingredient) => {
        let tmpOptions = []
        let details = allIngredients.filter(
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
      let details = allIngredients.filter((obj) => obj.Key == key)[0]
      details.Options.forEach((item) => {
        tmpOptions.push({ asin: item.ASIN, quantity: 1 })
      })
      tmpCart.push(tmpOptions)
    })
    return tmpCart
  }

  const chunkSize = 1
  const requestDelayInMilliseconds = 600
  const chunkProgress = useRef()
  const numActiveChunks = useRef()
  function checkoutAmazon() {
    //fires on button click
    // if (!containsProperChromeExtension) {
    //   //check for chrome extension
    //   return
    // }
    console.log('checkout')
    if (addingToCart.current) {
      return
    }
    var cart = getCart() //returns array of arrays of object options [[{asin, quantity}]]
    var numChunks = Math.ceil(cart.length / chunkSize)
    chunkProgress.current = numChunks
    numActiveChunks.current = numChunks
    updateLoadPercent()
    setIsLoading(true)
    for (let i = 0; i < numChunks; i++) {
      setTimeout(function () {
        console.log('start chunk slice')
        sendCartChunkToAmazon(
          cart.slice(i * chunkSize, Math.min(cart.length, (i + 1) * chunkSize))
        )
      }, requestDelayInMilliseconds * i)
    }
    setTimeout(
      onAmazonRequestTimeout(),
      numChunks * requestDelayInMilliseconds + 10000
    ) //TO DO: change to random number so amazon likes it better
    addingToCart.current = true
  }
  function sendCartChunkToAmazon(chunk) {
    console.log('sending:', chunk)
    var event = new CustomEvent('purchaseRequest', { detail: chunk })
    document.dispatchEvent(event)
  }
  function updateLoadPercent() {
    setLoadPercent(
      Math.floor(
        ((chunkProgress.current - numActiveChunks.current) /
          chunkProgress.current) *
          100
      ) + '%'
    )
    console.log(loadPercent)
  }
  function onCheckoutAmazonSuccess() {
    if (addingToCart.current) {
      numActiveChunks.current = numActiveChunks.current - 1
      updateLoadPercent()
      if (numActiveChunks.current <= 0) {
        //once the chunks are all sent, open the amazon cart window
        addingToCart.current = false
        setTimeout(function () {
          setIsLoading(false)
          window.open(
            'https://www.amazon.com/cart/localmarket?ref_=cart_go_cart_btn_fresh&almBrandId=QW1hem9uIEZyZXNo&tag=foodfinder00-20',
            '_blank'
          )
        }, 3500)
      }
    }
  }

  function onAmazonRequestTimeout() {
    addingToCart.current = false
  }
  const [openLoginRequired, setOpenLoginRequired] = useState(false)
  function onNeedToLogInToAmazon() {
    //show warning if you are not logged into amazon
    addingToCart.current = false
    setOpenLoginRequired(true)
    // document.getElementById('checkout-login-required').style.display = 'block'
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
          <Box
            sx={{
              display: 'flex',
              maxHeight: { xs: '150px', md: '200px' },
              borderBottom: '1px solid #fff'
            }}
          >
            <Box
              component='img'
              sx={{
                maxWidth: { xs: '100px', md: '200px' },
                maxHeight: '100%',
                objectFit: 'cover'
              }}
              src={recipe.Image}
            />
            <Box
              sx={{
                width: '100%',
                padding: '15px 15px',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant='h3'>{recipe.Name}</Typography>
                {mobile ? null : (
                  <Typography>{recipe.description}</Typography>
                )}{' '}
                <Typography>
                  {timeHandler.getTotalTime(recipe.prepTime, recipe.cookTime)}
                </Typography>
              </Box>
              <AddToCartButton
                handleCartMeals={props.handleCartMeals}
                cartMeals={props.cartMeals}
                meal={recipe}
              />
            </Box>
          </Box>
          <CardContent sx={{ padding: '30px 30px' }}>
            <Typography variant='h4'>Ingredients</Typography>
            <ul style={{ /*listStyle: 'none'*/ width: '90%' }}>
              {Array.from(getIngredients(recipe)).map(([key, value]) => {
                return (
                  <li style={{ padding: '5px 0px' }}>
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
            <Typography variant='body2'>
              Ingredients you might already have
            </Typography>
            <ul style={{ /*listStyle: 'none'*/ width: '95%' }}>
              {recipe.OneTimes.map((key) => {
                let oneTimeDetails = getOneTime(key)
                return (
                  <li>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
          <Box sx={{ borderBottom: '1px solid #fff', padding: '20px 20px' }}>
            <Typography variant='h2'>Cart</Typography>
            <Typography>{cartQuantity} recipes selected</Typography>
          </Box>
          <Box
            sx={{
              width: { xs: '100%', md: '80%' },
              margin: 'auto auto',
              display: 'grid',
              gridTemplateColumns: { xs: '100%', md: 'auto 40%' },
              gridGap: 10
            }}
          >
            <Box>
              {Array.from(props.cartMeals).map(([key, value]) => {
                return <>{cartCard(key)}</>
              })}
            </Box>

            <Card
              sx={{
                backgroundColor: '#34383F',
                height: '100px',
                marginTop: '20px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Button
                size='large'
                variant='contained'
                onClick={() => checkoutAmazon()}
                disabled={isLoading}
              >
                Proceed to Checkout
                {isLoading && (
                  <CircularProgress
                    size={24}
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      marginTop: '-12px',
                      marginLeft: '-12px'
                    }}
                  />
                )}
              </Button>
            </Card>
          </Box>
          {/* Cart content */}
        </Box>
      ) : (
        <Card
          sx={{
            width: '50%',
            margin: '10px auto auto auto',
            backgroundColor: '#34383F',
            textAlign: 'center',
            padding: '20px 20px'
          }}
        >
          Your cart is empty!
        </Card>
      )}
      <Snackbar
        open={openLoginRequired}
        onClose={() => setOpenLoginRequired(false)}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity='error'>
          Oops! We're having trouble loading items into your amazon cart.{' '}
          <a
            href='https://www.amazon.com/cart/localmarket?ref_=cart_go_cart_btn_fresh&almBrandId=QW1hem9uIEZyZXNo&tag=foodfinder00-20'
            target='_blank'
          >
            Log into Amazon Fresh{' '}
          </a>
          on another page then try again.
        </Alert>
      </Snackbar>
    </>
  )
}

export default Cart
