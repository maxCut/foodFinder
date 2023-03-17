import React from 'react'
import { Box, Typography } from '@mui/material'

const Cart = () => {
  return (
    <Box>
      <Box sx={{borderBottom: '1px solid #fff'}}>
        <Typography variant='h2'>Cart</Typography>
        <Typography>2 recipes selected</Typography>
      </Box>
      {/* Cart content */}
    </Box>
  )
}

export default Cart
