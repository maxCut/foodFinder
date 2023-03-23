import React, {forwardRef} from 'react'
import { Box } from '@mui/material'

const SecondaryNav = forwardRef((props, ref) => {
  return (
    <Box
    ref={ref}
      sx={{
        borderBottom: '1px solid #fff',
        padding: '10px 10px',
        position: 'sticky',
        top: props.containsProperChromeExtension ? '65px' : '114px',
        backgroundColor: '#1B2428',
        zIndex: 9
      }}
    >
        {props.children}
    </Box>
  )
})

export default SecondaryNav
