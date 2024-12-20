import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const CustomButton = props => {
  const onClick = props.onClick;
  const title = props.title;
  const styleOverride= props.style
  return (
    <View style={{display: 'flex', justifyContent: 'center', height: 40, ...styleOverride}}>
    <TouchableOpacity
      style={styles.button}
      onPress={event => {
        onClick()
        }}>
      <Text style={{...styles.buttonText, fontWeight: 'bold'}}>
        {title}
      </Text>
    </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flexDirection: 'row',
    backgroundColor: '#34383F',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
    width: 350,
  },
  button: {
    borderWidth: 1,
    borderColor:'#030436',
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 40,
    alignItems: 'center',
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
  },
  buttonText: {
    color: '#030436',
    padding: 5
  },
});

export default CustomButton;
