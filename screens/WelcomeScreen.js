import React, { useEffect } from 'react';
import { Text, Image, ImageBackground, StatusBar, SafeAreaView, TouchableOpacity, Animated } from 'react-native';
import {COLORS, SIZES} from '.././constants/theme'
import { useNavigation, useFocusEffect, CommonActions } from '@react-navigation/native';
import { useCustomFonts } from '../constants/fonts';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import ButtonComponent from '../components/ButtonComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WelcomeScreen = () => {

  {/* Navigation */}
  const navigation = useNavigation();
  const onEventScreen = async() => {
    AsyncStorage.removeItem('cookieEmail').then(()=>{
      console.log('supprimer');
      AsyncStorage.removeItem('cookiePassword').then(()=>{
        console.log('supprimer');
      })
    })
  };
  const onLoginScreen = async () => {
    try {
      const cookieEmail = await AsyncStorage.getItem('cookieEmail');
      const cookiePassword = await AsyncStorage.getItem('cookiePassword');
  
      if (cookieEmail && cookiePassword) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          })
        );
      } else {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'LoginScreen' }],
          })
        );
      }
    } catch (error) {
      console.log('Error occurred:', error);
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'LoginScreen' }],
        })
      );
    }
  };
  useFocusEffect( 
    React.useCallback(() => {
      AsyncStorage.getItem('cookieEmail').then((cookieEmail) => {
        AsyncStorage.getItem('cookiePassword').then((cookiePassword) => {
          AsyncStorage.getItem('compte').then((compte) => {
            if (cookieEmail && cookiePassword) {
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'Home' }],
                })
              );
            }else if(compte){
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'LoginScreen' }],
                })
              );
            }
          })
        })
      })
    }, [])
  );

  {/* Font */}
  const fontsLoaded = useCustomFonts();
  if (!fontsLoaded) {
    return null; 
  }

  return (
    <LinearGradient colors={[COLORS.tertary, COLORS.black]} style={{ flex: 1 }}>
        <StatusBar backgroundColor="transparent" translucent />

      {/* Header */}
      <SafeAreaView style={{ height: '35%' }}>
        <ImageBackground source={require('../assets/images/BackgroundWelcome.png')} style={{ height: '100%', resizeMode: 'contain' }}>    
        </ImageBackground>
      </SafeAreaView>

      {/* Logo */}
      <SafeAreaView style={{ justifyContent: 'center', alignItems: 'center', height: '50%'}} >
        <Image source={require('../assets/images/LogoNom.png')} style={{ height: '80%', resizeMode: 'contain' }} />
      </SafeAreaView>
      <ButtonComponent onPress={onLoginScreen} colorText={COLORS.white} buttonBackground={COLORS.primary} buttonText="Tap to party" animated={true} />
     </LinearGradient>
  );
};

export default WelcomeScreen;