import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, StatusBar, SafeAreaView, TouchableOpacity, KeyboardAvoidingView, TextInput, Animated, Modal } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';
import { useNavigation } from '@react-navigation/native';
import { useCustomFonts } from '../constants/fonts';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import ButtonComponent from '../components/ButtonComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const CodePasswordScreen = () => {

  /* Input Code*/
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputsRef = useRef([]);
  const [isVisible, setIsVisible] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;
  const [showPopup, setShowPopup] = useState(false);
  const [timer, setTimer] = useState(8); 
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
    }, 3000);
  };

  const closePopup = () => {
    setShowPopup(false);
    setTimer(5);
  };
  const handleChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value !== '' && index < 3) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleBackspace = (index) => {
    const newOtp = [...otp];
    if (newOtp[index] === '') {
      if (index > 0) {
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputsRef.current[index - 1].focus();
      }
    } else {
      newOtp[index] = ''; 
      setOtp(newOtp);
    }
  };

  const resendMdp = () => {
    AsyncStorage.getItem('emailR').then((emailRecup) => {
      AsyncStorage.getItem('code').then((codeR) => {
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
                    startTimer();
                  })
                })
              })
              .catch(error => {
              });
      })
    })
  }


  /* Navigation */
  const navigation = useNavigation();
  const onLoginScreen = () => {
    navigation.navigate('ForgotPasswordScreen');
  };
  const newPasswordScreen = async () => {
    let codeReset = '';
    try {
        AsyncStorage.getItem('code').then((code) => {
        for(let i = 0; i<otp.length;i++){
          codeReset += otp[i];
        }
        if(codeReset == code){
          navigation.navigate('NewPasswordScreen');
        }else{
          handleShowPopup();
        }
      });
    }
    catch (error) {
    };
  }


  /* Font */
  const fontsLoaded = useCustomFonts();
  if (!fontsLoaded) {
    return null;
  }

  return (
    <LinearGradient colors={[COLORS.black, COLORS.tertary]} style={{ flex: 1 }}>
      <StatusBar backgroundColor="transparent" translucent />
      <SafeAreaView style={{ top: 50 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 25 }}>
          <TouchableOpacity onPress={onLoginScreen}>
            <Ionicons name="chevron-back" size={SIZES.xLarge} color={COLORS.white} />
          </TouchableOpacity>
        </View>
        <SafeAreaView style={{ flex: 1, justifyContent: 'flex-end' }}>
          <KeyboardAvoidingView KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}>
            <Image source={require('../assets/images/BackgroundLogin.png')} style={{ width: 'auto', resizeMode: 'contain', marginTop: '60%' }} />
          </KeyboardAvoidingView>
        </SafeAreaView>
        <View style={{ alignItems: 'center' }}>
          <Ionicons name="lock-open" size={90} color={COLORS.graylight}  style={{ backgroundColor: COLORS.tertary, borderRadius: 80, padding: 25, width: 160, height: 160, alignItems: 'center',  justifyContent: 'center', textAlign: 'center', }} />
          <Text style={{ fontSize: SIZES.xMedium, fontFamily: 'SpaceGrotesk-Bold', color: COLORS.white, marginTop: 20, marginHorizontal: 25,  textAlign: 'center', lineHeight: 24, }}> Enter the 4-digit code sent to your e-mail</Text>
        </View>
        <View style={{ justifyContent: 'center',  flexDirection: 'row', marginHorizontal:25 }}>
          {otp.map((digit, index) => (
          <TextInput key={index} ref={(ref) => (inputsRef.current[index] = ref)} style={{ borderColor: COLORS.gray, borderBottomWidth: 4, padding:10, textAlign: 'center', fontSize: SIZES.xxLarge, marginHorizontal:10, fontFamily: 'SpaceGrotesk-Bold', color: COLORS.graylight, marginVertical:10}}value={digit}caretHidden={true} onChangeText={(value) => handleChange(index, value)} keyboardType="numeric"  maxLength={1} onKeyPress={({ nativeEvent }) => {if (nativeEvent.key === 'Backspace') { handleBackspace(index); } }} /> ))} 
        </View>
        <ButtonComponent onPress={newPasswordScreen} buttonText="Verify" animated={true} />
        <View style={{ flexDirection: 'row', marginHorizontal: 25, justifyContent: 'center', marginTop: 15 }}>
          <Text style={{ fontSize: SIZES.medium, fontFamily: 'SpaceGrotesk-Bold', color: COLORS.white }}>Didn't receive the E-mail?</Text>
          <TouchableOpacity onPress={resendMdp}>
            <Text style={{ fontSize: SIZES.medium, fontFamily: 'SpaceGrotesk-Bold', color: COLORS.secondary, marginLeft: 5 }}>Resend</Text>

          </TouchableOpacity>
        </View>
        {showPopup && (
          <Modal transparent={true} animationType="fade">
            <TouchableOpacity style={{ flex: 1 }}  activeOpacity={1} onPress={closePopup}>
              <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.7)', justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ backgroundColor: COLORS.white, padding: 20, borderRadius: 10, marginHorizontal: 50 }}>
                  <Text style={{ fontSize: SIZES.xMedium, textTransform: 'uppercase', fontFamily: 'MonumentExtended-Ultrabold', color: COLORS.secondary, marginBottom: 10 }}>Email Resent 📩</Text>
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
            <Text style={{color:COLORS.white,fontSize: SIZES.medium, fontFamily: 'SpaceGrotesk-Bold', marginRight: 25 }}>The code is incorrect</Text>
          </Animated.View>
        )}
    </LinearGradient>
  );
};

export default CodePasswordScreen;
