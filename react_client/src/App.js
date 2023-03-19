import React, { useState, useEffect } from 'react'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Root from './Routes/root'
import ErrorPage from './errorPage'
import RecipeLanding from './Routes/recipeLanding'
import Cart from './Routes/cart'
import RecipePage from './Components/recipePage'

function App() {
  let emptyCart = new Map()
  const [cartMeals, setCartMeals] = useState(emptyCart)
  const [searchBar, setSearchBar] = useState('');

  const handleCartMeals = (event, meal, value) => {
    event.stopPropagation()
    console.log('handle cart meals')
    if (cartMeals.has(meal)) {
      if (value == 'increment') {
        setCartMeals((prev) => new Map(prev.set(meal, prev.get(meal) + 1)))
      } else {
        setCartMeals((prev) => {
          let quantity = prev.get(meal)
          if (quantity == 1) {
            prev.delete(meal)
            return new Map(prev)
          } else {
            return new Map(prev.set(meal, quantity - 1))
          }
        })
      }
    } else {
      if (value == 'increment') {
        setCartMeals((prev) => new Map(prev.set(meal, 1)))
      }
    }
  }

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Root cartMeals={cartMeals} searchBar={searchBar} setSearchBar={setSearchBar} />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: '/',
          element: (
            <RecipeLanding
              handleCartMeals={handleCartMeals}
              cartMeals={cartMeals}
            />
          )
        },
        { path: '/cart', element: <Cart cartMeals={cartMeals} handleCartMeals={handleCartMeals} /> },
        { path: '/recipe', element: <RecipePage /> }
      ]
    }
  ])

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
