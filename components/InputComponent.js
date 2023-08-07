import React, { useState } from 'react';
import { Animated, View, TextInput, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

const InputComponent = ({ placeholder, icon, gradientColors, secureTextEntry, value, setValue, onlyNumber }) => {
  const [text, setText] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleFieldFocus = () => {
    setIsFocused(true);
  };
  const handleFieldBlur = () => {
    setIsFocused(false);
  };
  const handleInputChange = (value) => {
    setText(value);
  };

  return (
    <View style={{ marginHorizontal: 25, flexDirection: 'row', alignItems: 'center', marginTop: 10, borderWidth: 1, borderColor: isFocused ? COLORS.primary : COLORS.tertary, borderRadius: 5, padding: 10, backgroundColor: COLORS.tertary, position: 'relative' }}>
      <Ionicons name={icon} size={18} color={isFocused ? COLORS.primary : COLORS.white} style={{ marginRight: 10 }} />
      <TextInput style={{ fontSize: SIZES.medium, fontFamily: 'SpaceGrotesk-Regular', flex: 1, color: COLORS.white }} placeholder={isFocused ? '' : placeholder} placeholderTextColor={COLORS.gray} onFocus={handleFieldFocus} onBlur={handleFieldBlur} value={value} onChangeText={setValue}  secureTextEntry={secureTextEntry} keyboardType={onlyNumber ? 'numeric' : 'default'}/>
      {isFocused && (
        <Animated.View style={{ position: 'absolute', top: -8, left: 18, paddingHorizontal: 4 }}>
          <LinearGradient colors={gradientColors} style={{ flex: 1 }}>
            <Text style={{ fontSize: SIZES.small, paddingHorizontal: 5, fontFamily: 'SpaceGrotesk-Bold', color: COLORS.primary }}>{placeholder}</Text>
          </LinearGradient>
        </Animated.View>
      )}
    </View>
  );
};

export default InputComponent;
