import React, {useRef,useEffect, useState} from 'react';
import { View, Text, TextInput,  StatusBar, SafeAreaView, Image, TouchableOpacity, KeyboardAvoidingView, Modal, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {COLORS, SIZES} from '.././constants/theme'
import { useCustomFonts } from '../constants/fonts';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import ButtonComponent from '../components/ButtonComponent';
import InputComponent from '../components/InputComponent';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AssistanceScreen = () => {
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
    }, 5000);
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
  const [object, setObject] = useState('');
  const [message, setMessage] = useState('');

    {/* Pop Confirm */}
  const showPopupForTwoSeconds = () => {
    AsyncStorage.getItem('userInfo').then((res) => {
      const userInfo = JSON.parse(res);
      const API_KEY = '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';
            const API_URL = 'https://api.sendgrid.com/v3/mail/send';

            // Données de l'e-mail à envoyer
            if(message !== "" && object !== ""){
            const data = {
              personalizations: [
                {
                  to: [{ email: 'hadri.delobel62@gmail.com' }],
                  subject: userInfo.email,
                },
              ],
              from: { email: 'hadri.delobel62@gmail.com' }, // Remplacez par votre adresse e-mail d'envoi
              content: [
                {
                  type: 'text/html', // Définir le type de contenu comme HTML
                  value: "Object: " + object+ "\n Message: " + message,
                },
              ],
            };

            // Configuration des en-têtes avec la clé d'API SendGrid
            const headers = {
              Authorization: `Bearer ${API_KEY}`,
              'Content-Type': 'application/json',
            };

            // Envoi de la requête POST à l'API SendGrid avec Axios
            axios.post(API_URL, data, { headers })
              .then(response => {
                startTimer();
              })
              .catch(error => {
              });
            }else{
              handleShowPopup();
            }
    })
    
  };

    {/* Navigation */}
    const navigation = useNavigation();
    const onSettingScreen = () => {
      navigation.navigate('SettingScreen');
    };

  {/* Font */}
  const fontsLoaded = useCustomFonts();
  if (!fontsLoaded) {
    return null;
  }

  return (
    <LinearGradient colors={[COLORS.black, COLORS.tertary]} style={{ flex: 1 }}>
        <StatusBar backgroundColor="transparent" translucent />
        <SafeAreaView SafeAreaView style={{ top: 50 }}>
            <View style={{ flexDirection: 'row',  marginHorizontal: 25, marginBottom:25,alignItems:'center' }}>
                <TouchableOpacity onPress={onSettingScreen}>
                    <Ionicons name="chevron-back" size={SIZES.xLarge} color={COLORS.white} />
                </TouchableOpacity>
                <Text style={{marginLeft: 15, fontSize: SIZES.medium, textTransform:'uppercase', fontFamily: 'MonumentExtended-Ultrabold', color: COLORS.white}}>Contact us</Text>
            </View>
            <SafeAreaView  SafeAreaView style={{ flex: 1, justifyContent: 'flex-end' }}>   
              <KeyboardAvoidingView KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}>
                <Image source={require('../assets/images/BackgroundAssistance.png')}style={{ width: 'auto' , resizeMode: 'contain', marginTop:'50%' }} />
              </KeyboardAvoidingView>
             </SafeAreaView>
            <Text style={{fontSize: SIZES.large, marginHorizontal:25, marginBottom:10, fontFamily: 'SpaceGrotesk-Bold', color: COLORS.white}}>Write me a Message 👇</Text>
            <InputComponent  placeholder="Object" icon="folder-open" value={object} setValue={setObject} gradientColors={['#16151a','#16151a', COLORS.tertary, COLORS.tertary]}/> 
            <View style={{marginTop:15}}></View>
            <TextInput style={{ borderWidth: 1, marginTop:10, borderRadius: 5, marginHorizontal:25, padding: 10, backgroundColor: COLORS.tertary , height: 200, textAlignVertical: 'top', borderColor:'transparent',fontSize: SIZES.medium, fontFamily: 'SpaceGrotesk-Regular', color: COLORS.white}} underlineColorAndroid="transparent" placeholder="Your message" value={message} onChangeText={setMessage} placeholderTextColor={COLORS.gray} numberOfLines={15} multiline={true}/>
            <ButtonComponent onPress={showPopupForTwoSeconds} colorText={COLORS.white} buttonBackground={COLORS.primary} buttonText="Send" />
            {/* Pop-up */}
        {showPopup && (
          <Modal transparent={true} animationType="fade">
            <TouchableOpacity style={{ flex: 1 }}  activeOpacity={1} onPress={closePopup}>
                <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.7)', justifyContent: 'center', alignItems: 'center' }}>
                  <View style={{ backgroundColor: COLORS.white, padding: 20, borderRadius: 10,marginHorizontal:50 }}>
                    <Text style={{  fontSize: SIZES.xMedium, textTransform:'uppercase', fontFamily: 'MonumentExtended-Ultrabold',color:COLORS.secondary, marginBottom:10 }}>Message sent 📪</Text>
                    <Text style={{ fontSize: SIZES.xMedium, fontFamily: 'SpaceGrotesk-Bold', color: COLORS.tertary, marginBottom:20 }}>Thank you for your feedback, your message will be processed by support within 48 hours.</Text>
                    <View style={{justifyContent:'center', alignItems:'center',}}>
                      <Image source={require('../assets/images/EmailValid.png')}style={{ width: 100, height:100 }} />
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
            <Text style={{color:COLORS.white,fontSize: SIZES.medium, fontFamily: 'SpaceGrotesk-Bold' }}>Please complete all fields.</Text>
          </Animated.View>
        )}
    </LinearGradient>
  )
}

export default AssistanceScreen