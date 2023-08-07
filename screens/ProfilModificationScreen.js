import React, {useRef} from 'react';
import { View, Text, StatusBar, SafeAreaView, TouchableOpacity, KeyboardAvoidingView, Image, Animated, Modal, ActivityIndicator  } from 'react-native';
import {COLORS, SIZES} from '.././constants/theme'
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useCustomFonts } from '../constants/fonts';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import ButtonComponent from '../components/ButtonComponent';
import InputComponent from '../components/InputComponent';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PhoneInput from "react-native-phone-number-input";

const ProfilModificationScreen = () => {

  const phoneInputRef = useRef(null);

  const handlePhoneInputChange = () => {
    if (phoneInputRef.current) {
      return phoneInputRef.current.getValue();
    }
      return '';
  };
  {/* Navigation */}
  const navigation = useNavigation();
  const onSettingScreen = () => {
    navigation.navigate('SettingScreen');
  };

  {/* Variables*/}
  const [userInfo, setUserInfo] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState('');
  const [firstname, setFirstname] = useState('');
  const [email, setEmail] = useState('');
  const [phonenumber, setPhonenumber] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [timer, setTimer] = useState(8); 
  const [animation] = useState(new Animated.Value(0));
  const [isVisible, setIsVisible] = useState(false);

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
      navigation.navigate('Home');
    }, 3000);
  };

  const closePopup = () => {
    setShowPopup(false);
    setTimer(5);
    navigation.navigate('Home');
  };

  useEffect(() => {
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      AsyncStorage.getItem('userInfo').then((data) => {
        const userInfo = JSON.parse(data);
        setUserInfo(userInfo);
        setName(userInfo.name);
        setFirstname(userInfo.firstname);
        setEmail(userInfo.email);
        const formattedPhoneNumber = userInfo.phonenumber.substring(3);
        setPhonenumber(formattedPhoneNumber);
      })
    }, [])

  );
    
 
  {/* Font */}
  const fontsLoaded = useCustomFonts();
  if (!fontsLoaded) {
    return null; 
  }



  {/* Fonction recup info users*/ }
  const handleNameChange = (text) => {
    setName(text);
  };

  const handleFirstnameChange = (text) => {
    setFirstname(text);
  };


  const handleEmailChange = (text) => {
    setEmail(text);
  };
  


  {/* Save info modifié */}
  const handleChangeInfo = async () => {
    if(name !== "" && firstname !== "" && phonenumber !== "" && email !== ""){
      const emailRegex = /[a-z0-9_\-\.]+@[a-z0-9_\-\.]+\.[a-z]+/i;
      const emailWithoutSpace = email.replace(/\s+$/, '');
      if (emailWithoutSpace && emailRegex.test(emailWithoutSpace.toLowerCase())){

    try {
      const userInfoData = await AsyncStorage.getItem('userInfo');
      if (userInfoData) {
        const userInfo = JSON.parse(userInfoData);
        const userInfoURL = `http://195.20.234.70:3000/connexion/${userInfo.email}`;
        var requestOptionsInfoUser = {
          method: "GET",
          redirect: "follow",
        };
        try {
          const response = await fetch(userInfoURL, requestOptionsInfoUser);
          const result = await response.json();
          setUserInfo(result);
          AsyncStorage.setItem('userInfo', JSON.stringify(result))
            .then(() => { 

              let data = JSON.stringify({
                "name": name,
                "firstname": firstname,
                "email": emailWithoutSpace.toLowerCase(),
                "phonenumber": phonenumber,
              });
          
              var requestOptions = {
                method: 'PATCH',
                maxBodyLength: Infinity,
                headers: {
                  'Content-Type': 'application/json'
                },
                body: data,
                redirect: 'follow'          
              };
          
              fetch("http://195.20.234.70:3000/connexion/" + userInfo.id, requestOptions)
                .then(response => response.text())
                .then(result => {
                  AsyncStorage.setItem('cookieEmail',emailWithoutSpace.toLowerCase()).then(() => {
                    AsyncStorage.setItem('userInfo', JSON.stringify(result))
                    .then(() => {
                      startTimer()
                    });
                  });
                })
                .catch(error => console.log('error', error));
          
          

            })
            .catch((error) => {
            });
        } catch (error) {
        }
      }
    } catch (error) {
    }
  }else{
    handleShowPopup();
  }
  }else{
    handleShowPopup();
  }
    
  }

    return (

      <LinearGradient colors={[COLORS.black, COLORS.tertary]} style={{ flex: 1 }}>
        <StatusBar backgroundColor="transparent" translucent />
        <SafeAreaView style={{top: 50}}>
            <SafeAreaView  SafeAreaView style={{ flex: 1, justifyContent: 'flex-end' }}>   
              <KeyboardAvoidingView KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}>
                <Image source={require('../assets/images/BackgroundLogin.png')}style={{ width: 'auto' , resizeMode: 'contain', marginTop:'60%' }} />
              </KeyboardAvoidingView>
             </SafeAreaView>

           {/*  Header */}
            <View style={{ flexDirection: 'row',  marginHorizontal: 25, alignItems:'center', marginBottom: 30 }}>
                <TouchableOpacity onPress={onSettingScreen}  >
                    <Ionicons name="chevron-back" size={SIZES.xLarge} color={COLORS.white} />
                </TouchableOpacity>
                <Text style={{marginLeft: 15, fontSize: SIZES.medium, textTransform:'uppercase', fontFamily: 'MonumentExtended-Ultrabold', color: COLORS.white}}>Edit the profile</Text>
            </View>
            <InputComponent placeholder="Name" icon="person" value={name} setValue={handleNameChange} gradientColors={['#0b0a0f','#0b0a0f', COLORS.tertary, COLORS.tertary]}/>  
            <View style={{marginVertical:10}}></View>      
            <InputComponent placeholder="Surname" icon="happy"  value={firstname} setValue={handleFirstnameChange} gradientColors={['#100f14', '#100f14', COLORS.tertary, COLORS.tertary]}/> 
            <View style={{marginVertical:10}}></View>      
            <View style={{marginHorizontal:25}}>
              <PhoneInput ref={phoneInputRef} defaultCode='FR' defaultValue={phonenumber} onChangeFormattedText={(text) => {setPhonenumber(text)}} onlyNumber={true}
                flagButtonStyle={{ width: 70 }} 
                containerStyle={{ marginRight:25, width:'100%',alignItems: 'center', marginTop: 10, justifyContent:'center', textAlign:'center', backgroundColor: COLORS.tertary,  borderRadius: 5,  height:50
                }}
                textContainerStyle={{
                  backgroundColor: 'transparent', 
                }}
              textInputStyle={{
                color: COLORS.white,    
                marginBottom:-3,
                fontSize: SIZES.medium, 
                fontFamily: 'SpaceGrotesk-Regular',
              }}
              textInputProps={{
                placeholderTextColor: COLORS.gray, 
              }}
              codeTextStyle={{
                color: COLORS.white,
                marginLeft:-15,
                fontSize: SIZES.medium, 
                fontFamily: 'SpaceGrotesk-Regular',
              }}/>
            </View>
            <View style={{marginVertical:10}}></View>      
            <InputComponent placeholder="E-mail" icon="mail" value={email} setValue={handleEmailChange} gradientColors={['#1f2229', '#1f2229',COLORS.tertary, COLORS.tertary]}/>
            <View style={{marginVertical:5}}></View>      
            <ButtonComponent onPress={handleChangeInfo} colorText={COLORS.white} buttonBackground={COLORS.primary} animated={true} buttonText="Save" />
         {/* Pop-up */}
         
         {showPopup && (
          <Modal transparent={true} animationType="fade">
            <TouchableOpacity style={{ flex: 1 }}  activeOpacity={1} onPress={closePopup}>
            <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.7)', justifyContent: 'center', alignItems: 'center' }}>
                  <View style={{ backgroundColor: COLORS.white, padding: 20, borderRadius: 10,marginHorizontal:50 }}>
                    <Text style={{  fontSize: SIZES.xMedium, textTransform:'uppercase', fontFamily: 'MonumentExtended-Ultrabold',color:COLORS.secondary, marginBottom:10 }}>updated profile</Text>
                    <Text style={{ fontSize: SIZES.xMedium, fontFamily: 'SpaceGrotesk-Bold', color: COLORS.tertary, marginBottom:20 }}>Your profile has been successfully updated!</Text>
                    <View style={{justifyContent:'center', alignItems:'center',}}>
                      <Image source={require('../assets/images/Check.png')}style={{ width: 100, height:100 }} />
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
            <Text style={{color:COLORS.white,fontSize: SIZES.medium, fontFamily: 'SpaceGrotesk-Bold' }}>Please check your information</Text>
          </Animated.View>
        )}  
    </LinearGradient>
      )
    
}

export default ProfilModificationScreen;