import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, StatusBar, SafeAreaView, TouchableOpacity, KeyboardAvoidingView, Alert, Modal, Animated } from 'react-native';
import { COLORS, SIZES } from '.././constants/theme'
import { useNavigation } from '@react-navigation/native';
import { useCustomFonts } from '../constants/fonts';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import ButtonComponent from '../components/ButtonComponent';
import InputComponent from '../components/InputComponent';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const ForgotPasswordScreen = () => {
  const [emailRecup, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [emails, setEmails] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;
  const [showPopup, setShowPopup] = useState(false);
  const [timer, setTimer] = useState(8); 

  const generateReferralCode = () => {
    let code = '';
    const characters = '0123456789';
    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }
    return code;
  };
  const handleShowPopup = () => {
    setIsVisible(true);
    Animated.timing(animation, {
      toValue: 1,
      duration:250,
      useNativeDriver: false,
    }).start(() => {
      setTimeout(() => {
        handleHidePopup();
      }, 2500);
    });
  };
  const handleHidePopup = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration:250,
      useNativeDriver: false,
    }).start(() => {
      setIsVisible(false);
    });
  };
  const interpolateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [30, 0],
  });
  const interpolateOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });
  var intervalId
  const startTimer = () => {
    setShowPopup(true);
    intervalId = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    setTimeout(() => {
      setShowPopup(false);
      clearInterval(intervalId); 
      navigation.navigate('CodePasswordScreen');
    }, 3000);
  };

  const closePopup = () => {
    setShowPopup(false);
    setTimer(5);
    navigation.navigate('CodePasswordScreen');
  };

  {/* Navigation */ }
  const navigation = useNavigation();
  const onLoginScreen2 = () => {
    navigation.navigate("LoginScreen");
  }
  const onLoginScreen = () => {
    const Url = "http://195.20.234.70:3000/connexion/email";
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    fetch(Url, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        const emails = JSON.parse(result);
        setEmails(emails);
        for (let mail of emails) {
          if (mail === (emailRecup.toLowerCase()).replace(/\s+$/, '')) {
            let codeR = generateReferralCode();
            setCode(codeR);
            const API_KEY = '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';
            const API_URL = 'https://api.sendgrid.com/v3/mail/send';

            const data = {
              personalizations: [
                {
                  to: [{ email: emailRecup }],
                  subject: 'Recuperation password',
                },
              ],
              from: { email: 'hadri.delobel62@gmail.com' }, 
              content: [
                {
                  type: 'text/html', 
                  value: 'Code de récuperation, ' + codeR,
                },
              ],
            };

            const headers = {
              Authorization: `Bearer ${API_KEY}`,
              'Content-Type': 'application/json',
            };

            axios.post(API_URL, data, { headers })
              .then(response => {
                AsyncStorage.setItem('emailR', emailRecup).then(()=>{
                  AsyncStorage.setItem('code', codeR).then(()=>{
                    setEmail('');
                    startTimer();
                  })
                })
              })
              .catch(error => {
                setEmail('');
                navigation.navigate('LoginScreen');
              });

            return;
          }
        }

        setEmail('');
        handleShowPopup()
      })
      .catch((error) => {
        setEmail('');
        navigation.navigate('CodePasswordScreen');
      });
  };




  {/* Font */ }
  const fontsLoaded = useCustomFonts();
  if (!fontsLoaded) {
    return null;
  }

  return (
    <LinearGradient colors={[COLORS.black, COLORS.tertary]} style={{ flex: 1 }}>
      <StatusBar backgroundColor="transparent" translucent />
      <SafeAreaView style={{ top: 50 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 25 }}>
          <TouchableOpacity onPress={onLoginScreen2}>
            <Ionicons name="chevron-back" size={SIZES.xLarge} color={COLORS.white} />
          </TouchableOpacity>
        </View>
        <Text style={{ fontSize: SIZES.medium, fontFamily: 'SpaceGrotesk-Bold', color: COLORS.white, marginHorizontal: 25, marginTop: 30, marginBottom: 15 }}>🔐 Don't panic, we'll send you a link to reset your password</Text>
        <InputComponent value={emailRecup} setValue={setEmail} placeholder="E-mail" icon="mail" gradientColors={['#100f14', '#100f14', COLORS.tertary, COLORS.tertary]} />
        <ButtonComponent onPress={onLoginScreen} buttonText="Email Link" animated={true} />
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}>
          <Image source={require('../assets/images/BackgroundLogin.png')} style={{ width: '100%', resizeMode: 'contain' }} />
        </KeyboardAvoidingView>
        {showPopup && (
          <Modal transparent={true} animationType="fade">
            <TouchableOpacity style={{ flex: 1 }}  activeOpacity={1} onPress={closePopup}>
              <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.7)', justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ backgroundColor: COLORS.white, padding: 20, borderRadius: 10, marginHorizontal: 50 }}>
                  <Text style={{ fontSize: SIZES.xMedium, textTransform: 'uppercase', fontFamily: 'MonumentExtended-Ultrabold', color: COLORS.secondary, marginBottom: 10 }}>Email sent 📩</Text>
                  <Text style={{ fontSize: SIZES.xMedium, fontFamily: 'SpaceGrotesk-Bold', color: COLORS.tertary, marginBottom: 20 }}>A reset code has been sent to you. If you can't find it, check your spam folder.</Text>
                  <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                    <Image source={require('../assets/images/EmailValid.png')} style={{ width: 100, height: 100 }} />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </Modal>
        )}
      </SafeAreaView>
      {isVisible && (
          <Animated.View style={{ position: 'absolute', bottom: 30, width: '85%', paddingHorizontal: 15, marginHorizontal:25, paddingVertical:10,backgroundColor: 'rgba(0, 0, 0, 0.8)', borderRadius: 25,flexDirection:'row', alignItems:'center', transform: [{ translateY: interpolateY }], opacity: interpolateOpacity}} >
          <Ionicons name="alert-circle" size={SIZES.xLarge} color={COLORS.error} style={{marginRight:5}}/>
            <Text style={{color:COLORS.white,fontSize: SIZES.medium, fontFamily: 'SpaceGrotesk-Bold', marginRight: 25 }}>Please check your information</Text>
          </Animated.View>
        )}
    </LinearGradient>
  )
}

export default ForgotPasswordScreen