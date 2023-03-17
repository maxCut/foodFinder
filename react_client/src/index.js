import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import {
  createBrowserRouter,
  RouterProvider,
  useParams
} from 'react-router-dom'
import { ThemeProvider } from '@mui/material'
import { CssBaseline } from '@mui/material'
import theme from './theme.js'
import Root from './Routes/root'
import ErrorPage from './errorPage'
import RecipeLanding from './Routes/recipeLanding'
import Cart from './Routes/cart'
import RecipePage from './Components/recipePage'
// import mealsCopy from '../mealsCopy.json'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <RecipeLanding />
      },
      { path: '/cart', element: <Cart /> },
      {path: '/recipe', element: <RecipePage />}
    ]
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
