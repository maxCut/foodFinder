import React from 'react'
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography
} from '@mui/material'
import AddToCartButton from './addToCartButton'

const RecipeCard = (props) => {
  return (
    <Card 
    elevation={0}
    onClick={() => props.onClick(props.recipe.Id)}
    sx={{ 
        backgroundColor: '#34383F', 
        width: '100%', 
        margin: '10px 10px',
        '&:hover': {
            cursor: 'pointer'
        } }}>
        <CardMedia 
        sx={{height: '200px'}}
        image={props.recipe.Image}
        />
      <CardContent>
        <Typography variant='h5'>{props.recipe.Name || 'Recipe name'}</Typography>
        <Typography>Description</Typography>
        <Typography>15 min | 2 servings</Typography>
      </CardContent>
      <CardActions>
<AddToCartButton />
      </CardActions>
    </Card>
  )
}

export default RecipeCard
