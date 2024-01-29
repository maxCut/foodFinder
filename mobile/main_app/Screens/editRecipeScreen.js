import React, { useEffect,useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
  Platform,
  TouchableOpacity,
} from 'react-native';
import Typography from '../components/typography';
import timeHandler from '../Utils/timeHandler';
import AddToCartButton from '../components/addToCartButton.js';
import Icons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import ingredientHandler from '../Utils/ingredientHandler';

import FastImage from 'react-native-fast-image'
import CustomButton from '../components/customButton';
import EditTextFieldButton from '../components/editTextFieldButton';
import EditIngredientQuantityButton from '../components/editIngredientQuantityButton';
import EditMealIconButton from '../components/editMealIconButton';
import iconWrapper from '../Utils/iconWrapper';

const EditRecipeScreen = props => {
  const recipeIndex = props.recipeIndex
  const onSave = props.onSave
  const [recipe,setRecipe] = useState(props.recipe??{
    prepTime :0,
    cookTime :0, 
    Image: null,
    Icon: "local-dining",
    IconFamily: "MaterialIcons",
    Name: "New Recipe",
    description: "description",
    IncrementAmount: 1,
    instructions:[],
    Ingredients:[],
    NamedIngredients:[],
    NamedPantryIngredients:[],
    OneTimes: [],
    customizable: true,
    uid: Date.now()
  })
  const [cartMealsLocal, setCartMealsLocal] = useState(props.cartMealsGlobal);
  const windowWidth = Dimensions.get('window').width;
  const navigation = useNavigation();
  const MealFontIcon = iconWrapper.getIconFont(recipe.IconFamily)

useEffect(()=>{
  setCartMealsLocal(props.cartMealsGlobal)
},[props.refreshTrigger])

  let timeDetails;
  if (recipe) {
    let prepTime = timeHandler.formatTime(recipe.prepTime);
    let cookTime = timeHandler.formatTime(recipe.cookTime);
    let totalTime = timeHandler.getTotalTime(recipe.prepTime, recipe.cookTime);
    timeDetails = [
      {key: 'Prep Time', value: prepTime, fieldName: "prepTime"},
      {key: 'Cook Time', value: cookTime, fieldName: "cookTime"},
      {key: 'Total Time', value: totalTime, fieldName: null},
    ];
  }

  const instructions = () => {
    const InstructionListItems = ({steps}) => {
      return (
        <View>
          {steps.map((item, index) => {
            return (
              <View key = {index} style={{paddingTop: 15}}>
                <Typography>
                  {index + 1}. {item}
                  <EditTextFieldButton setRecipe ={setRecipe} recipe = {recipe} fieldName = {"instructions"} fieldIndex = {index}/>
                </Typography>
              </View>
            );
          })}
        </View>
      );
    };

    if (typeof recipe.instructions[0] == 'object') {
      return (
        <>
          {recipe.instructions.map((step, index) => {
            return Object.keys(step).map(key => {
              return (
                <>
                  <Typography key = {index} style={{fontWeight: 'bold', marginTop: 20}}>
                    {key}
                  </Typography>
                  <InstructionListItems key = {index}steps={step[key]} />
                </>
              );
            });
          })}
        </>
      );
    } else {
      return <InstructionListItems steps={recipe.instructions} />;
    }
  };

  return (
    <View style={styles.background}>
      <View style={styles.backButtonContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack(null)}
          style={styles.backButton}>
          <Icons name="arrow-back" size={25} color="#1B2428" />
        </TouchableOpacity>
      </View>
      <View style={styles.addToCartFooter}>
        <CustomButton title = {"Save"} onClick={()=>{
          console.log(recipe.NamedIngredients)
          onSave(recipe)
          navigation.goBack(null)
        }}/>
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        { recipe.Image? 
        <FastImage
          style = {{height:350,width: windowWidth}}
          styles={styles.image}
          source={{width: windowWidth, height: 350, uri: recipe.Image}}
        />:
        <View style = {styles.iconImageWrapper}>
          <View  style = {styles.iconImageCircle}>
            <MealFontIcon name={recipe.Icon} style = {styles.iconImage}/>
          </View>
        </View>}
        <EditMealIconButton setRecipe ={setRecipe} recipe = {recipe} />
        <View style={{flex: 1}}>
          <View style={{padding: 15}}>
            <Typography variant="header1">{recipe.Name}<EditTextFieldButton setRecipe ={setRecipe} recipe = {recipe} fieldName = {"Name"}/></Typography>
            <Typography>{recipe.description}<EditTextFieldButton setRecipe ={setRecipe} recipe = {recipe} fieldName = {"description"}/></Typography>
          </View>
          <View style={styles.timeDetailList}>
            {timeDetails.map((item,index) => {
              return (
                <View key = {index} style={styles.timeDetailListItem}>
                  <Typography style={{fontWeight: 'bold'}}>
                    {item.key}
                  </Typography>
                  <Typography>{item.value}
                  {item.fieldName?<EditTextFieldButton setRecipe ={setRecipe} recipe = {recipe}  fieldName = {item.fieldName} numeric = {true}/>:<></>}
                  </Typography>
                </View>
              );
            })}
          </View>
          <View style={styles.list}>
            <Typography variant="header3">Ingredients</Typography>
            <Typography>{recipe.IncrementAmount} servings<EditTextFieldButton setRecipe ={setRecipe} recipe = {recipe} fieldName = {"IncrementAmount"} numeric = {true}/></Typography>
            <View style={{...styles.list, paddingTop: 0}}>
              {recipe.NamedIngredients.map((ingredient,index) => {
                let [name, value, unitName] = ingredient;
                return (

                  <View key = {index} style={{flexDirection:"row"}}>
                    
                  <TouchableOpacity 
                  style = {styles.deleteButton} 
                  onPress = {()=>{
                    const newNamedIngredients = recipe.NamedIngredients
                    newNamedIngredients.splice(index,1)
                    recipe.NamedIngredients
                    setRecipe({...recipe,NamedIngredients:newNamedIngredients})
                  }}>
                  <MaterialCommunityIcons name="trash-can" size={21}/>
                  </TouchableOpacity>
                  <View key = {index} style={styles.listItem}>
                    <Typography>{`\u2022 ${name}`}
                    <EditTextFieldButton setRecipe ={setRecipe} recipe = {recipe} fieldName = {"NamedIngredients"} fieldIndex = {index} fieldSubIndex = {0}/>
                    </Typography>
                    
                    <Typography>
                      {value} {unitName??"Units"}
                    <EditIngredientQuantityButton setRecipe ={setRecipe} recipe = {recipe} numeric = {true} fieldName = {"NamedIngredients"} fieldIndex = {index} fieldSubIndex = {1}/>
                    </Typography>
                  </View>
                  </View>
                );
              })}
            </View>
            <CustomButton title = {"New Ingredient"} onClick= {()=>{
              let ingredientList = recipe.NamedIngredients
              ingredientList.push(["Placeholder",1, "Units"])
              setRecipe({...recipe,NamedIngredients:ingredientList})
            }}></CustomButton>
            <Typography variant="header3">Pantry Ingredients</Typography>
            <Typography>Ingredients you might already have</Typography>
            <View style={{...styles.list, paddingTop: 0}}>
              {recipe.NamedPantryIngredients.map((ingredient,index) => {
                return (
                  <View key = {index} style={{flexDirection:"row"}}>
                  <TouchableOpacity 
                  style = {styles.deleteButton} 
                  onPress = {()=>{
                    const newNamedPantryIngredients = recipe.NamedPantryIngredients
                    newNamedPantryIngredients.splice(index,1)
                    setRecipe({...recipe,NamedPantryIngredients:newNamedPantryIngredients})
                  }}>
                  <MaterialCommunityIcons name="trash-can" size={21}/>
                  </TouchableOpacity>
                  <View key = {index} style={styles.listItem}>
                    <Typography>{`\u2022 ${ingredient}`}
                  <EditTextFieldButton setRecipe ={setRecipe} recipe = {recipe} fieldName = {"NamedPantryIngredients"} fieldIndex = {index}/></Typography>
                  </View>
                  </View>
                );
              })}
            </View>
            <CustomButton title = {"New Pantry Ingredient"} onClick= {()=>{
              let pantryIngredientList = recipe.NamedPantryIngredients
              pantryIngredientList.push("Placeholder")
              setRecipe({...recipe,NamedPantryIngredients:pantryIngredientList})
            }}></CustomButton>
          </View>
          <View style={styles.list}>
            <Typography variant="header2">Instructions</Typography>
            {instructions()}
          </View>
            <CustomButton title = {"New Step"} onClick= {()=>{
              let instructionSteps = recipe.instructions
              instructionSteps.push("Placeholder")
              setRecipe({...recipe,instructions:instructionSteps})
            }}></CustomButton>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {backgroundColor: '#1B2428', flex: 1, paddingBottom: 50},
  backButtonContainer: {
    position: 'absolute',
    zIndex: 1,
    left: 10,
    ...Platform.select({ios: {top: 40}, android: {top: 20}}),
  },
  backButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 50,
  },
  addToCartFooter: {
    position: 'absolute',
    bottom: 0,
    height: 80,
    left: 0,
    right: 0,
    padding: 20,
    zIndex: 1,
    backgroundColor: '#34383F',
    ...Platform.select({ios: {paddingBottom: 20}, android: {paddingBottom: 0}}),
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    flexDirection: 'column',
    paddingBottom: 80,
  },
  image: {
    flex: 1,
  },
  timeDetailList: {
    backgroundColor: '#34383F',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    flex: 1,
    paddingTop: 20,
    paddingBottom: 20,
  },
  timeDetailListItem: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {padding: 15},
  listItem: {
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    verticalAlign:"middle",
    width: "90%",
    verticalAlign:"center",textAlign:"center", marginTop:5, marginBottom:15
  },
  iconImageWrapper:
  {
    height:350,width: "100%",
    alignItems:"center",
    justifyContent: 'center',
},
  iconImageCircle:{

    borderColor:"#E56A25",
    borderWidth: 5,
  padding: 10,
   backgroundColor:"#34383F",
     borderRadius:1000 
    },
  iconImage:{
    color:"#fff",
    padding: 30,
   fontSize:200,
  },
  deleteButton:{
    verticalAlign:"middle",
    borderWidth:1,
    borderColor:'rgba(0,0,0,0.2)',
    alignItems:'center',
    justifyContent:'center',
    width:30,
    height:30,
    backgroundColor:'#fff',
    borderRadius:100,
    boxShadow:'rgb(47, 79, 79)',
    fontSize: 31,
    opacity:.75,
    marginRight: 15,
    marginTop: 15,
    marginBottom: 15
  },
});

export default EditRecipeScreen;
