import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, Animated, Text } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';

const ButtonComponent = ({ onPress, buttonText, colorText, buttonBackground, animated }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateButton = () => {
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 0.85,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    };

    if (animated) {
      animateButton();
      const interval = setInterval(() => {
        animateButton();
      }, 2500);
      return () => clearInterval(interval);
    } else {
      animatedValue.setValue(1);
    }
  }, [animated]);

  return (
    <TouchableOpacity
      style={{
        backgroundColor: buttonBackground || COLORS.primary,
        borderRadius: 5,
        marginHorizontal: 25,
        marginTop: 25,
        textAlign: 'center',
        paddingVertical: 10,
        transform: [{ scale: animatedValue }],
      }}
      onPress={onPress}
    >
      <Text
        style={{
          fontFamily: 'TitilliumWeb-Bold',
          color: colorText || COLORS.white,
          fontSize: SIZES.xLarge,
          textAlign: 'center',
          textTransform: 'uppercase',
        }}
      >
        {buttonText}
      </Text>
    </TouchableOpacity>
  );
};

export default ButtonComponent;


