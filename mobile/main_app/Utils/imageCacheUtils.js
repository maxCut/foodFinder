
import 
{Image,StyleSheet,
} from 'react-native';

function loadImageCache(mealVals)
{
    const imageCache = new Map();
    for(meal of mealVals)
    {
      imageCache.set(meal.Id, 
        <Image
          styles={styles.image}
          source={{width: 150, height: 150, uri: meal.Image}}
          width={150}
        />)
    }
    return imageCache
}
const imageCacheUtils = {loadImageCache}

const styles = StyleSheet.create({
  background: {backgroundColor: '#1B2428', flex: 1},
  webView: {flex: 1, ...Platform.select({ios: {marginTop: 40}})},
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  circleButton: {
    backgroundColor: '#E56A25',
    padding: 5,
    borderRadius: 40,
    alignItems: 'center',
    width: 28,
  },
  inCartText: {color: '#fff', fontSize: 10},
  image: {
    flex: 1,
    width: 150,
    height:150
  },
  buttonText: {
    color: '#fff',
  },
});
export default imageCacheUtils;