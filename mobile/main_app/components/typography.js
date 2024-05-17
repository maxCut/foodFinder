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
    color: '#040435',
  },
  boldText: {
    color: '#040435',
    fontWeight: "bold"
  },
  header1: {
    color: '#040435',
    fontFamily: 'Archivo-Bold',
    fontSize: 30,
    alignSelf: 'flex-start',
  },
  header2: {
    color: '#040435',
    fontFamily: 'Archivo-Bold',
    fontSize: 20,
  },
  header3: {
    color: '#040435',
    fontFamily: 'Archivo-Bold',
    fontSize: 18,
  },
});
export default Typography;
