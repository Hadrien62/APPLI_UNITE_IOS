import React, { useRef } from 'react';
import { View, Text, StatusBar, SafeAreaView, ScrollView, TouchableOpacity, Dimensions, Image, Linking, KeyboardAvoidingView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SIZES } from '.././constants/theme'
import { useCustomFonts } from '../constants/fonts';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const LanguageScreen = () => {

  {/* Link */}
  const ouvrirInstagram = () => {
    const url = 'https://www.instagram.com/unite_event';
    Linking.openURL(url)
  };

  const ouvrirTikTok = () => {
    const url = 'https://www.tiktok.com/@unitevent';
    Linking.openURL(url)
  };

  const ouvrirSiteWeb = () => {
    const url = 'https://unitevent.com/';
    Linking.openURL(url)
  };

  {/* Navigation */}
  const navigation = useNavigation();
  const onSettingScreen = () => {
    navigation.navigate('SettingScreen');
  };

  {/* Font */ }
  const fontsLoaded = useCustomFonts();
  if (!fontsLoaded) {
    return null;
  }

  return (
    <LinearGradient colors={[COLORS.black, COLORS.tertary]} style={{ flex: 1 }}>
      <StatusBar backgroundColor="transparent" translucent />
      <SafeAreaView style={{ top: 50, }}>
            <View style={{ flexDirection: 'row',  marginHorizontal: 25, alignItems:'center' }}>
                <TouchableOpacity onPress={onSettingScreen}>
                    <Ionicons name="chevron-back" size={SIZES.xLarge} color={COLORS.white} />
                </TouchableOpacity>
                <Text style={{marginLeft: 15, fontSize: SIZES.medium, textTransform:'uppercase', fontFamily: 'MonumentExtended-Ultrabold', color: COLORS.white}}>Social Media</Text>
            </View>
        </SafeAreaView>
        <SafeAreaView style={{width:'100%',height:'75%', marginTop:55, justifyContent:'center' }}>
          <SafeAreaView style={{flexDirection: 'row', justifyContent:'space-between' , marginHorizontal:40, marginTop:50, alignItems: 'center' }}> 
            <TouchableOpacity onPress={ouvrirInstagram} style={{ alignItems: 'center' }}>
              <Image source={require('../assets/images/instagram.png')} style={{ height: 125,width:125, resizeMode: 'contain' }} />
              <Text style={{fontSize: SIZES.xMedium, textTransform:'uppercase', fontFamily: 'MonumentExtended-Ultrabold', color: COLORS.white, marginTop:10}}>Instagram</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={ouvrirTikTok} style={{ alignItems: 'center' }}>
              <Image source={require('../assets/images/tiktok.png')} style={{ height: 125,width:125, resizeMode: 'contain' }} />
              <Text style={{ fontSize: SIZES.medium, textTransform:'uppercase', fontFamily: 'MonumentExtended-Ultrabold', color: COLORS.white, marginTop:10}}>Tiktok</Text>
            </TouchableOpacity>
          </SafeAreaView>
          <SafeAreaView style={{justifyContent:'space-between' , marginHorizontal:40, marginTop:40}}> 
            <TouchableOpacity onPress={ouvrirSiteWeb} style={{ alignItems: 'center' }}>
              <Image source={require('../assets/images/App.png')} style={{ height: 125,width:125, resizeMode: 'contain' }} />
              <Text style={{fontSize: SIZES.xMedium, textTransform:'uppercase', fontFamily: 'MonumentExtended-Ultrabold', color: COLORS.white, marginTop:10}}>Website</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </SafeAreaView>
          <SafeAreaView style={{ flex: 1, justifyContent: 'flex-end',alignItems: 'center', marginBottom: 30 }}>
              <Text style={{ fontFamily: 'SpaceGrotesk-Bold', color: COLORS.white, fontSize: SIZES.large, textTransform:'uppercase' }}>© 2023 Unitevents, Inc. </Text>
              <Text style={{ fontFamily: 'SpaceGrotesk-Bold', color: COLORS.secondary, fontSize: SIZES.large }}>Follow us 💛</Text>
          </SafeAreaView>
    </LinearGradient>
  )
}

export default LanguageScreen