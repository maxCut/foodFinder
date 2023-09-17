import React from 'react';
import {Text, StyleSheet} from 'react-native';

const Typography = props => {
  let variant = 'bodyText';
  if (props.variant) {
    variant = props.variant;
  }
  return (
    <Text style={{...styles[variant], ...props.style}}>{props.children}</Text>
  );
};
const styles = StyleSheet.create({
  bodyText: {
    color: '#fff',
  },
  header1: {
    color: '#fff',
    fontFamily: 'Archivo-Bold',
    fontSize: 30,
    alignSelf: 'flex-start',
  },
  header2: {
    color: '#fff',
    fontFamily: 'Archivo-Bold',
    fontSize: 20,
  },
  header3: {
    color: '#fff',
    fontFamily: 'Archivo-Bold',
    fontSize: 18,
  },
});
export default Typography;
