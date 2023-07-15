import React from 'react';
import {Text, StyleSheet} from 'react-native';

const Typography = props => {
  let variant = 'bodyText';
  if (props.variant) {
    variant = props.variant;
  }
  return <Text style={styles[variant]}>{props.children}</Text>;
};
const styles = StyleSheet.create({
  bodyText: {
    color: '#fff',
  },
  header1: {
    color: '#fff',
    fontFamily: 'Archivo-Bold',
    fontSize: 30,
  },
  header2: {
    color: '#fff',
    fontFamily: 'Archivo-Bold',
    fontSize: 24,
  },
  header3: {
    color: '#fff',
    fontFamily: 'Archivo-Bold',
    fontSize: 20,
  },
});
export default Typography;
