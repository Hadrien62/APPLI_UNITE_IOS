import { StyleSheet } from 'react-native';
import {COLORS, SIZES} from '.././constants/theme'

const styles = StyleSheet.create({
  title: {
    color: COLORS.white, 
    fontFamily: 'MonumentExtended-Ultrabold', 
    textTransform: 'uppercase', 
    fontSize: SIZES.xLarge
  }
});

export default styles;
