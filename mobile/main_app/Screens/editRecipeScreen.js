import React, { useEffect,useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
  Platform,
  TouchableOpacity,
  Modal,
  TextInput,
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
import parseUtils from '../Utils/parseUtils';
import DropShadow from 'react-native-drop-shadow';


const EditRecipeScreen = props => {
  const recipeIndex = props.recipeIndex
  const onSave = props.onSave
  const [showImportURLModalOption,setShowImportURLModalOption] = useState(props.recipe==null)
  const [showImportURLModal,setShowImportURLModal] = useState(false)
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
  let urlInputVal = ""
  const [isValidURL, setIsValidURL] = useState(true)
  const [errorText, setErrorText] = useState("Must Be a Valid URL")
  return (
    <View style={styles.background}>

  <Modal
        animationType="fade"
        transparent={true}
        visible={showImportURLModal}>
          <View style= {styles.centeredView}>

    <DropShadow
style={{
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 0,
  },
  shadowOpacity: 1,
  shadowRadius: 3,
}}
>
            <View style = {styles.modalView}>
              <Typography>Enter Recipe Link</Typography>
              {isValidURL?
              <></>:
              <Typography style = {{color:"#F00"}}>{errorText}</Typography>
              }
          <TextInput
            style={styles.input}
            placeholder= {"www.example.com"}
            keyboardType="text"
            onChangeText={(text)=>{urlInputVal=text}}
          />
                <View style = {styles.modalOptionWrapper}>
                <CustomButton style = {styles.modalOptionButton} title = "Done"
                onClick = {()=>{
                  if(parseUtils.checkURLIsValid(urlInputVal))
                  {
                    parseUtils.parseURLForRecipe(urlInputVal).then((recipeNew)=>
                    {
                      setRecipe(recipeNew)
                      setShowImportURLModal(false)
                    }).catch(e=>{
                      {
                        console.log("error ", e)
                        if(e.message === "This URL is not a Recipe")
                        {
                          setErrorText("We can't parse any recipes on from page, try a different link")
                        }
                        else
                        {
                          setErrorText("Oops, something went wrong")
                        }
                        setIsValidURL(false)
                      }})
                  }
                  else
                  {
                    setErrorText("Must Be a Valid URL")
                    setIsValidURL(false)
                  }
                }}/>
                <CustomButton style = {styles.modalOptionButton} title = "Cancel"
                onClick = {()=>{setShowImportURLModal(false)}}/>
                </View>
              </View>
              </DropShadow>
              </View>
        </Modal>

    <Modal
    
        animationType="slide"
        transparent={true}
        visible={showImportURLModalOption}>

          <View style= {styles.centeredView}>
    <DropShadow
style={{
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 0,
  },
  shadowOpacity: 1,
  shadowRadius: 3,
}}
>
            <View style = {styles.modalView}>
              <Typography>Import from a URL?</Typography>
              <View style = {styles.modalOptionWrapper}>
                <CustomButton style = {styles.modalOptionButton} title = "Yes"
                onClick = {()=>{
                  setShowImportURLModal(true)
                  setShowImportURLModalOption(false)
                }}/>
                <CustomButton style = {styles.modalOptionButton} title = "No"
                onClick = {()=>{
                  setShowImportURLModalOption(false)
                }}/>
              </View>
              </View>
</DropShadow>
              </View>
        </Modal>

      <View style={styles.backButtonContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack(null)}
          style={styles.backButton}>
          <Icons name="arrow-back" size={25} color="#1B2428" />
        </TouchableOpacity>
      </View>
      <View style={styles.addToCartFooter}>
        <CustomButton title = {"Save"} onClick={()=>{
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
                    <View style = {styles.itemName}>
                    <Typography>{`\u2022 ${name}`}
                    <EditTextFieldButton setRecipe ={setRecipe} recipe = {recipe} fieldName = {"NamedIngredients"} fieldIndex = {index} fieldSubIndex = {0}/>
                    </Typography>
                    </View>
                    
                    <View style = {styles.itemQuantity}>
                    <Typography>
                      {value} {unitName??"Units"}
                    <EditIngredientQuantityButton setRecipe ={setRecipe} recipe = {recipe} numeric = {true} fieldName = {"NamedIngredients"} fieldIndex = {index} fieldSubIndex = {1}/>
                    </Typography>
                    </View>
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
  background: {backgroundColor: '#fff', flex: 1, paddingBottom: 50},
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
    backgroundColor: '#030436',
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
  list: {padding: 5},
  listItem: {
    flexDirection: 'row',
    flexWrap:'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    verticalAlign:"center",
    textAlign:"center", 
    marginTop:10,
    width:"90%"
  },
  itemName:{
    maxWidth:"60%",
  },
  itemQuantity:{
    flexDirection: 'row-reverse',
    right: 5,

  },
  iconImageWrapper:
  {
    height:350,width: "100%",
    alignItems:"center",
    justifyContent: 'center',
},
  iconImageCircle:{

    borderColor:"#7bffda",
    borderWidth: 5,
  padding: 10,
   backgroundColor:"#030436",
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
    marginTop: 5,
    marginBottom: 5
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 10,
    backgroundColor: '#fff' ,
    borderRadius: 10,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  modalOptionWrapper: {
    flexDirection: 'row'
  },
  modalOptionButton: {
    margin : 5,
    marginTop: 10,
    width: 80
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    width: 350,
  },
});

export default EditRecipeScreen;
