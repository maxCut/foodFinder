import { createTheme, responsiveFontSizes } from '@mui/material'

let theme = createTheme({
  palette: {
    primary: {
      main: '#E56A25',
      dark: '#C64C26',
      contrastText: '#fff'
    },
    secondary: {
      main: '#34383F',
      contrastText: '#C8D0D4'
    },
    text: {
      primary: '#fff'
    }
  },
  typography: {
    fontFamily: 'Roboto',
    color: '#ffffff',
    h5: {
        // fontFamily: 'Archivo'
        fontWeight: '700'
    },
    h2: {
        fontFamily: 'Archivo'
    }
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#1B2428'
        }
      }
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      variants: [
        {
          props: { variant: 'text' },
          style: { }
        },
        {
            props: { variant: 'outlined' },
            style: {          border: '1px solid #fff',
            }
          }
      ],
      styleOverrides: {
        root: {
          // background: 'orange',
          textTransform: 'none',
          borderRadius: '30px',
          padding: '6px 30px',
          color: '#fff'
        }
      }
    }
  }
})
theme = responsiveFontSizes(theme)
export default theme
