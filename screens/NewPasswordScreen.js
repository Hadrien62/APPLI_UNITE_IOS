import React, { useState, useRef} from 'react';
import { View, Text,  StatusBar, SafeAreaView, TouchableOpacity, KeyboardAvoidingView, Image, Animated, Modal } from 'react-native';
import {COLORS, SIZES} from '.././constants/theme'
import { useNavigation } from '@react-navigation/native';
import { useCustomFonts } from '../constants/fonts';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import ButtonComponent from '../components/ButtonComponent';
import InputComponent from '../components/InputComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SHA256 } from 'crypto-js';

const NewPasswordScreen = () => {

  {/*  Voir le mot de passe */}
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isVisible2, setIsVisible2] = useState(false);
  const [isVisible3, setIsVisible3] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;
  const [showPopup, setShowPopup] = useState(false);
  const [timer, setTimer] = useState(8); 
  const handlePasswordVisibilityToggle = () => {
    setPasswordVisible(!passwordVisible);
  };
  const navigation = useNavigation();
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
  const handleShowPopup2 = () => {
    setIsVisible2(true);
    Animated.timing(animation, {
      toValue: 1,
      duration:250,
      useNativeDriver: false,
    }).start(() => {
      setTimeout(() => {
        handleHidePopup2();
      }, 2500);
    });
  };
  const handleHidePopup2 = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration:250,
      useNativeDriver: false,
    }).start(() => {
      setIsVisible2(false);
    });
  };
  const handleShowPopup3 = () => {
    setIsVisible3(true);
    Animated.timing(animation, {
      toValue: 1,
      duration:250,
      useNativeDriver: false,
    }).start(() => {
      setTimeout(() => {
        handleHidePopup3();
      }, 2500);
    });
  };
  const handleHidePopup3 = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration:250,
      useNativeDriver: false,
    }).start(() => {
      setIsVisible3(false);
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
      navigation.navigate('LoginScreen');
    }, 3000);
  };

  const closePopup = () => {
    setShowPopup(false);
    setTimer(5);
    navigation.navigate('LoginScreen');
  };

  const newPassword = async () =>{
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const digitRegex = /[0-9]/;
    const specialCharRegex = /[\W_]/;
    AsyncStorage.getItem('emailR').then((emailR) =>{
      const userInfoURL = "http://195.20.234.70:3000/connexion/" + emailR;

            var requestOptionsInfoUser = {
              method: "GET",
              redirect: "follow",
            };
            fetch(userInfoURL, requestOptionsInfoUser)
            .then((response) => response.text())
            .then((result) => {
              const client = JSON.parse(result);
              if(password !== "" && password2 !== ''){
              if(password && (!uppercaseRegex.test(password) || !lowercaseRegex.test(password) || !digitRegex.test(password) || !specialCharRegex.test(password) || password.length < 8)){
                handleShowPopup3();
              }else{
                if (password !== password2) {
                  handleShowPopup2();
                }else{
                  let hashedPassword = SHA256(password).toString();
                var iencli = {
                  password: hashedPassword,
                };
                var jsonData = JSON.stringify(iencli);
        
                fetch("http://195.20.234.70:3000/connexion/" + client.id, {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: jsonData,
                })
                  .then((response) => response.json())
                  .then((data) => {
                    AsyncStorage.setItem('userInfo', JSON.stringify(data)).then(() => {
                      startTimer();
                    });
                  })
                  .catch((error) => {
                  });
                }
              }
            }else{
              handleShowPopup();
            }

          })
  })
}
 
{/* Font */}
const fontsLoaded = useCustomFonts();
if (!fontsLoaded) {
  return null; 
}

  return (
    <LinearGradient colors={[COLORS.black, COLORS.tertary]} style={{ flex: 1 }}>
      <StatusBar backgroundColor="transparent" translucent />
      <SafeAreaView style={{top: 50}}>
        <Text style={{marginLeft: 25,marginBottom:25, fontSize: SIZES.medium, textTransform:'uppercase', fontFamily: 'MonumentExtended-Ultrabold', color: COLORS.white}}>New Password</Text>
        <View style={{ flexDirection: 'row', alignItems:'center'}}>
            <InputComponent secureTextEntry={!passwordVisible}  placeholder="New Password" icon="lock-closed" value={password} setValue={setPassword} gradientColors={['#0b0a0f','#0b0a0f', COLORS.tertary, COLORS.tertary]}/>
            <TouchableOpacity style={{ position: 'absolute', alignItems:'center',  right: 40, top:22}} onPress={handlePasswordVisibilityToggle} >
                <Ionicons name={passwordVisible ? 'eye-outline' : 'eye-off-outline'} size={22} color={COLORS.gray}/>
            </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', alignItems:'center'}}>
        <InputComponent secureTextEntry={!passwordVisible} placeholder="Confirm password" icon="lock-closed" value={password2} setValue={setPassword2} gradientColors={['#100f14', '#100f14', COLORS.tertary, COLORS.tertary]}/>   
        <TouchableOpacity style={{ position: 'absolute', alignItems:'center',  right: 40, top:22}} onPress={handlePasswordVisibilityToggle} >
                <Ionicons name={passwordVisible ? 'eye-outline' : 'eye-off-outline'} size={22} color={COLORS.gray}/>
            </TouchableOpacity>  
            </View>    
        <ButtonComponent onPress={newPassword} colorText={COLORS.white} buttonBackground={COLORS.primary} buttonText="Save" />  
        <KeyboardAvoidingView style={{ flex: 1}} behavior="padding" keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}>
            <Image source={require('../assets/images/BackgroundLogin.png')}style={{ width: '100%' ,resizeMode: 'contain' }} />
        </KeyboardAvoidingView>
        {showPopup && (
          <Modal transparent={true} animationType="fade">
            <TouchableOpacity style={{ flex: 1 }}  activeOpacity={1} onPress={closePopup}>
              <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.7)', justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ backgroundColor: COLORS.white, padding: 20, borderRadius: 10, marginHorizontal: 50 }}>
                  <Text style={{ fontSize: SIZES.xMedium, textTransform: 'uppercase', fontFamily: 'MonumentExtended-Ultrabold', color: COLORS.secondary, marginBottom: 10 }}>Password update 🔒</Text>
                  <Text style={{ fontSize: SIZES.xMedium, fontFamily: 'SpaceGrotesk-Bold', color: COLORS.tertary, marginBottom: 20 }}>Your password has been successfully reset!</Text>
                  <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                    <Image source={require('../assets/images/Check.png')} style={{ width: 100, height: 100 }} />
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
            <Text style={{color:COLORS.white,fontSize: SIZES.medium, fontFamily: 'SpaceGrotesk-Bold', marginRight: 25 }}>Please enter a new password</Text>
          </Animated.View>
        )}
        {isVisible2 && (
          <Animated.View style={{ position: 'absolute', bottom: 30, width: '85%', paddingHorizontal: 15, marginHorizontal:25, paddingVertical:10,backgroundColor: 'rgba(0, 0, 0, 0.8)', borderRadius: 25,flexDirection:'row', alignItems:'center', transform: [{ translateY: interpolateY }], opacity: interpolateOpacity}} >
          <Ionicons name="alert-circle" size={SIZES.xLarge} color={COLORS.error} style={{marginRight:5}}/>
            <Text style={{color:COLORS.white,fontSize: SIZES.medium, fontFamily: 'SpaceGrotesk-Bold', marginRight: 25 }}>Passwords aren't the same</Text>
          </Animated.View>
        )}
        {isVisible3 && (
          <Animated.View style={{ position: 'absolute', bottom: 30, width: '85%', paddingHorizontal: 15, marginHorizontal:25, paddingVertical:10,backgroundColor: 'rgba(0, 0, 0, 0.8)', borderRadius: 25,flexDirection:'row', alignItems:'center', transform: [{ translateY: interpolateY }], opacity: interpolateOpacity}} >
          <Ionicons name="alert-circle" size={SIZES.xLarge} color={COLORS.error} style={{marginRight:5}}/>
            <Text style={{color:COLORS.white,fontSize: SIZES.medium, fontFamily: 'SpaceGrotesk-Bold', marginRight: 25 }}>Invalid password (8 characters, 1 uppercase, 1 lowercase, 1 number and 1 special character)</Text>
          </Animated.View>
        )}  
  </LinearGradient>
  );
}


export default NewPasswordScreen
