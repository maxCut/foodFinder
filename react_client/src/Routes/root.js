import React, { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import {
  Button,
  Typography,
  Box,
  InputBase,
  IconButton,
  InputAdornment,
  Alert
} from '@mui/material'
import { ShoppingCart, Tune, Search } from '@mui/icons-material'
import '../Styles/Root.css'

const Root = (props) => {
  // const [cartMeals, setCartMeals] = useState([]);
  const styles = {
    button: {
      margin: 'auto 10px'
    }
  }

  let cartQuantity = 0
  if (props.cartMeals.size > 0) {
    cartQuantity = [...props.cartMeals.values()].reduce((a, b) => a + b)
  } else {
    cartQuantity = 0
  }

  const searchBar = () => {
    return (
      <>
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            justifyContent: 'center',
            /*backgroundColor: 'secondary.main',*/ borderRadius: '40px'
          }}
        >
          {/* <InputBase
            value={props.searchBar}
            onChange={(e) => props.setSearchBar(e.target.value)}
            sx={{ ml: 2, flex: 1 }}
            placeholder='Search Recipes'
            inputProps={{ 'aria-label': 'search recipes' }}
            startAdornment={<InputAdornment position="start" sx={{color: '#fff'}}><Search /></InputAdornment>}
          />
          <IconButton type='button' sx={{ p: '10px', color: '#fff' }} aria-label='search'>
            <Tune />
          </IconButton> */}
        </Box>
      </>
    )
  }

  return (
    <div>
      <div
        // className='Header-bar'
        style={{
          position: 'sticky',
          top: '0px',
          backgroundColor: '#1B2428',
          zIndex: 10,
         
          borderBottom: '1px solid #fff'
        }}
        // style={{
        //   display: 'flex',
        //   justifyContent: 'space-evenly',
        //   borderBottom: '1px solid #fff'
        // }}
      >
        {props.containsProperChromeExtension ? (
          <></>
        ) : (
          <Alert severity='error'>
            Please install the Chefbop Chrome Extension{' '}
            <a
              href='https://chrome.google.com/webstore/detail/chefbop/dhllfmoknkadgllhkgimkclkfdidomep'
              target='_blank'
            >
              here
            </a>
          </Alert>
        )}
        <Box
          id='header-content'
          sx={{
            display: 'flex',
            justifyContent: 'space-evenly',
            padding: '10px 10px',
          }}
        >
          <Typography
            component={Link}
            to={`/`}
            sx={{
              textDecoration: 'none',
              fontFamily: 'Archivo',
              color: '#fff',
              fontWeight: 'bold',
              fontSize: '30px'
            }}
          >
            Chef Bop
          </Typography>
          <Button
            variant='text'
            sx={{ ...styles.button }}
            component={Link}
            to={`/`}
          >
            Cook Book
          </Button>
          {searchBar()}
          <Button
            variant='contained'
            sx={{ ...styles.button }}
            startIcon={<ShoppingCart />}
            component={Link}
            to={`/cart`}
          >
            Cart - {cartQuantity}
          </Button>
          {/* <Button
            variant='outlined'
            sx={{ ...styles.button, paddingLeft: '40px', paddingRight: '40px' }}
            component={Link}
            to={`/log-in`}
          >
            Log In
          </Button> */}
        </Box>
      </div>

      <Outlet />
    </div>
  )
}

export default Root
