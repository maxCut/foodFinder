
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const SUPPORTEDMATERIALICONLIST = [
  "local-dining",
  "lunch-dining",
  "local-pizza",
  "dinner-dining",
  "set-meal"
]
const SUPPORTEDMATERIALCOMMUNITYICONLIST = [
  "food-drumstick",
  "food-apple",
  "food-steak"
]
const iconFamilies = [
  {icons: SUPPORTEDMATERIALICONLIST, family: "MaterialIcons", font: MaterialIcons},
  {icons: SUPPORTEDMATERIALCOMMUNITYICONLIST, family: "MaterialCommunityIcons", font: MaterialCommunityIcons}
  ,]

function getSupportedIcons()
{
  return iconFamilies.map(
    (iconFamily)=>{
      return iconFamily.icons.map((icon)=>{
        return {icon:icon, family: iconFamily.family}
      })
    }).flat(1)
}

function getIconFont(fam)
{
  
  for (let index = 0; index < iconFamilies.length; index++) {
    if(iconFamilies[index].family===fam)
    {
      return iconFamilies[index].font
    }
  }
  return MaterialIcons
}

export default {
  getSupportedIcons,
  getIconFont
}