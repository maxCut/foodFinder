import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import { Button, Typography } from '@mui/material'
import {ShoppingCart} from '@mui/icons-material'
import '../Styles/Root.css'

const Root = () => {
    const styles = {
        button: {
            margin: 'auto 10px'
        }
    }
  return (
    <div>
      <div
      className='Header-bar'
        // style={{
        //   display: 'flex',
        //   justifyContent: 'space-evenly',
        //   borderBottom: '1px solid #fff'
        // }}
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
        sx={{...styles.button}}
        component={Link} to={`/cookbook`}>
          Cook Book
        </Button>
        <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
          Search bar
        </div>
        <Button 
        variant='contained'
        sx={{...styles.button}}
        startIcon={<ShoppingCart />}
        component={Link} to={`/cart`}>
          Cart - 0
        </Button>
        <Button 
        variant='outlined'
        sx={{...styles.button, paddingLeft: '40px', paddingRight: '40px'}}
        component={Link} to={`/log-in`}>
          Log In
        </Button>
      </div>

      <Outlet />
    </div>
  )
}

export default Root
