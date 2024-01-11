import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Platform,
  Text,
  Button,Modal,
} from 'react-native';
import RecipeDetails from '../components/recipeDetails';
import Typography from '../components/typography';
import {useNavigation,useFocusEffect} from '@react-navigation/native';
import AddRecipeButton from '../components/addRecipeButton';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomButton from '../components/customButton';

const MyRecipeScreen = props => {
  const setViewRecipe = props.setViewRecipe;
  const navigation = useNavigation();
  const scrollView = useRef();
  const [currentView, setCurrentView] = useState(0);
  const [cartMealsLocal, setCartMealsLocal] = useState(props.cartMealsGlobal);
  const userMealVals = props.userMealVals;
  const removeMealVal = props.removeMealVal;
  const [AreYouSureModalVisible, SetAreYouSureModalVisible] = useState(false)
  const [targeDeleteIndex, SetTargeDeleteIndex] = useState(-1)

  useEffect(() => {
  },[userMealVals]);

useEffect(()=>{
  setCartMealsLocal(props.cartMealsGlobal)
},[props.refreshTrigger])

const handleCartMeals = (event, meal, value) => {
  props.handleCartMeals(event,meal,value,setCartMealsLocal, cartMealsLocal)
};

  return (
    <View style={styles.background}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={AreYouSureModalVisible}>
          
          <View style= {styles.centeredView}>
            <View style = {styles.modalView}>
              <Typography>Are you sure you want to delete <Typography variant = {"boldText"}>{targeDeleteIndex>-1?userMealVals[targeDeleteIndex].Name: ""}</Typography>?</Typography>
              <View style = {styles.deleteModalOptionWrapper}>
                <CustomButton style = {styles.deleteModalOptionButton} title = "Yes"
                onClick = {()=>{
                  removeMealVal(targeDeleteIndex)
                  SetTargeDeleteIndex(-1)
                  SetAreYouSureModalVisible(false)
                }}/>
                <CustomButton style = {styles.deleteModalOptionButton} title = "No"
                onClick = {()=>{
                  SetTargeDeleteIndex(-1)
                  SetAreYouSureModalVisible(false)
                }}/>
              </View>
              </View>
              </View>
        </Modal>
    <ScrollView
    ref={scrollView}
    onScroll={e => {
      setCurrentView(e.nativeEvent.contentOffset.y);
    }}
    scrollEventThrottle={16}
    keyboardShouldPersistTaps="always"
    contentInsetAdjustmentBehavior="automatic"
    contentContainerStyle={styles.scroll}>

    <View style={styles.cartHeader}>
      <Typography variant="header1">My Recipes</Typography>
      <Typography>{userMealVals.length} recipes saved</Typography>
    </View>
      {userMealVals.length==0?
          (<View
            style={{
              ...styles.card,
              padding: 15,
            }}>
            <Typography style={{textAlign: 'center'}}>
              You don't have any recipes!
            </Typography>
          </View>
        ):
        <>
        {userMealVals.map((meal,index) => (
        <View
          style={styles.recipeCard}
          key={index}>
          <RecipeDetails
            recipe={meal}
            handleCartMeals={handleCartMeals}
            cartMeals={cartMealsLocal}
            imageCache = {props.imageCache}
            isCart = {false}
          />
          <TouchableOpacity 
            style = {styles.info} 
            onPress = {()=>{
              setViewRecipe(meal);
              navigation.navigate('Recipe');}}>
            <Text style = {styles.infoText}>i</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style = {styles.deleteButton} 
            onPress = {()=>{
              SetTargeDeleteIndex(index)
              SetAreYouSureModalVisible(true)
              }}>
                <Icons name="trash-can" size={31}/>
          </TouchableOpacity>
        </View>
      ))}

</>
      }
      </ScrollView>
      <AddRecipeButton
      setViewRecipe = {setViewRecipe}/>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {backgroundColor: '#1B2428', flex: 1},
  navigationList: {
    padding: 10,
    borderBottomColor: '#fff',
    borderBottomWidth: 1,
    ...Platform.select({ios: {marginTop: 40}}),
  },
  recipeCard: {
    flexDirection: 'row',
    backgroundColor: '#34383F',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
    width: 365,
    alignSelf: 'center',
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    padding: 10,
    flexDirection: 'column',
    paddingBottom: 80,
  },
  info:{
    borderWidth:1,
    borderColor:'rgba(0,0,0,0.2)',
    alignItems:'center',
    justifyContent:'center',
    width:40,
    height:40,
    backgroundColor:'#fff',
    borderRadius:100,
    boxShadow:'rgb(47, 79, 79)',
    fontSize: 31,
    opacity:.75,
    position: 'absolute',
    bottom: 5,
  },
  deleteButton:{
    borderWidth:1,
    borderColor:'rgba(0,0,0,0.2)',
    alignItems:'center',
    justifyContent:'center',
    width:40,
    height:40,
    backgroundColor:'#fff',
    borderRadius:100,
    boxShadow:'rgb(47, 79, 79)',
    fontSize: 31,
    opacity:.75,
    position: 'absolute',
    top: 5,
    right: 5,
  },
  infoText:{
    fontStyle: 'italic',
    fontSize: 25,
    opacity:.75,
    color:'#222',
  },
  card: {
    backgroundColor: '#34383F',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
    width: 365,
    alignSelf: 'center',
  },
  cardHeader: {
    borderBottomColor: '#fff',
    borderBottomWidth: 1,
    flexDirection: 'row',
  },
  cartHeader: {
    paddingBottom: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 10,
    backgroundColor: '#34383F' ,
    borderRadius: 10,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  deleteModalOptionWrapper: {
    flexDirection: 'row'
  },
  deleteModalOptionButton: {
    margin : 5,
    marginTop: 10,
    width: 80
  }
});

export default MyRecipeScreen;
