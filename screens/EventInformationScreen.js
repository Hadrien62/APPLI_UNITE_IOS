import React, { useState, useEffect, useRef, mapRef } from 'react';
import { View, Text, StatusBar, SafeAreaView, TouchableOpacity, Image, Pressable, Dimensions, Share, Platform, Animated, Vibration, Linking, Button, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation, useTheme } from '@react-navigation/native';
import { COLORS, SIZES } from '../constants/theme';
import { useCustomFonts } from '../constants/fonts';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView } from 'react-native-gesture-handler';
import Collapsible from 'react-native-collapsible';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format, parseISO } from 'date-fns';
import BookTicketScreen from './BookTicketScreen';


const EventInformationScreen = () => {

  {/* Animation Texte */ }
  const [isFirstText, setIsFirstText] = useState(true);
  const [fadeAnimation] = useState(new Animated.Value(0));
  const [partyInfo, setPartyInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState('');
  const [email, setEmail] = useState(false);
  const [partyAlreadyBuy, setPartyAlreadyBuy] = useState(false);


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

  //Bouton get a ticket
  const firstText = (
    <View style={{ height: 50, flexDirection: 'row', borderRadius: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.primary }}>
      <Text style={{ color: COLORS.white, fontFamily: 'SpaceGrotesk-Bold', fontSize: SIZES.xMedium, textTransform: 'uppercase' }} >Get a ticket - </Text>
      <Animated.Text style={{ color: COLORS.white, fontFamily: 'SpaceGrotesk-Bold', fontSize: SIZES.xMedium, opacity: fadeAnimation }} >{partyInfo.price ? Object.values(partyInfo.price)?.[0]?.[1] + '€' : ''}</Animated.Text>
      <Animated.Image source={require('../assets/images/Bracelet.png')} style={{ width: 40, height: 15, marginLeft: 5, resizeMode: 'cover', opacity: fadeAnimation, }} />
    </View>
  );
  const secondText = (
    <View style={{ height: 50, flexDirection: 'row', borderRadius: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.primary }}>
      <Text style={{ color: COLORS.white, fontFamily: 'SpaceGrotesk-Bold', fontSize: SIZES.xMedium, textTransform: 'uppercase' }} >Get a ticket - </Text>
      <Animated.Text style={{ color: COLORS.white, fontFamily: 'SpaceGrotesk-Bold', fontSize: SIZES.xMedium, opacity: fadeAnimation }} >{partyInfo.price ? Object.values(partyInfo.price)?.[0]?.[0] + '€' : ''}</Animated.Text>
      <Animated.Image source={require('../assets/images/BraceletNon.png')} style={{ width: 40, height: 15, marginLeft: 5, resizeMode: 'cover', opacity: fadeAnimation, }} />
    </View>
  );


  const screenWidth = Dimensions.get('window').width;
  const imageHeight = Dimensions.get('window').height * 0.35

  {/* About */ }
  const maxLines = 10;
  const [isCollapsed, setIsCollapsed] = useState(true);
  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);
  const [showButton, setShowButton] = useState(false);


  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
      setShowButton(contentRef.current.scrollHeight > maxLines * contentRef.current?.lineHeight);
    }
  }, [contentRef.current?.scrollHeight]);

  {/* Fonction recup info party cliqué*/ }
  const getPartyInfo = async () => {
    try {
      setIsLoading(true); 
      const partyInfoData = await AsyncStorage.getItem('party');
      if (partyInfoData) {
        const partyInfo = JSON.parse(partyInfoData);
        setPartyInfo(partyInfo)
        setIsLoading(false); 
      }
    } catch (error) {
      setIsLoading(false); 
    }
  };


  const fetchUserInfo = async () => {

    try {
      AsyncStorage.getItem('cookieEmail').then((cookieEmail) => {
        if (cookieEmail !== null) {
          setEmail(cookieEmail);
          const userInfoURL = `http://195.20.234.70:3000/connexion/${cookieEmail}`;
          const requestOptionsInfoUser = {
            method: "GET",
            redirect: "follow",
          };

          fetch(userInfoURL, requestOptionsInfoUser)
            .then(async (response) => {
              const result = await response.text();
              const infoUser = JSON.parse(result);
              setUserInfo(infoUser);
             
            })
            .catch((error) => {
            });
        } else {
          getUserInfo();
        }
      });
    } catch (error) {
    }

  };

  const getUserInfo = async () => {
    try {
      const partyInfoData = await AsyncStorage.getItem('userInfo');
      if (partyInfoData) {
        const partyInfo = JSON.parse(partyInfoData);
        setUserInfo(partyInfo);
      }
    } catch (error) {
    }
  };

  {/* Lance la fonction pour récup les infos */ }
  useEffect(() => {
    fetchUserInfo();
    getPartyInfo();
  }, [])

  useEffect(() => {
    if (userInfo !== '') { 
      getPartyAlreadyBuy(userInfo, partyInfo);
    }
  }, [userInfo, partyInfo])

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  {/* Navigation */ }
  const navigation = useNavigation();
  const onMenuPage = () => {
    navigation.goBack();
  };
  const goBookTicketScreen = () => {
    navigation.navigate("BookTicketScreen");
  }


  {/* Font */ }
  const fontsLoaded = useCustomFonts();
  if (!fontsLoaded) {
    return null;
  }

  {/* Map */ }
  const latitude = parseFloat(partyInfo.geo?.[1]);

  const longitude = parseFloat(partyInfo.geo?.[0]);

  var imgUrl = "http://195.20.234.70:3000/events/photo/" + partyInfo.image_name;

  if (partyInfo.image_name == "") {
    imgUrl = "http://195.20.234.70:3000/events/photo/Fond.png";
  }

  const ouvrirGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const getPartyAlreadyBuy = (userInfo, partyInfo) => {

    if (userInfo.attente !== null) {
      const keys = Object.keys(userInfo.attente);

      keys.forEach((attenteKey) => {

        const attenteKeyNumber = parseInt(attenteKey, 10);

        if (attenteKeyNumber == partyInfo.id) {
          setPartyAlreadyBuy(true)
        }
      });
    }
    if (userInfo.party_id !== null) {
      const keys = Object.keys(userInfo.party_id);

      keys.forEach((attenteKey) => {

        const attenteKeyNumber = parseInt(attenteKey, 10);

        if (attenteKeyNumber == partyInfo.id) {
          setPartyAlreadyBuy(true)
        }
      });
    }
  }





  return (
    <LinearGradient colors={[COLORS.black, COLORS.tertary]} style={{ flex: 1 }}>
      <StatusBar backgroundColor="transparent" translucent />

      {/* Image */}
      <View>
        <Image source={{ uri: imgUrl }} style={{ width: screenWidth, height: imageHeight }} />
        <TouchableOpacity onPress={onMenuPage} style={{ position: 'absolute', top: 30, left: 25, width: 45, height: 45, borderRadius: 25, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)', }} >
          <Ionicons name={'chevron-down'} size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* Description */}
      <LinearGradient colors={[COLORS.black, COLORS.tertary]} style={{ flex: 1, marginTop: -30, borderTopLeftRadius: 15, borderTopRightRadius: 15 }}>
        <ScrollView vertical showsVerticalScrollIndicator={false} style={{ marginBottom: 25, marginTop: 25, marginHorizontal: 25 }}>
          <Text Text style={{ color: COLORS.white, fontFamily: 'MonumentExtended-Ultrabold', fontSize: SIZES.xLarge, textTransform: 'uppercase' }}>{partyInfo.name}</Text>
          <Text style={{ color: COLORS.gray, fontFamily: 'SpaceGrotesk-Bold', fontSize: SIZES.xMedium, textTransform: 'uppercase', marginTop: 2, marginBottom: 35 }}>By Unitevents </Text>
          <SafeAreaView style={{ flexDirection: 'row' }}>
            <Ionicons name={'calendar-outline'} size={24} color={COLORS.gray} style={{ marginRight: 20 }} />

            <Text style={{ color: COLORS.secondary, fontFamily: 'SpaceGrotesk-Bold', fontSize: SIZES.large }}>{format(parseISO(partyInfo.date), 'EEE dd MMM')}
            </Text>
            <Text style={{ color: COLORS.gray, marginHorizontal: 5, fontFamily: 'SpaceGrotesk-Bold', fontSize: SIZES.large }}> | </Text>

            <Text style={{ color: COLORS.white, fontFamily: 'SpaceGrotesk-Bold', fontSize: SIZES.large }}>
              {`${new Date(`1970-01-01T${partyInfo.start_time}`).toLocaleTimeString(undefined, { hour: "numeric", minute: "numeric", hour12: false })}`}
            </Text>
            <Text style={{ color: COLORS.white, marginHorizontal: 2, fontFamily: 'SpaceGrotesk-Bold', fontSize: SIZES.large }}> - </Text>
            <Text style={{ color: COLORS.white, fontFamily: 'SpaceGrotesk-Bold', fontSize: SIZES.large }}>
              {`${new Date(`1970-01-01T${partyInfo.end_time}`).toLocaleTimeString(undefined, { hour: "numeric", minute: "numeric", hour12: false })}`}
            </Text>

          </SafeAreaView>
          <View style={{ backgroundColor: COLORS.tertary, height: 1, marginLeft: 45, marginVertical: 15 }}></View>
          <SafeAreaView style={{ flexDirection: 'row' }}>
            <Ionicons name={'home-outline'} size={24} color={COLORS.gray} style={{ marginRight: 20 }} />
            <Text style={{ color: COLORS.white, fontFamily: 'SpaceGrotesk-Bold', fontSize: SIZES.large, flexWrap: 'wrap', flex: 1 }}>{partyInfo.place}</Text>
          </SafeAreaView>
          <View style={{ backgroundColor: COLORS.tertary, height: 1, marginLeft: 45, marginVertical: 15 }}></View>
          <SafeAreaView style={{ flexDirection: 'row' }}>
            <Ionicons name={'location-outline'} size={24} color={COLORS.gray} style={{ marginRight: 20 }} />
            <Text style={{ color: COLORS.white, fontFamily: 'SpaceGrotesk-Bold', fontSize: SIZES.large, marginRight: 25, flexWrap: 'wrap', flex: 1 }}>{partyInfo.address}</Text>
          </SafeAreaView>

          {/* Map */}
          <Text style={{ color: COLORS.white, fontFamily: 'MonumentExtended-Ultrabold', fontSize: SIZES.large, textTransform: 'uppercase', marginBottom: 10, marginTop: 35 }}>Location </Text>
          <SafeAreaView style={{ backgroundColor: COLORS.tertary, marginTop: 10 }}>
            <View style={{ borderRadius: 5, overflow: 'hidden' }}>
              <MapView ref={mapRef} style={{ flex: 1, width: '100%', height: 160 }} initialRegion={{ latitude: latitude, longitude: longitude, latitudeDelta: 0.028, longitudeDelta: 0.028, }} >
                <Marker coordinate={{ latitude: latitude, longitude: longitude }} />
              </MapView>
              <TouchableOpacity onPress={ouvrirGoogleMaps} style={{ position: 'absolute', bottom: 10, right: 10, width: 45, height: 45, borderRadius: 25, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)', }}>
                <Ionicons name="map-outline" size={24} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          </SafeAreaView>

          {/* About */}
          <Text style={{ color: COLORS.white, fontFamily: 'MonumentExtended-Ultrabold', fontSize: SIZES.large, textTransform: 'uppercase', marginBottom: 10, marginTop: 25 }}>About event </Text>
          <Text ref={contentRef} numberOfLines={isCollapsed ? maxLines : undefined} lineBreakMode="clip" ellipsizeMode="tail" onTextLayout={event => { const lines = event.nativeEvent.lines; if (lines.length > maxLines) { setShowButton(true); setContentHeight(contentRef.current.scrollHeight); } else { setShowButton(false); } }} style={{ color: COLORS.gray, fontFamily: 'SpaceGrotesk-Bold', fontSize: SIZES.xMedium, flexWrap: 'wrap', flex: 1 }}>{partyInfo.description}
          </Text>
          {showButton && (
            <TouchableOpacity onPress={tofggleCollapse} style={{ justifyContent: 'center', alignItems: 'center', marginTop: 5 }}>
              {isCollapsed ? (
                <Ionicons name="chevron-down" size={24} color={COLORS.gray} />
              ) : (
                <Ionicons name="chevron-up" size={24} color={COLORS.gray} />
              )}
            </TouchableOpacity>
          )}

          {/* Vibe */}
          <Text style={{ color: COLORS.white, fontFamily: 'MonumentExtended-Ultrabold', textTransform: 'uppercase', fontSize: SIZES.large, marginBottom: 10, marginTop: 25 }}>Vibe </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexDirection: 'row', marginBottom: 5 }}>
            {partyInfo.music.map((genre, index) => (
              <View key={index} style={{ paddingVertical: 6, paddingHorizontal: 15, borderWidth: 2, borderColor: COLORS.tertary, borderRadius: 25, alignItems: 'center', justifyContent: 'center', marginRight: 5 }}>
                <Text style={{ fontFamily: 'SpaceGrotesk-Bold', fontSize: SIZES.medium, textTransform: 'uppercase', color: COLORS.gray }}>{genre}</Text>
              </View>
            ))}
          </ScrollView>
        </ScrollView>
        {

          partyAlreadyBuy ? (
            <View
              style={{
                height: 50,
                flexDirection: 'row',
                borderRadius: 5,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: COLORS.gray,
                marginHorizontal: 25,
                marginBottom: 25,
              }}
            >
              <Ionicons name="lock-closed" size={SIZES.xLarge} color={COLORS.white} />

            </View>
          ) : (
            <TouchableOpacity
              style={{ marginHorizontal: 25, marginBottom: 25 }}
              onPress={goBookTicketScreen}
            >
              {isFirstText ? firstText : secondText}
            </TouchableOpacity>
          )
        }

      </LinearGradient>
    </LinearGradient>
  );
}
export default EventInformationScreen