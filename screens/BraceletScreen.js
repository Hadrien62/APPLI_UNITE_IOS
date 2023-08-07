import React, { useEffect, useRef, useState } from 'react';
import { Text, Image, ImageBackground, StatusBar, SafeAreaView, TouchableWithoutFeedback, Easing, TouchableOpacity, Animated, View, Linking, ScrollView } from 'react-native';
import { COLORS, SIZES } from '.././constants/theme'
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useCustomFonts } from '../constants/fonts';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import ButtonComponent from '../components/ButtonComponent';
import { setDayWithOptions } from 'date-fns/fp';
import AsyncStorage from '@react-native-async-storage/async-storage';


const BraceletScreen = () => {

  const navigation = useNavigation();

  const openGoogleMaps = (placeName) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${placeName}`;
    Linking.openURL(url);
    
  };

  const [userInfo, setUserInfo] = useState('');
  const [braceletAlreadyBuy, setBraceletAlreadyBuy] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const popupTypeRef = useRef('');

  const showPopUp = (type) => {
    setShowPopup(true);
    popupTypeRef.current = type;
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  const hidePopUp = () => {
    Animated.timing(scaleAnim, {
      toValue: 0,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start(() => setShowPopup(false));
  };

  const handleCancel = () => {
    hidePopUp();
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      getUserInfo();

    }, [])
  );

  useFocusEffect(
    React.useCallback(() => {
      if (userInfo.bracelet) {
        setBraceletAlreadyBuy(true);
        AsyncStorage.removeItem('bracelet').then(() => {
        })
      } else {
        AsyncStorage.getItem("bracelet").then((heureBuyBracelet) => {
          if (heureBuyBracelet !== null) {
            setBraceletAlreadyBuy(true);
          }else if(userInfo.attente !== null || userInfo.attente !== undefined){
            console.log("sa lut")
            if(Object.keys(userInfo.attente).includes("bracelet")){
              setBraceletAlreadyBuy(true);
            }else{
              setBraceletAlreadyBuy(false);
            }
          }else {
            setBraceletAlreadyBuy(false);
          }
        })
      }
    }, [userInfo])
  );

  {/* Fonction recup info users*/ }
  const getUserInfo = async () => {
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
            })
            .catch((error) => {
            });
        } catch (error) {
        }
      }
    } catch (error) {

    }
  };

  const acheterBracelet = async () => {
    let userInfo = await AsyncStorage.getItem('userInfo');
    let user = JSON.parse(userInfo);

    let json = {}
    if (user.attente === null || user.attente === undefined) {
      json["bracelet"] = 27;
    } else {
      json = user.attente;
      json["bracelet"] = 27;
    }
    let data = JSON.stringify({
      attente: json,
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

    fetch("http://195.20.234.70:3000/connexion/" + user.id, requestOptions)
      .then(response => response.text())
      .then(result => {

        const currentDate = new Date();
        const currentDateStr = currentDate.toISOString();

        AsyncStorage.setItem("bracelet", currentDateStr).then(() => {
        })
          .catch((error) => {
            console.log(error)
          });
        hidePopUp();
        navigation.navigate('Home', { screen: 'TicketScreen' });
      })
      .catch(error => console.log('error', error));
  }

  /* Police de caractères */
  const fontsLoaded = useCustomFonts();
  if (!fontsLoaded) {
    return null;
  }

  return (
    <LinearGradient colors={[COLORS.black, COLORS.tertary]} style={{ flex: 1 }}>
      <StatusBar backgroundColor="transparent" translucent />
      <SafeAreaView style={{ height: '28%', }}>
        <ImageBackground source={require('../assets/images/braceletFond.png')} style={{ height: '100%', whdth: '100%', resizeMode: 'contain' }}>
        </ImageBackground>
      </SafeAreaView>
      <LinearGradient colors={[COLORS.black, COLORS.tertary]} style={{ marginTop: -30, borderTopLeftRadius: 15, borderTopRightRadius: 15, flex: 1, justifyContent: 'center', }}>
        <View style={{ flex: 1, justifyContent: 'center', marginHorizontal: 25 }}>

          <ScrollView vertical showsVerticalScrollIndicator={false} style={{ marginTop: 25, marginBottom: 25 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
              <Text style={{ fontSize: SIZES.large, textTransform: 'uppercase', fontFamily: 'MonumentExtended-Ultrabold', color: COLORS.white, marginRight: 10 }}>freedom</Text>
              <Text style={{ fontSize: SIZES.large, textTransform: 'uppercase', fontFamily: 'MonumentExtended-Ultrabold', color: COLORS.white, backgroundColor: COLORS.primary, paddingHorizontal: 5 }}>pass</Text>
            </View>
            <SafeAreaView style={{ backgroundColor: COLORS.tertary, borderRadius: 5, paddingHorizontal: 25, paddingVertical: 15, marginBottom: 25, flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: SIZES.xMedium, textTransform: 'uppercase', fontFamily: 'MonumentExtended-Ultrabold', color: COLORS.secondary }}>included in pass</Text>
                <Ionicons name="clipboard" size={SIZES.xMedium} color={COLORS.secondary} style={{ marginLeft: 10, }} />
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                <Ionicons name="infinite" size={SIZES.large} color={COLORS.gray} style={{ marginRight: 10 }} />
                <Text style={{ fontFamily: 'SpaceGrotesk-Bold', fontSize: SIZES.xMedium, color: COLORS.white, }}>Unlimited acces to Club 77</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                <Ionicons name="flame" size={SIZES.large} color={COLORS.gray} style={{ marginRight: 10 }} />
                <Text style={{ fontFamily: 'SpaceGrotesk-Bold', fontSize: SIZES.xMedium, color: COLORS.white, }}>Discounts on all Unite events</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                <Ionicons name="flash" size={SIZES.large} color={COLORS.gray} style={{ marginRight: 10 }} />
                <Text style={{ fontFamily: 'SpaceGrotesk-Bold', fontSize: SIZES.xMedium, color: COLORS.white, }}>Discounts with our partners</Text>
              </View>
            </SafeAreaView>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
              <Text style={{ fontSize: SIZES.large, textTransform: 'uppercase', fontFamily: 'MonumentExtended-Ultrabold', color: COLORS.white, marginRight: 10 }}>get your</Text>
              <Text style={{ fontSize: SIZES.large, textTransform: 'uppercase', fontFamily: 'MonumentExtended-Ultrabold', color: COLORS.white, backgroundColor: COLORS.primary, paddingHorizontal: 5 }}>discounts</Text>
            </View>
            <View style={{ backgroundColor: COLORS.tertary, borderRadius: 5, paddingHorizontal: 25, paddingVertical: 15 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                <Text style={{ fontSize: SIZES.xMedium, textTransform: 'uppercase', fontFamily: 'MonumentExtended-Ultrabold', color: COLORS.secondary }}>Restaurant</Text>
                <Ionicons name="fast-food" size={SIZES.xMedium} color={COLORS.secondary} style={{ marginLeft: 10 }} />
              </View>
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }} onPress={() => openGoogleMaps('Dolce Sicilia Paceville')}>
                <Ionicons name="send" size={10} color={COLORS.white} style={{ marginRight: 10 }} />
                <Text style={{ fontFamily: 'SpaceGrotesk-Bold', fontSize: SIZES.medium, textTransform: 'uppercase', color: COLORS.white, flex: 1 }}>Dolce Sicilia - <Text style={{ fontFamily: 'SpaceGrotesk-Bold', fontSize: SIZES.medium, textTransform: 'uppercase', color: COLORS.gray, flex: 1 }}>10% OFF</Text></Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }} onPress={() => openGoogleMaps('My way Paceville')}>
                <Ionicons name="send" size={10} color={COLORS.white} style={{ marginRight: 10 }} />
                <Text style={{ fontFamily: 'SpaceGrotesk-Bold', fontSize: SIZES.medium, textTransform: 'uppercase', color: COLORS.white, flex: 1 }}>My Way - <Text style={{ fontFamily: 'SpaceGrotesk-Bold', fontSize: SIZES.medium, textTransform: 'uppercase', color: COLORS.gray, flex: 1 }}>10% OFF</Text></Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }} onPress={() => openGoogleMaps('Ostricaio Paceville')}>
                <Ionicons name="send" size={10} color={COLORS.white} style={{ marginRight: 10 }} />
                <Text style={{ fontFamily: 'SpaceGrotesk-Bold', fontSize: SIZES.medium, textTransform: 'uppercase', color: COLORS.white, flex: 1 }}>Ostricaio - <Text style={{ fontFamily: 'SpaceGrotesk-Bold', fontSize: SIZES.medium, textTransform: 'uppercase', color: COLORS.gray, flex: 1 }}>10% OFF</Text></Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }} onPress={() => openGoogleMaps('Suruchi Indian Paceville')}>
                <Ionicons name="send" size={10} color={COLORS.white} style={{ marginRight: 10 }} />
                <Text style={{ fontFamily: 'SpaceGrotesk-Bold', fontSize: SIZES.medium, textTransform: 'uppercase', color: COLORS.white, flex: 1 }}>Suruchi Indian - <Text style={{ fontFamily: 'SpaceGrotesk-Bold', fontSize: SIZES.medium, textTransform: 'uppercase', color: COLORS.gray, flex: 1 }}>10% OFF</Text></Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }} onPress={() => openGoogleMaps('Aloha Paceville')}>
                <Ionicons name="send" size={10} color={COLORS.white} style={{ marginRight: 10 }} />
                <Text style={{ fontFamily: 'SpaceGrotesk-Bold', fontSize: SIZES.medium, textTransform: 'uppercase', color: COLORS.white, flex: 1 }}>Aloha - <Text style={{ fontFamily: 'SpaceGrotesk-Bold', fontSize: SIZES.medium, textTransform: 'uppercase', color: COLORS.gray, flex: 1 }}>15% OFF</Text></Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }} onPress={() => openGoogleMaps('Net Viet Paceville')}>
                <Ionicons name="send" size={10} color={COLORS.white} style={{ marginRight: 10 }} />
                <Text style={{ fontFamily: 'SpaceGrotesk-Bold', fontSize: SIZES.medium, textTransform: 'uppercase', color: COLORS.white, flex: 1 }}>Net Viet - <Text style={{ fontFamily: 'SpaceGrotesk-Bold', fontSize: SIZES.medium, textTransform: 'uppercase', color: COLORS.gray, flex: 1 }}>15% OFF</Text></Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }} onPress={() => openGoogleMaps('Nom Nom Paceville')}>
                <Ionicons name="send" size={10} color={COLORS.white} style={{ marginRight: 10 }} />
                <Text style={{ fontFamily: 'SpaceGrotesk-Bold', fontSize: SIZES.medium, textTransform: 'uppercase', color: COLORS.white, flex: 1 }}>NomNOm Shisha - <Text style={{ fontFamily: 'SpaceGrotesk-Bold', fontSize: SIZES.medium, textTransform: 'uppercase', color: COLORS.gray, flex: 1 }}>15€ INSTEAD 20€</Text></Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }} onPress={() => openGoogleMaps('Impasta Paceville')}>
                <Ionicons name="send" size={10} color={COLORS.white} style={{ marginRight: 10 }} />
                <Text style={{ fontFamily: 'SpaceGrotesk-Bold', fontSize: SIZES.medium, textTransform: 'uppercase', color: COLORS.white, flex: 1 }}>Impasta - <Text style={{ fontFamily: 'SpaceGrotesk-Bold', fontSize: SIZES.medium, textTransform: 'uppercase', color: COLORS.gray, flex: 1 }}>10% ON ALL PASTA</Text></Text>
              </TouchableOpacity>

              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5, marginBottom: 5 }}>
                <Text style={{ fontSize: SIZES.xMedium, textTransform: 'uppercase', fontFamily: 'MonumentExtended-Ultrabold', color: COLORS.secondary, }}>Night</Text>
                <Ionicons name="star" size={SIZES.xMedium} color={COLORS.secondary} style={{ marginLeft: 10 }} />
              </View>
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15, }} onPress={() => openGoogleMaps('G Hotel Paceville')}>
                <Ionicons name="send" size={10} color={COLORS.white} style={{ marginRight: 10 }} />
                <Text style={{ fontFamily: 'SpaceGrotesk-Bold', fontSize: SIZES.medium, textTransform: 'uppercase', color: COLORS.white, flex: 1 }}>G HOTEL - <Text style={{ fontFamily: 'SpaceGrotesk-Bold', fontSize: SIZES.medium, textTransform: 'uppercase', color: COLORS.gray, flex: 1 }}>GUEST LIST TO ROOFTOP PARTY EVERY FRYDAY</Text></Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }} onPress={() => openGoogleMaps('Hot ice bar Paceville')}>
                <Ionicons name="send" size={10} color={COLORS.white} style={{ marginRight: 10 }} />
                <Text style={{ fontFamily: 'SpaceGrotesk-Bold', fontSize: SIZES.medium, textTransform: 'uppercase', color: COLORS.white, flex: 1 }}>Hot ice bar - <Text style={{ fontFamily: 'SpaceGrotesk-Bold', fontSize: SIZES.medium, textTransform: 'uppercase', color: COLORS.gray, flex: 1 }}>10% OFF</Text></Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }} onPress={() => openGoogleMaps('The Truth Paceville')}>
                <Ionicons name="send" size={10} color={COLORS.white} style={{ marginRight: 10 }} />
                <Text style={{ fontFamily: 'SpaceGrotesk-Bold', fontSize: SIZES.medium, textTransform: 'uppercase', color: COLORS.white, flex: 1 }}>The truth<Text style={{ fontFamily: 'SpaceGrotesk-Bold', fontSize: SIZES.medium, color: COLORS.white, flex: 1 }}> (Dance club)</Text> - <Text style={{ fontFamily: 'SpaceGrotesk-Bold', fontSize: SIZES.medium, textTransform: 'uppercase', color: COLORS.gray, flex: 1 }}>EVERYDAY 5PM TO 10PM FIX MENU 10€</Text></Text>
              </TouchableOpacity>

              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5, marginBottom: 5 }}>
                <Text style={{ fontSize: SIZES.xMedium, textTransform: 'uppercase', fontFamily: 'MonumentExtended-Ultrabold', color: COLORS.secondary, }}>Activity</Text>
                <Ionicons name="leaf" size={SIZES.xMedium} color={COLORS.secondary} style={{ marginLeft: 10 }} />
              </View>
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }} onPress={() => openGoogleMaps('Skin Art Tatoo Paceville')}>
                <Ionicons name="send" size={10} color={COLORS.white} style={{ marginRight: 10 }} />
                <Text style={{ fontFamily: 'SpaceGrotesk-Bold', fontSize: SIZES.medium, textTransform: 'uppercase', color: COLORS.white, flex: 1 }}>Skin tatoo Shop - <Text style={{ fontFamily: 'SpaceGrotesk-Bold', fontSize: SIZES.medium, textTransform: 'uppercase', color: COLORS.gray, flex: 1 }}>10% OFF</Text></Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }} onPress={() => openGoogleMaps('Go Gozo Quad Paceville')}>
                <Ionicons name="send" size={10} color={COLORS.white} style={{ marginRight: 10 }} />
                <Text style={{ fontFamily: 'SpaceGrotesk-Bold', fontSize: SIZES.medium, textTransform: 'uppercase', color: COLORS.white, flex: 1 }}>Go gozo quad<Text style={{ fontFamily: 'SpaceGrotesk-Bold', fontSize: SIZES.medium, color: COLORS.white, flex: 1 }}> (Jeep Tour)</Text> - <Text style={{ fontFamily: 'SpaceGrotesk-Bold', fontSize: SIZES.medium, textTransform: 'uppercase', color: COLORS.gray, flex: 1 }}>10% OFF</Text></Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }} onPress={() => openGoogleMaps('Divewise Paceville')}>
                <Ionicons name="send" size={10} color={COLORS.white} style={{ marginRight: 10 }} />
                <Text style={{ fontFamily: 'SpaceGrotesk-Bold', fontSize: SIZES.medium, textTransform: 'uppercase', color: COLORS.white, flex: 1 }}>Divewise malta<Text style={{ fontFamily: 'SpaceGrotesk-Bold', fontSize: SIZES.medium, color: COLORS.white, flex: 1 }}> (Diving)</Text> - <Text style={{ fontFamily: 'SpaceGrotesk-Bold', fontSize: SIZES.medium, textTransform: 'uppercase', color: COLORS.gray, flex: 1 }}>15% OFF</Text></Text>
              </TouchableOpacity>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5, marginBottom: 5 }}>
                <Text style={{ fontSize: SIZES.xMedium, textTransform: 'uppercase', fontFamily: 'MonumentExtended-Ultrabold', color: COLORS.secondary, }}>Utilities</Text>
                <Ionicons name="car" size={SIZES.xMedium} color={COLORS.secondary} style={{ marginLeft: 10 }} />
                <Ionicons name="medical" size={SIZES.xMedium} color={COLORS.secondary} style={{ marginLeft: 5 }} />
              </View>
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }} onPress={() => openGoogleMaps('Baron Hire Rent Car Paceville')}>
                <Ionicons name="send" size={10} color={COLORS.white} style={{ marginRight: 10 }} />
                <Text style={{ fontFamily: 'SpaceGrotesk-Bold', fontSize: SIZES.medium, textTransform: 'uppercase', color: COLORS.white, flex: 1 }}>Baron hire rent car, van, scooter - <Text style={{ fontFamily: 'SpaceGrotesk-Bold', fontSize: SIZES.medium, textTransform: 'uppercase', color: COLORS.gray, flex: 1 }}>10% OFF</Text></Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => openGoogleMaps('Potters Paceville')}>
                <Ionicons name="send" size={10} color={COLORS.white} style={{ marginRight: 10 }} />
                <Text style={{ fontFamily: 'SpaceGrotesk-Bold', fontSize: SIZES.medium, textTransform: 'uppercase', color: COLORS.white, flex: 1 }}>Potters<Text style={{ fontFamily: 'SpaceGrotesk-Bold', fontSize: SIZES.medium, color: COLORS.white, flex: 1 }}> (Dr Kevin / Pharmacy)</Text> - <Text style={{ fontFamily: 'SpaceGrotesk-Bold', fontSize: SIZES.medium, textTransform: 'uppercase', color: COLORS.gray, flex: 1 }}>CONSULTATIONS AND SEX TESTS</Text></Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
        <View style={{ marginBottom: 70 }}>
          {
            braceletAlreadyBuy ? (
              <View
                style={{
                  height: 50,
                  flexDirection: 'row',
                  borderRadius: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: COLORS.gray,
                  marginHorizontal: 25,
                }}
              >
                <Ionicons name="lock-closed" size={SIZES.xLarge} color={COLORS.white} />

              </View>
            ) : (
              <ButtonComponent colorText={COLORS.white} buttonBackground={COLORS.primary} onPress={showPopUp} buttonText="Gets your now for 27€ " animated={true} />
            )
          }
        </View>
      </LinearGradient>
      {showPopup && (
        <TouchableOpacity activeOpacity={1} style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }} onPress={hidePopUp}>
          <Animated.View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)', opacity: scaleAnim }}>
            <TouchableWithoutFeedback>
              <View style={{ backgroundColor: COLORS.white, borderRadius: 20, marginHorizontal: 40, padding: 30 }}>
                <Text style={{ fontSize: SIZES.large, textAlign: 'center', fontFamily: 'SpaceGrotesk-Bold', color: COLORS.black }}>Are you sure you want to get the bracelet?</Text>
                <ButtonComponent onPress={handleCancel} colorText={COLORS.white} buttonBackground={COLORS.graylight} buttonText="Cancel" />
                <ButtonComponent onPress={acheterBracelet} colorText={COLORS.white} buttonBackground={COLORS.valid} buttonText="Confirm" />
                <Text style={{ fontSize: SIZES.small, fontFamily: 'SpaceGrotesk-Bold', color: COLORS.gray, marginTop: 10 }}>By pressing the "Confirm" button, you agree to come to the Unite shop within 24 hours to take your ticket.</Text>

              </View>
            </TouchableWithoutFeedback>
          </Animated.View>
        </TouchableOpacity>
      )}
    </LinearGradient>
  );
};
export default BraceletScreen;