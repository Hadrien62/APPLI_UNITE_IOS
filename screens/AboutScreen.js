import { View, Text,  StatusBar, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {COLORS, SIZES} from '.././constants/theme'
import { useCustomFonts } from '../constants/fonts';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const AboutScreen = () => {
    
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
      <SafeAreaView style={{ top: 50 }}>
            <View style={{ flexDirection: 'row',  marginHorizontal: 25, alignItems:'center' }}>
                <TouchableOpacity onPress={onSettingScreen}>
                    <Ionicons name="chevron-back" size={SIZES.xLarge} color={COLORS.white} />
                </TouchableOpacity>
                <Text style={{marginLeft: 15, fontSize: SIZES.medium, textTransform:'uppercase', fontFamily: 'MonumentExtended-Ultrabold', color: COLORS.white}}>About Us</Text>
            </View>
            <View style={{alignItems:'center', marginHorizontal:50}}>
                <Image source={require('../assets/images/App.png')} style={{ height: '40%', resizeMode: 'contain', marginTop:50 }} />
                <Text style={{fontFamily: 'SpaceGrotesk-Bold', color: COLORS.white, fontSize: SIZES.large, marginTop:15}}>Version 1.0.0</Text>
            </View>
        </SafeAreaView>
        <SafeAreaView style={{ flex: 1, justifyContent: 'flex-end',alignItems: 'center', marginBottom: 30 }}>
            <Text style={{ fontFamily: 'SpaceGrotesk-Bold', color: COLORS.white, fontSize: SIZES.large, textTransform:'uppercase' }}>© 2023 Unitevents, Inc. </Text>
            <Text style={{ fontFamily: 'SpaceGrotesk-Bold', color: COLORS.secondary, fontSize: SIZES.large }}>Made with 💛</Text>
        </SafeAreaView>
    </LinearGradient>
  )
}

export default AboutScreen
