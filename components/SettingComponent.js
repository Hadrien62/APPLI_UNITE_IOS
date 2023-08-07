import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SIZES } from '../constants/theme';

const SettingComponent = () => {
  const [rotation, setRotation] = useState(new Animated.Value(0));
  const navigation = useNavigation();

  const handleIconPress = () => {
    Animated.timing(rotation, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      navigation.navigate('SettingScreen');
      setTimeout(() => {
        Animated.timing(rotation, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start();
      }, 1000);
    });
  };
  useEffect(() => {
    return () => {
      rotation.setValue(0);
    };
  }, []);

  return (
    <Animated.View style={{ transform: [ { rotate: rotation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'], }),},],}}>
      <TouchableOpacity onPress={handleIconPress}>
        <Ionicons name="settings-outline" size={SIZES.xLarge} color={COLORS.white} />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default SettingComponent;
