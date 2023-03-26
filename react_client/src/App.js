import React, { useState, useEffect } from 'react'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Root from './Routes/root'
import ErrorPage from './errorPage'
import RecipeLanding from './Routes/recipeLanding'
import Cart from './Routes/cart'
import RecipePage from './Components/recipePage'

function App() {
  const [containsProperChromeExtension, setContainsProperChromeExtension] =
    useState(false)
  document.addEventListener('chefBopInformation', function (event) {
    setContainsProperChromeExtension = true //event.detail.message == "1.2"
  }) //I don't know if this needs to be a state change

  let emptyCart = new Map()
  const [cartMeals, setCartMeals] = useState(emptyCart)
  const [searchBar, setSearchBar] = useState('')

  const [oneTimes, setOneTimes] = useState([])

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

  const handleOneTimes = (key, value) => {
    console.log(key)
    if (oneTimes.includes(key)) {
      let tmp = oneTimes
      tmp.splice(tmp.indexOf(key), 1)
      setOneTimes(Array.from(tmp))
    } else {
      setOneTimes((prev) => {
        prev.push(key)
        return Array.from(prev)
      })
    }
  }

  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <Root
          cartMeals={cartMeals}
          searchBar={searchBar}
          setSearchBar={setSearchBar}
          containsProperChromeExtension={containsProperChromeExtension}
        />
      ),
      errorElement: <ErrorPage />,
      children: [
        {
          path: '/',
          element: (
            <RecipeLanding
              handleCartMeals={handleCartMeals}
              cartMeals={cartMeals}
              containsProperChromeExtension={containsProperChromeExtension}
            />
          )
        },
        {
          path: '/cart',
          element: (
            <Cart
              cartMeals={cartMeals}
              handleCartMeals={handleCartMeals}
              oneTimes={oneTimes}
              handleOneTimes={handleOneTimes}
            />
          )
        },
        {
          path: '/recipe',
          element: (
            <RecipePage
              cartMeals={cartMeals}
              handleCartMeals={handleCartMeals}
            />
          )
        }
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
