import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, Animated, Vibration, Image, ActivityIndicator, Dimensions, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '.././constants/theme';
import { useCustomFonts } from '../constants/fonts';
import { Video } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';



const CardComponent = ({ id, title, date, time, price1, price2, image, video, onPress, onHeartPress, isHeartPressed2 }) => {

  const { width } = Dimensions.get('window');

  {/*  Animation Texte  */ }
  const [isFirstText, setIsFirstText] = useState(true);
  const [fadeAnimation] = useState(new Animated.Value(0));


  const navigation = useNavigation();

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFirstText((prev) => !prev);
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(fadeAnimation, {
        toValue: 0,
        duration: 500,
        delay: 1000,
        useNativeDriver: true,
      }).start(() => {
        fadeAnimation.setValue(0);
      });
    });
  }, [isFirstText]);

  const firstText = (
    <View style={{ height: 35, paddingHorizontal: 5, flexDirection: 'row', borderRadius: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.tertary, marginTop: -5, }}>
      <Animated.Text style={{ color: COLORS.white, fontFamily: 'SpaceGrotesk-Bold', fontSize: SIZES.xMedium, opacity: fadeAnimation, }} >
        {price1}€
      </Animated.Text>
      <Animated.Image source={require('../assets/images/Bracelet.png')} style={{ width: 40, height: 15, marginLeft: 5, resizeMode: 'cover', opacity: fadeAnimation, }} />
    </View>
  );
  const secondText = (
    <View style={{ height: 35, paddingHorizontal: 5, flexDirection: 'row', borderRadius: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.tertary, marginTop: -5, }}>
      <Animated.Text style={{ color: COLORS.white, fontFamily: 'SpaceGrotesk-Bold', fontSize: SIZES.xMedium, opacity: fadeAnimation, }} >
        {price2}€
      </Animated.Text>
      <Animated.Image source={require('../assets/images/BraceletNon.png')} style={{ width: 40, height: 20, marginLeft: 5, resizeMode: 'cover', opacity: fadeAnimation, }} />
    </View>
  );

  {/*  Animation Play  */ }
  const videoWidth = width - 32;
  const videoHeight = (9 / 16) * videoWidth;
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [colorHeart, setColorHeart] = useState(false);

  {/* useEffect changement couleur du coeur */ }
  useEffect(() => {
    setColorHeart(isHeartPressed2);
  }, [isHeartPressed2]);

  useFocusEffect( //masterclass de la bilio navigation react qui effectue la meme que useEffect mais qui se lance lorsque l'on reviens sur la page
    React.useCallback(() => {
      setIsPlaying(false)
      setIsVideoPlaying(false)
    }, [])
  );

  const handlePlayPausePress = () => {
    setIsPlaying(!isPlaying);
    setIsVideoPlaying(!isPlaying);
    if (isPlaying) {
      setIsLoading(false);
    } else {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 1000); {/*  Temps pour charger la page */ }
    }
  }

  {/*  Animation coeur  */ }
  const customVibrationPattern = [0, 30];
  const heartScale = useRef(new Animated.Value(1)).current;

  const handleHeartPress = () => {

    Vibration.vibrate(customVibrationPattern);

    Animated.sequence([
      Animated.timing(heartScale, {
        toValue: 1,
        duration: 0,
        useNativeDriver: true,
      }),
      Animated.timing(heartScale, {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(heartScale, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    onHeartPress({
      id,
      title,
      date,
      time,
      price1,
      price2,
      image,
      video,
      colorHeart,
      isHeartPressed2,
    });

    const newColorHeart = !colorHeart;
    setColorHeart(newColorHeart); // Mise a jour de la couleur du coeur 

  };


  {/* Font */ }
  const fontsLoaded = useCustomFonts();
  if (!fontsLoaded) {
    return null;
  }



  return (
    <TouchableOpacity style={{ marginBottom: 40 }} onPress={onPress} >
      <View style={{ borderRadius: 5, overflow: 'hidden', marginHorizontal: 25 }}>
        {isVideoPlaying ? (
          <Video source={{ uri: video }} style={{ width: videoWidth, height: videoHeight }} shouldPlay={isVideoPlaying} isMuted={false} isLooping={true} resizeMode="cover" />
        ) : (
          <Image source={{ uri: image }} style={{ width: videoWidth, height: videoHeight, resizeMode: 'cover' }} />
        )}
        <Pressable onPress={handleHeartPress} style={{ position: 'absolute', bottom: 15, right: 15, width: 45, height: 45, borderRadius: 25, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)', }} >
          <Animated.View style={{ transform: [{ scale: heartScale }] }}>
            <Ionicons name={colorHeart ? 'heart' : 'heart-outline'} size={24} color={colorHeart ? COLORS.error : COLORS.white} />
          </Animated.View>
        </Pressable>

        {isLoading && (
          <View style={{ position: 'absolute', bottom: 15, left: 15, width: 45, height: 45, borderRadius: 25, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.2)', }} >
            <ActivityIndicator color={COLORS.white} size="small" />
          </View>
        )}
        {!isLoading && (
          <Pressable style={{ position: 'absolute', bottom: 15, left: 15, width: 45, height: 45, borderRadius: 25, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)', }} onPress={handlePlayPausePress} >
            <Ionicons name={isPlaying ? 'stop' : 'play'} size={24} color={COLORS.white} />
          </Pressable>
        )}
      </View>

      <Text style={{ marginHorizontal: 25, color: COLORS.white, fontFamily: 'MonumentExtended-Ultrabold', fontSize: SIZES.large, textTransform: 'uppercase', marginTop: 10 }}>{title}</Text>
      <Text style={{ marginHorizontal: 25, color: COLORS.gray, fontFamily: 'SpaceGrotesk-Bold', fontSize: SIZES.medium, textTransform: 'uppercase', marginTop: 2 }}>By Unitevents </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 25 }}>
        <View style={{ flexDirection: 'row', marginTop: -5 }}>
          <Text style={{ color: COLORS.secondary, fontFamily: 'SpaceGrotesk-Bold', fontSize: SIZES.xMedium }}>{date}</Text>
          <Text style={{ color: COLORS.gray, fontFamily: 'SpaceGrotesk-Bold', fontSize: SIZES.xMedium }}> | </Text>
          <Text style={{ color: COLORS.secondary, fontFamily: 'SpaceGrotesk-Bold', fontSize: SIZES.xMedium }}>{time}</Text>
        </View>
        <View>
          {isFirstText ? firstText : secondText}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CardComponent;
